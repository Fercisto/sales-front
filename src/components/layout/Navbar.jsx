import { Link } from "react-router-dom"
import Logo from "../common/Logo"

export default function Navbar() {
  return (
    <nav className="border-b border-gray-200 sticky top-0 backdrop-blur-sm bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Logo size="2xl" />
          </div>

          <div className="flex items-center gap-4">
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
          </div>
        </div>
      </div>
    </nav>
  )
}
