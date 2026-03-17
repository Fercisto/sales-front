import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import CheckoutModal from "./CheckoutModal";

export default function CartSummary({ totalItems, total, onClearCart, cart }) {

  const { usuario } = useAuth();
  const [modalAbierto, setModalAbierto] = useState(false);

  if (!usuario) {
    return null;
  }

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
          <span>${total?.toFixed(2)}</span>
        </div>
      </div>

      <div className="border-t border-t-gray-200 pt-4 mb-4">
        <div className="flex justify-between items-center text-xl font-bold">
          <span>Total:</span>
          <span className="text-black text-2xl">${total?.toFixed(2)}</span>
        </div>
      </div>

      <button
        className="block text-center w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded mb-3 cursor-pointer"
        onClick={() => setModalAbierto(true)}
      >
        Realizar Pedido
      </button>

      <button
        className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 rounded cursor-pointer"
        onClick={onClearCart}
      >
        Vaciar Carrito
      </button>

      {modalAbierto && (
        <CheckoutModal
          total={total}
          cart={cart}
          usuario={usuario}
          onClose={() => setModalAbierto(false)}
        />
      )}
    </div>
  );
}
