import { Link } from "react-router-dom"
import Logo from "../common/Logo"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons'
import { useAuth } from "../../hooks/useAuth"

export default function Navbar() {
  const { usuario, logout, estaAutenticado } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="border-b border-gray-200 backdrop-blur-sm bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Logo size="2xl" />
          </div>

          <div className="flex items-center gap-4">
            {estaAutenticado() ? (
              <>
                <span className="text-gray-700 font-medium">
                  Hola, {usuario?.nombre}
                </span>
                <Link
                  to={'/cart'}
                  className="relative inline-flex items-center gap-2 text-indigo-600 font-medium px-4 py-2.5 rounded-lg bg-indigo-50 group hover:bg-indigo-100"
                >
                  <FontAwesomeIcon
                    icon={faShoppingCart}
                    className="text-lg"
                  />
                  <span>Carrito</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 text-white font-medium px-6 py-2.5 rounded-lg cursor-pointer"
                >
                  Cerrar Sesión
                </button>
              </>
            ) : (
              <>
                <Link
                  to={'/login'}
                  className="text-gray-700 hover:text-black font-medium transition-colors px-6 py-2.5 rounded-lg hover:bg-gray-50"
                >
                  Iniciar Sesión
                </Link>
                <Link
                  to={'/register'}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-2.5 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  Crear Cuenta
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
