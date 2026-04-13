import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export default function ProtectedRoute({ children, rolesPermitidos = [] }) {
  const { usuario, cargando } = useAuth();

  // Mientras carga, muestra un spinner o nada
  if (cargando) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Cargando...</div>
      </div>
    );
  }

  // Si no hay usuario, redirige al login
  if (!usuario) {
    return <Navigate to="/login" replace />;
  }

  // Si se especifican roles permitidos, verificar que el usuario tenga uno de ellos
  if (rolesPermitidos.length > 0 && !rolesPermitidos.includes(usuario.rol)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Si todo está bien, muestra el componente
  return children;
}
