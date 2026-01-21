import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";

export default function CartSummary({ totalItems, total, onClearCart, cart }) {

  const { usuario } = useAuth();
  
  if(!usuario) {
    return;
  }

  const handleRealizarPedido = () => {
    const pedido = {
      comprador_id: usuario.id,
      productos: cart.items,
    };

    realizarPedido(pedido);
  };

  const realizarPedido = async (pedido) => {
    console.log(pedido);

    try {
      const response = await fetch("http://localhost/sales-api/public/api/pedidos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pedido),
      });

      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error(error);
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

      <button
        className="block text-center w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded mb-3 cursor-pointer"
        onClick={handleRealizarPedido}
      >
        Realizar Pedido
      </button>

      <button
        className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 rounded cursor-pointer"
        onClick={onClearCart}
      >
        Vaciar Carrito
      </button>
    </div>
  );
}
