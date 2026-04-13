import { Link } from "react-router-dom"
import { getInitials, getColorFromName, formatPrice } from "../../utils/productUtils"

export default function ProductList({productos}) {

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {productos.map(producto => (
        <div
          key={producto.id}
          className="bg-white rounded-xl shadow-md overflow-hidden group"
        >
          <div className={`h-40 bg-gradient-to-br ${getColorFromName(producto.nombre)} flex items-center justify-center relative`}>
            <div className="text-white text-5xl font-bold opacity-90">
              {getInitials(producto.nombre)}
            </div>

            <div className="absolute top-3 right-3">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                producto.stock > 20
                  ? 'bg-green-100 text-green-800'
                  : producto.stock > 0
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                Stock: {producto.stock}
              </span> 
            </div>
          </div>

          <div className="p-5">
            <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2">
              {producto.nombre}
            </h3>

            <p className="text-sm text-gray-600 mb-4 line-clamp-2">
              {producto.descripcion}
            </p>

            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              <div>
                <p className="text-xs text-gray-500 mb-1">Precio</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatPrice(producto.precio)}
                </p>
              </div>
            </div>

            <Link
              className="block w-full mt-4 bg-blue-600 hover:bg-blue-700 text-center cursor-pointer text-white font-semibold py-2.5 rounded-lg transition-colors duration-200"
              to={`/productos/${producto.id}`}
            >
              Ver detalles
            </Link>
          </div>
        </div>
      ))}
    </div>
  )
}
