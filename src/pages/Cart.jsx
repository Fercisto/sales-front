import { useEffect, useMemo } from "react";
import { useAuth } from "../hooks/useAuth";
import { useCart } from "../context/CartContext";
import CartItem from "../components/carrito/CartItem";
import CartSummary from "../components/carrito/CartSummary";

export default function Cart() {

  const { usuario } = useAuth();
  
  const {cart, setCart} = useCart();

  if(!usuario) {
    return;
  }

  const total = useMemo(() => {
    return cart.items?.reduce(
      (acc, item) => acc + item.precio * item.cantidad,
      0
    );
  }, [cart.items]);

  const totalItems = useMemo(() => {
    return cart.items?.reduce(
      (acc, item) => acc + item.cantidad,
      0
    );
  }, [cart.items]);

  useEffect(() => {

    const consultarCarrito = async () => {

      try {
        const response = await fetch(`http://localhost/sales-api/public/carrito/${usuario.id}`);
        const data = await response.json()
        setCart(data);
      } catch (error) {
        console.log(error);
      }

    }

    consultarCarrito();

  }, []);

  const handleQuitarItem = async (id) => {

    const carritoActualizado = cart.items.filter(item => item.id !== id);
    (carritoActualizado);

    setCart({
      ...cart,
      items: carritoActualizado
    })

    try {
      await eliminarItemCarrito(id);
    } catch (error) {
      console.log(error);
    }

  }

  const eliminarItemCarrito = async (id) => {
    try {
      await fetch(`http://localhost/sales-api/public/carrito/${id}`, {
        method: 'DELETE'
      });
    } catch (error) {
      console.log(error);
    }
  }

  const handleVaciarCarrito = async () => {
    try {
      await fetch(`http://localhost/sales-api/public/carrito/${usuario.id}/clear`, {
        method: 'DELETE'
      });

      setCart({
        items: [],
        total: 0,
        total_items: 0,
      });
    } catch (error) {
      console.log(error);
    }
  }

  const handleIncrementarCantidad = (item) => {
    const carritoActualizado = cart.items.map(currentItem => {
      if (currentItem.id === item.id) {
        const updatedItem = {
          ...currentItem,
          cantidad: currentItem.cantidad + 1
        };

        actualizarCantidad(updatedItem); 
        return updatedItem;
      }
      return currentItem;
    });

    setCart({
      ...cart,
      items: carritoActualizado
    });
  }

  const handleDecrementarCantidad = (item) => {
    const carritoActualizado = cart.items.map(currentItem => {
      if (currentItem.id === item.id) {
        const updatedItem = {
          ...currentItem,
          cantidad: currentItem.cantidad - 1
        };

        actualizarCantidad(updatedItem); 
        return updatedItem;
      }
      return currentItem;
    });

    setCart({
      ...cart,
      items: carritoActualizado
    });
  }

  const actualizarCantidad = async (item) => {

    try {

      const response = await fetch(`http://localhost/sales-api/public/carrito/${item.id}`, {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(item),
      });

      const data = await response.json();
      
    } catch (error) {
      console.log(error);
    }
    
  }

  if (!cart) {
    return (
      <div className="container mx-auto p-6">
        <p>Cargando carrito...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
      <h2 className="text-4xl mb-5 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent hover:from-indigo-700 font-bold">Carrito de Compras</h2>

      {cart.items?.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-500 text-lg">Tu carrito está vacío</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {cart.items?.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                onIncrement={handleIncrementarCantidad}
                onDecrement={handleDecrementarCantidad}
                onRemove={handleQuitarItem}
              />
            ))}
          </div>

          <div className="lg:col-span-1">
            <CartSummary
              totalItems={totalItems}
              total={total}
              onClearCart={handleVaciarCarrito}
              cart={cart}
            />
          </div>
        </div>
      )}
    </div>
  )
}