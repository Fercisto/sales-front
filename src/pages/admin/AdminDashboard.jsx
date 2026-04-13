import { useEffect, useState } from "react";

const API = "http://localhost/sales-api/public";

// ─── Helpers ────────────────────────────────────────────────────────────────

function formatFecha(fecha) {
  if (!fecha) return "—";
  return new Date(fecha).toLocaleDateString("es-MX", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function EstatusBadge({ estatus }) {
  const colores = {
    pendiente: "bg-yellow-100 text-yellow-800",
    pagado: "bg-green-100 text-green-800",
    aprobado: "bg-green-100 text-green-800",
    enviado: "bg-blue-100 text-blue-800",
    entregado: "bg-purple-100 text-purple-800",
    cancelado: "bg-red-100 text-red-800",
    CANCELADO: "bg-red-100 text-red-800",
    rechazado: "bg-red-100 text-red-800",
    reembolsado: "bg-orange-100 text-orange-800",
    admin: "bg-indigo-100 text-indigo-800",
    comprador: "bg-gray-100 text-gray-700",
  };
  const clase = colores[estatus] ?? "bg-gray-100 text-gray-700";
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${clase}`}>
      {estatus}
    </span>
  );
}

function Spinner() {
  return (
    <div className="flex justify-center py-16">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600" />
    </div>
  );
}

// ─── Tab: Pedidos ────────────────────────────────────────────────────────────

function TabPedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actualizando, setActualizando] = useState(null);

  useEffect(() => {
    fetch(`${API}/pedidos`)
      .then((r) => r.json())
      .then(setPedidos)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const cambiarEstatus = async (pedidoId, nuevoEstatus) => {
    setActualizando(pedidoId);
    try {
      const res = await fetch(`${API}/pedidos/${pedidoId}/estatus`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estatus: nuevoEstatus }),
      });
      if (res.ok) {
        setPedidos((prev) =>
          prev.map((p) => p.id === pedidoId ? { ...p, estatus: nuevoEstatus } : p)
        );
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActualizando(null);
    }
  };

  const cancelarPedido = async (pedidoId, estatusPedido) => {
    const estaPagado = estatusPedido?.toLowerCase() === "pagado";
    const confirmMsg = estaPagado
      ? "Este pedido ya fue pagado. ¿Cancelar y reembolsar al comprador?"
      : "¿Cancelar este pedido? Se restaurará el stock.";

    if (!confirm(confirmMsg)) return;
    setActualizando(pedidoId);

    try {
      // Si el pedido está pagado, primero reembolsar
      if (estaPagado) {
        const pagosRes = await fetch(`${API}/pagos/${pedidoId}/pedido`);
        const pagosData = await pagosRes.json();
        const pagoAprobado = pagosData.pagos?.find((p) => p.estatus === "aprobado");

        if (pagoAprobado) {
          const refundRes = await fetch(`${API}/pagos/${pagoAprobado.id}/reembolsar`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
          });
          if (!refundRes.ok) {
            const err = await refundRes.json();
            alert("Error al reembolsar: " + (err.mensaje ?? err.error ?? "Error desconocido"));
            return;
          }
        }
      }

      // Cancelar el pedido (restaura stock)
      const res = await fetch(`${API}/pedidos/${pedidoId}/cancelar`, { method: "PATCH" });
      if (res.ok) {
        setPedidos((prev) =>
          prev.map((p) => p.id === pedidoId ? { ...p, estatus: "CANCELADO" } : p)
        );
      }
    } catch (err) {
      console.error(err);
      alert("Error al cancelar el pedido");
    } finally {
      setActualizando(null);
    }
  };

  if (loading) return <Spinner />;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-gray-500">{pedidos.length} pedidos en total</p>
        <p className="text-sm font-semibold text-indigo-600">
          Total facturado: $
          {pedidos
            .filter((p) => p.estatus?.toLowerCase() !== "cancelado")
            .reduce((acc, p) => acc + (p.total || 0), 0)
            .toFixed(2)}
        </p>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-4 py-3 text-left">#</th>
              <th className="px-4 py-3 text-left">Comprador</th>
              <th className="px-4 py-3 text-left">Fecha</th>
              <th className="px-4 py-3 text-right">Total</th>
              <th className="px-4 py-3 text-center">Estatus</th>
              <th className="px-4 py-3 text-center">Cambiar estatus</th>
              <th className="px-4 py-3 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {pedidos.map((p) => {
              const cancelado  = p.estatus?.toUpperCase() === "CANCELADO";
              const pendiente  = p.estatus?.toLowerCase() === "pendiente";
              return (
                <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-mono text-gray-500">#{p.id}</td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-800">{p.comprador_nombre}</p>
                    <p className="text-gray-400 text-xs">{p.comprador_email}</p>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{formatFecha(p.fecha)}</td>
                  <td className="px-4 py-3 text-right font-semibold text-gray-800">
                    ${p.total?.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <EstatusBadge estatus={p.estatus} />
                  </td>
                  <td className="px-4 py-3 text-center">
                    {!cancelado && (
                      <select
                        className="text-xs border border-gray-200 rounded px-2 py-1 bg-white cursor-pointer"
                        value={p.estatus?.toLowerCase()}
                        disabled={actualizando === p.id}
                        onChange={(e) => cambiarEstatus(p.id, e.target.value)}
                      >
                        <option value="pendiente">Pendiente</option>
                        <option value="pagado">Pagado</option>
                        <option value="enviado">Enviado</option>
                        <option value="entregado">Entregado</option>
                      </select>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {pendiente && (
                      <span className="text-xs text-yellow-600 bg-yellow-50 border border-yellow-200 px-2 py-1 rounded">
                        Procesando...
                      </span>
                    )}
                    {!cancelado && !pendiente && (
                      <button
                        onClick={() => cancelarPedido(p.id, p.estatus)}
                        disabled={actualizando === p.id}
                        className="text-xs px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50 cursor-pointer"
                      >
                        {actualizando === p.id ? "..." : "Cancelar"}
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Tab: Pagos ──────────────────────────────────────────────────────────────

function TabPagos() {
  const [pagos, setPagos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/pagos`)
      .then((r) => r.json())
      .then(setPagos)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;

  const totalAprobado = pagos
    .filter((p) => p.estatus === "aprobado")
    .reduce((acc, p) => acc + (p.monto || 0), 0);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-gray-500">{pagos.length} pagos registrados</p>
        <p className="text-sm font-semibold text-green-600">
          Total aprobado: ${totalAprobado.toFixed(2)}
        </p>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-4 py-3 text-left">#</th>
              <th className="px-4 py-3 text-left">Pedido</th>
              <th className="px-4 py-3 text-left">Método</th>
              <th className="px-4 py-3 text-left">Conekta Order ID</th>
              <th className="px-4 py-3 text-right">Monto</th>
              <th className="px-4 py-3 text-center">Estatus</th>
              <th className="px-4 py-3 text-left">Último evento</th>
              <th className="px-4 py-3 text-left">Fecha</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {pagos.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 font-mono text-gray-500">#{p.id}</td>
                <td className="px-4 py-3 font-mono text-gray-600">#{p.pedido_id}</td>
                <td className="px-4 py-3 capitalize text-gray-700">{p.metodo_pago}</td>
                <td className="px-4 py-3">
                  {p.conekta_order_id ? (
                    <span className="font-mono text-xs text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                      {p.conekta_order_id}
                    </span>
                  ) : (
                    <span className="text-gray-400 text-xs">—</span>
                  )}
                </td>
                <td className="px-4 py-3 text-right font-semibold text-gray-800">
                  ${p.monto?.toFixed(2)}
                </td>
                <td className="px-4 py-3 text-center">
                  <EstatusBadge estatus={p.estatus} />
                </td>
                <td className="px-4 py-3 text-xs text-gray-500 font-mono">
                  {p.last_webhook_event ?? "—"}
                </td>
                <td className="px-4 py-3 text-gray-600">{formatFecha(p.created_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Tab: Usuarios ───────────────────────────────────────────────────────────

function TabUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/usuarios`)
      .then((r) => r.json())
      .then(setUsuarios)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;

  return (
    <div>
      <div className="mb-4">
        <p className="text-sm text-gray-500">{usuarios.length} usuarios registrados</p>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-4 py-3 text-left">#</th>
              <th className="px-4 py-3 text-left">Nombre</th>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-center">Rol</th>
              <th className="px-4 py-3 text-left">Registro</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {usuarios.map((u) => (
              <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 font-mono text-gray-500">#{u.id}</td>
                <td className="px-4 py-3 font-medium text-gray-800">{u.nombre}</td>
                <td className="px-4 py-3 text-gray-600">{u.email}</td>
                <td className="px-4 py-3 text-center">
                  <EstatusBadge estatus={u.rol} />
                </td>
                <td className="px-4 py-3 text-gray-600">{formatFecha(u.created_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Dashboard principal ─────────────────────────────────────────────────────

const TABS = [
  { key: "pedidos", label: "Pedidos" },
  { key: "pagos",   label: "Pagos" },
  { key: "usuarios", label: "Usuarios" },
];

export default function AdminDashboard() {
  const [tabActiva, setTabActiva] = useState("pedidos");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">

      <h2 className="text-4xl mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent font-bold">
        Panel de Administración
      </h2>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b border-gray-200">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setTabActiva(tab.key)}
            className={`px-5 py-2.5 text-sm font-medium rounded-t-lg transition-colors cursor-pointer ${
              tabActiva === tab.key
                ? "bg-white border border-b-white border-gray-200 -mb-px text-indigo-600"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Contenido */}
      <div className="bg-white rounded-lg shadow p-6">
        {tabActiva === "pedidos"  && <TabPedidos />}
        {tabActiva === "pagos"    && <TabPagos />}
        {tabActiva === "usuarios" && <TabUsuarios />}
      </div>
    </div>
  );
}
