import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const usuarioGuardado = localStorage.getItem('usuario');
    if (usuarioGuardado) {
      try {
        setUsuario(JSON.parse(usuarioGuardado));
      } catch (error) {
        console.error('Error al parsear usuario:', error);
        localStorage.removeItem('usuario');
      }
    }
    setCargando(false);
  }, []);

  // Función para hacer login
  const login = (datosUsuario) => {
    setUsuario(datosUsuario);
    localStorage.setItem('usuario', JSON.stringify(datosUsuario));
  };

  // Función para hacer logout
  const logout = () => {
    setUsuario(null);
    localStorage.removeItem('usuario');
  };

  // Verificar si el usuario está autenticado
  const estaAutenticado = () => {
    return usuario !== null;
  };

  const value = {
    usuario,
    login,
    logout,
    estaAutenticado,
    cargando
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
