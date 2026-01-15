import { Link } from "react-router-dom";

export default function CartSummary({ totalItems, total, onClearCart }) {
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

      <Link
        className="block text-center w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded mb-3 cursor-pointer"
        to={'/pago'}
      >
        Proceder al Pago
      </Link>

      <button
        className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 rounded cursor-pointer"
        onClick={onClearCart}
      >
        Vaciar Carrito
      </button>
    </div>
  );
}
