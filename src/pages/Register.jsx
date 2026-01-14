import { Link } from "react-router-dom"
import { useState } from "react";

export default function Register() {

      
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    rol: 'comprador'
  });

  const handleSubmit = async (e) => {
    e.preventDefault()

    const response = await fetch('http://localhost/sales-api/public/api/usuarios', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData)
    })

    const data = await response.json()

  } 

  const handleChange = e => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="mt-20 flex items-center justify-center">
      <div className="flex items-center justify-center flex-col bg-white w-full max-w-md rounded shadow p-8 py-12">
        <h2 className="font-black text-2xl text-center mb-5">
            Crear Cuenta
        </h2>

        <form className="flex flex-col space-y-5 w-full" onSubmit={handleSubmit}>
          <input
            type="text"
            className="bg-gray-50 p-2 border border-gray-300 rounded focus:outline-none"
            name="nombre"
            placeholder="Ingresa tu Nombre"
            onChange={handleChange}
          />

          <input
            type="email"
            className="bg-gray-50 p-2 border border-gray-300 rounded focus:outline-none"
            name="email"
            placeholder="Ingresa tu Email"
            onChange={handleChange}
          />

          <input
            type="password"
            className="bg-gray-50 border-gray-300 p-2 border rounded focus:outline-none"
            name="password"
            placeholder="Ingresa tu Password"
            onChange={handleChange}
          />

          <input
            type="password"
            className="bg-gray-50 border-gray-300 p-2 border rounded focus:outline-none"
            placeholder="Confirma tu Password"
          />

          <select
            className="bg-gray-50 p-2 border border-gray-300 rounded focus:outline-none"
            defaultValue=""
            onChange={handleChange}
            name="rol"
          >
            <option value="" disabled>Selecciona tu Rol</option>
            <option value="comprador">Comprador</option>
            <option value="vendedor">Vendedor</option>
          </select>

          <input
            type="submit"
            value="Crear Cuenta"
            className="bg-indigo-600 hover:bg-indigo-700 text-white p-2 font-bold rounded cursor-pointer"
          />
        </form>

        <span className="mt-4">¿Ya tienes una cuenta? <Link to="/login" className="text-indigo-600 hover:text-indigo-700">Iniciar Sesión</Link></span>

      </div>
    </div>
  )
}