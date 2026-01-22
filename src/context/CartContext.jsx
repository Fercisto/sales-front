import { createContext, useState, useContext } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {

  const [cart, setCart] = useState({
    items: [],
    total: 0,
    total_items: 0,
  });

  const vaciarCarrito = async (usuarioId) => {
    try {
      await fetch(`http://localhost/sales-api/public/carrito/${usuarioId}/clear`, {
        method: 'DELETE'
      });
      setCart({ items: [], total: 0, total_items: 0 });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <CartContext.Provider value={{ cart, setCart, vaciarCarrito }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart debe usarse dentro de CartProvider");
  }
  return context;
};