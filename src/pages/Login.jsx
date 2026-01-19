import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import Alert from "../components/common/Alert";
import { useAlert } from "../hooks/useAlert";
import { useAuth } from "../hooks/useAuth";

export default function Login() {

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const { alerta, mostrarAlerta } = useAlert();
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async e => {

    e.preventDefault();

    if (!formData.email || !formData.password) {
      mostrarAlerta('Todos los campos son obligatorios', 'error');
      return;
    }

    try {
      const response = await fetch('http://localhost/sales-api/public/api/usuarios/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if(data.error) {
        mostrarAlerta(data.error, 'error');
      } else {
        // Guardar los datos del usuario en el contexto y localStorage
        login(data.usuario);
        if (data.usuario.rol === 'vendedor') {
          navigate('/dashboard-vendedor');
        } else {
          navigate('/');
        }
      }
    } catch (error) {
      mostrarAlerta('Error de conexión con el servidor', 'error');
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
            Bienvenido de Nuevo
        </h2>

        {alerta.mostrar && <Alert tipo={alerta.tipo} mensaje={alerta.mensaje} />}

        <form
          className="flex flex-col space-y-5 w-full"
          onSubmit={handleSubmit}
        >
          <input
            type="email"
            className="bg-gray-50 p-2 border border-gray-300 rounded focus:outline-none"
            placeholder="Ingresa tu Email"
            name="email"
            onChange={handleChange}
          />

          <input
            type="password"
            className="border-gray-300 p-2 border rounded focus:outline-none"
            placeholder="Ingresa tu Password"
            name="password"
            onChange={handleChange}
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
