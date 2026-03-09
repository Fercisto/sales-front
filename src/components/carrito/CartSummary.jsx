import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useCart } from "../../context/CartContext";

export default function CartSummary({ totalItems, total, onClearCart, cart }) {

  const { usuario } = useAuth();
  const { vaciarCarrito } = useCart();
  const navigate = useNavigate();
  const [procesando, setProcesando] = useState(false);
  const [error, setError] = useState(null);

  if(!usuario) {
    return;
  }

  const handleRealizarPedido = async () => {
    setError(null);
    setProcesando(true);

    try {
      const response = await fetch("http://localhost/sales-api/public/pedidos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          comprador_id: usuario.id,
          productos: cart.items,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        await vaciarCarrito(usuario.id);
        navigate('/pedidos');
      } else {
        setError(data.error || 'No se pudo confirmar el pedido');
      }
    } catch (error) {
      setError('Error de conexión. Intenta de nuevo.');
    } finally {
      setProcesando(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 sticky top-6">
      <h2 className="text-xl font-bold mb-4">Resumen del Pedido</h2>

      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-gray-600">
          <span>Total de productos:</span>
          <span>{totalItems}</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>Subtotal:</span>
          <span>${total}</span>
        </div>
      </div>

      <div className="border-t border-t-gray-200 pt-4 mb-4">
        <div className="flex justify-between items-center text-xl font-bold">
          <span>Total:</span>
          <span className="text-black text-2xl">${total}</span>
        </div>
      </div>

      {error && (
        <div className="mb-3 p-3 bg-red-100 text-red-700 text-sm rounded">
          {error}
        </div>
      )}

      <button
        className="block text-center w-full bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded mb-3 cursor-pointer"
        onClick={handleRealizarPedido}
        disabled={procesando}
      >
        {procesando ? 'Confirmando...' : 'Realizar Pedido'}
      </button>

      <button
        className="w-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50 text-gray-700 font-semibold py-2 rounded cursor-pointer"
        onClick={onClearCart}
        disabled={procesando}
      >
        Vaciar Carrito
      </button>
    </div>
  );
}
