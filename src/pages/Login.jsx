import { Link } from "react-router-dom"

export default function Login() {
  return (
    <div className="mt-20 flex items-center justify-center">
      <div className="flex items-center justify-center flex-col bg-white w-full max-w-md rounded shadow p-8 py-12">
        <h2 className="font-black text-2xl text-center mb-5">
            Bienvenido de Nuevo
        </h2>

        <form className="flex flex-col space-y-5 w-full">
          <input
            type="text"
            className="bg-gray-50 p-2 border border-gray-300 rounded focus:outline-none"
            placeholder="Ingresa tu Email"
          />

          <input
            type="password"
            className="border-gray-300 p-2 border rounded focus:outline-none"
            placeholder="Ingresa tu Password"
          />

          <input
            type="submit"
            value="Iniciar Sesión"
            className="bg-indigo-600 hover:bg-indigo-700 text-white p-2 font-bold rounded cursor-pointer"
          />
        </form>

        <span className="mt-4">¿Aún no tienes una cuenta? <Link to="/register" className="text-indigo-600 hover:text-indigo-700">Crear Cuenta</Link></span>

      </div>
    </div>
  )
}
