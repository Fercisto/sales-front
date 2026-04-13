import { useState } from "react";
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../hooks/useAuth"
import { useCart } from "../../context/CartContext";
import { useAlert } from "../../hooks/useAlert";
import Alert from "../common/Alert";
import { getInitials, getColorFromName, formatPrice } from "../../utils/productUtils";

export default function ProductDetailView({producto}) {

  const { usuario } = useAuth();
  const { setCart } = useCart();

  const [cantidad, setCantidad] = useState(1);

  const { alerta, mostrarAlerta } = useAlert();

  const navigate = useNavigate();

  const handleAgregarAlCarrito = async () => {

    const usuario_id = usuario.id;

    if(usuario_id < 0) {
      return;
    }

    const nuevoCarrito = {
      usuario_id,
      producto_id: producto.id,
      cantidad: cantidad
    };

    setCart(nuevoCarrito);

    try {

      const response = await fetch('http://localhost/sales-api/public/carrito', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(nuevoCarrito)
      });

      const data = await response.json();

      if(data.error) {
        mostrarAlerta('Hubo un error al agregar el producto', 'error');
        return;
      }

      navigate('/carrito');

    } catch (error) {
      console.log(error);
    }

  }

  const handleIncrementarCantidad = () => {
    setCantidad(cantidad + 1);
  }

  const handleDecrementarCantidad = () => {

    if(cantidad === 0) {
      return;
    }

    setCantidad(cantidad - 1);

  }

  if (!producto) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 text-center">
        <p className="text-gray-500 text-lg">Cargando producto...</p>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">      
        <div className="grid md:grid-cols-2 gap-8">
          <div className="relative">
            <div className={`h-96 md:h-full bg-gradient-to-br ${getColorFromName(producto.nombre)} flex items-center justify-center`}>
              <div className="text-white text-9xl font-bold opacity-90">
                {getInitials(producto.nombre)}
              </div>
            </div>

            <div className="absolute top-6 right-6">
              <span className={`px-4 py-2 rounded-full text-sm font-bold shadow-lg ${
                producto.stock > 20
                  ? 'bg-green-500 text-white'
                  : producto.stock > 0
                  ? 'bg-yellow-500 text-white'
                  : 'bg-red-500 text-white'
              }`}>
                {producto.stock > 0 ? `${producto.stock} disponibles` : 'Sin stock'}
              </span>
            </div>
          </div>

          <div className="p-8 flex flex-col justify-between">
            <div>
              <div className="mb-6">
                <h1 className="text-4xl font-bold text-gray-900 mb-3">
                  {producto.nombre}
                </h1>
              </div>

              <div className="mb-6 pb-6 border-b border-gray-200">
                <p className="text-sm text-gray-500 mb-2">Precio</p>
                <p className="text-5xl font-bold text-gray-900">
                  {formatPrice(producto.precio)}
                </p>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Descripción</h3>
                <p className="text-gray-600 leading-relaxed">
                  {producto.descripcion}
                </p>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Disponibilidad</h3>
                <p className={`font-semibold leading-relaxed ${
                  producto.stock > 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {producto.stock > 0 ? 'En stock' : 'Agotado'}
                </p>
              </div>

            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Cantidad
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer rounded-md text-gray-700 transition-colors"
                    onClick={handleDecrementarCantidad}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                  </button>

                  <input
                    type="number"
                    min="1"
                    max={producto.stock}
                    value={cantidad}
                    onChange={e => setCantidad(e.target.value)}
                    disabled={producto.stock === 0}
                    className="w-16 h-8 text-center text-sm font-semibold border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-100"
                  />

                  <button
                    type="button"
                    className="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer rounded-md text-gray-700 transition-colors"
                    onClick={handleIncrementarCantidad}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>

                </div>
              </div>

              <button
                disabled={producto.stock === 0}
                className={`w-full flex items-center justify-center gap-3 font-bold py-4 rounded-lg text-lg cursor-pointer transition-colors ${
                  producto.stock === 0
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700 text-white shadow-lg'
                }`}
                onClick={handleAgregarAlCarrito}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {producto.stock === 0 ? 'Producto agotado' : 'Agregar al carrito'}
              </button>

              {alerta.mostrar && <Alert tipo={alerta.tipo} mensaje={alerta.mensaje} />}

            </div>
          </div>
        </div>
      </div>
    </div>
    
  )
}