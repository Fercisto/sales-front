import { useEffect, useState } from 'react'
import { useAuth } from '../hooks/useAuth'

export default function Orders() {
  const { usuario } = useAuth();
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelando, setCancelando] = useState(null);

  useEffect(() => {
    const cargarPedidos = async () => {
      if (!usuario) return;

      try {
        const response = await fetch(
          `http://localhost/sales-api/public/pedidos?usuario_id=${usuario.id}`
        );
        const lista = await response.json();

        const detalles = await Promise.all(
          lista.map(p =>
            fetch(`http://localhost/sales-api/public/pedidos/${p.id}`)
              .then(r => r.json())
          )
        );

        setPedidos(detalles);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    cargarPedidos();
  }, [usuario]);

  const getEstatusColor = (estatus) => {
    const colores = {
      pendiente: 'bg-yellow-100 text-yellow-800',
      pagado: 'bg-green-100 text-green-800',
      enviado: 'bg-blue-100 text-blue-800',
      entregado: 'bg-purple-100 text-purple-800',
      cancelado: 'bg-red-100 text-red-800'
    };
    return colores[estatus] || 'bg-gray-100 text-gray-800';
  };

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const cancelarPedido = async (pedidoId, estatusPedido) => {
    setCancelando(pedidoId);
    try {
      const API = 'http://localhost/sales-api/public';

      // Si el pedido está pagado, primero reembolsar
      if (estatusPedido?.toLowerCase() === 'pagado') {
        const pagosRes = await fetch(`${API}/pagos/${pedidoId}/pedido`);
        const pagosData = await pagosRes.json();
        const pagoAprobado = pagosData.pagos?.find(p => p.estatus === 'aprobado');

        if (pagoAprobado) {
          const refundRes = await fetch(`${API}/pagos/${pagoAprobado.id}/reembolsar`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
          });
          if (!refundRes.ok) {
            const err = await refundRes.json();
            alert('Error al reembolsar: ' + (err.mensaje ?? err.error ?? 'Error desconocido'));
            return;
          }
        }
      }

      // Cancelar el pedido (restaura stock)
      const response = await fetch(
        `${API}/pedidos/${pedidoId}/cancelar`,
        { method: 'PATCH' }
      );
      const data = await response.json();

      if (response.ok) {
        setPedidos(pedidos.map(p =>
          p.id === pedidoId ? { ...p, estatus: 'Cancelado' } : p
        ));
      } else {
        alert(data.error || 'Error al cancelar');
      }
    } catch (error) {
      console.log(error);
      alert('Error al cancelar el pedido');
    } finally {
      setCancelando(null);
    }
  };

  if (!usuario) {
    return null;
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <h2 className="text-4xl mb-5 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent font-bold">
          Mis Pedidos
        </h2>
        <div className="bg-white rounded-lg p-8 text-center shadow">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="text-gray-500 mt-4">Cargando pedidos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
      <h2 className="text-4xl mb-5 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent font-bold">
        Mis Pedidos
      </h2>

      {pedidos.length === 0 ? (
        <div className="bg-white rounded-lg p-8 text-center shadow">
          <svg
            className="mx-auto h-16 w-16 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
          <p className="text-gray-500 text-lg mt-4">No tienes pedidos aún</p>
          <a
            href="/productos"
            className="inline-block mt-4 px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all"
          >
            Ver productos
          </a>
        </div>
      ) : (
        <div className="space-y-4">
          {pedidos.map((pedido) => (
            <div key={pedido.id} className="bg-white rounded-lg shadow">

              {/* Encabezado */}
              <div className="p-6 pb-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full p-3">
                      <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Pedido #{pedido.id}</p>
                      <p className="font-semibold text-gray-900">{formatearFecha(pedido.fecha)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${getEstatusColor(pedido.estatus?.toLowerCase())}`}>
                      {pedido.estatus}
                    </span>
                    <p className="text-xl font-bold text-indigo-600">${pedido.total?.toFixed(2)}</p>
                    {pedido.estatus?.toLowerCase() === 'pendiente' && (
                      <span className="px-3 py-1 text-sm bg-yellow-50 text-yellow-700 border border-yellow-200 rounded-lg">
                        Procesando pago...
                      </span>
                    )}
                    {pedido.estatus?.toLowerCase() === 'pagado' && (
                      <button
                        onClick={() => cancelarPedido(pedido.id, pedido.estatus)}
                        disabled={cancelando === pedido.id}
                        className="px-3 py-1 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                      >
                        {cancelando === pedido.id ? 'Cancelando...' : 'Cancelar'}
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Productos */}
              <div className="border-t border-gray-100 px-6 pb-6">
                <table className="w-full mt-4 text-sm">
                  <thead>
                    <tr className="text-left text-gray-500 border-b border-gray-100">
                      <th className="pb-2 font-medium">Producto</th>
                      <th className="pb-2 font-medium text-center">Cantidad</th>
                      <th className="pb-2 font-medium text-right">Precio unitario</th>
                      <th className="pb-2 font-medium text-right">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pedido.productos?.map((prod) => (
                      <tr key={prod.id} className="border-b border-gray-50">
                        <td className="py-2 text-gray-800">{prod.nombre}</td>
                        <td className="py-2 text-center text-gray-600">{prod.cantidad}</td>
                        <td className="py-2 text-right text-gray-600">${prod.precio_unitario?.toFixed(2)}</td>
                        <td className="py-2 text-right font-medium text-gray-800">${prod.subtotal?.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan={3} className="pt-3 text-right font-semibold text-gray-700">Total:</td>
                      <td className="pt-3 text-right font-bold text-indigo-600">${pedido.total?.toFixed(2)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>

            </div>
          ))}
        </div>
      )}

      {pedidos.length > 0 && (
        <div className="mt-6 bg-white rounded-lg p-6 shadow">
          <div className="flex justify-between items-center">
            <p className="text-gray-600">
              Total de pedidos: <span className="font-semibold">{pedidos.length}</span>
            </p>
            <p className="text-gray-600">
              Total gastado:{' '}
              <span className="font-bold text-indigo-600">
                ${pedidos.reduce((acc, p) => p.estatus?.toLowerCase() !== 'cancelado' ? acc + (p.total || 0) : acc, 0).toFixed(2)}
              </span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
