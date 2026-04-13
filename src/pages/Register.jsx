import { Link } from "react-router-dom"
import { useState } from "react";
import Alert from "../components/common/Alert";
import { useAlert } from "../hooks/useAlert";

export default function Register() {
      
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    rol: 'comprador'
  });

  const [confirmacionPassword, setConfirmacionPassword] = useState('');

  const { alerta, mostrarAlerta } = useAlert();

  const handleSubmit = async (e) => {
    e.preventDefault()

    const noEsValido = Object.values(formData).includes('');

    if(confirmacionPassword.trim() !== formData.password.trim()) {
      mostrarAlerta('Las contraseñas deben de ser iguales', 'error');
      return;
    }

    if(noEsValido) {
      mostrarAlerta('Completa todos los campos', 'error');
      return;
    }

    const response = await fetch('http://localhost/sales-api/public/api/usuarios', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData)
    })

    const data = await response.json()

    if(data) {
      mostrarAlerta('Cuenta creada correctamente', 'success');
      setTimeout(() => {
        // Redirigir
      }, 3500);
    }

  }

  const handleChange = e => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  }

  return (
    <div className="mt-20 flex items-center justify-center">
      <div className="flex items-center justify-center flex-col bg-white w-full max-w-md rounded shadow p-8 py-12">
        <h2 className="font-black text-2xl text-center mb-5">
            Crear Cuenta
        </h2>

        {alerta.mostrar && <Alert tipo={alerta.tipo} mensaje={alerta.mensaje} />}

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
            name="confirmacionPassword"
            onChange={e => setConfirmacionPassword(e.target.value)}
          />


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