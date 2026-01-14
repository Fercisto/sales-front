import { Link } from "react-router-dom"
import Logo from "../common/Logo"

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo y descripción */}
          <div className="col-span-1 md:col-span-2">
            <Logo size="3xl" />
            <p className="mt-4 text-gray-600 max-w-md">
              Tu plataforma de confianza para las mejores ventas online.
              Calidad, seguridad y los mejores precios garantizados.
            </p>
          </div>

          {/* Enlaces rápidos */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Enlaces Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-600 hover:text-indigo-600 transition-colors">
                  Inicio
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-gray-600 hover:text-indigo-600 transition-colors">
                  Productos
                </Link>
              </li>
              <li>
                <Link to="/cart" className="text-gray-600 hover:text-indigo-600 transition-colors">
                  Carrito
                </Link>
              </li>
            </ul>
          </div>

          {/* Cuenta */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Cuenta</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/login" className="text-gray-600 hover:text-indigo-600 transition-colors">
                  Iniciar Sesión
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-gray-600 hover:text-indigo-600 transition-colors">
                  Crear Cuenta
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-center text-gray-600 text-sm">
            © {new Date().getFullYear()} Master Sales. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}
