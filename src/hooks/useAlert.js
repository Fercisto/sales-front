import { useState } from 'react';

export const useAlert = () => {
  const [alerta, setAlerta] = useState({
    tipo: '',
    mostrar: false,
    mensaje: '',
  });

  const mostrarAlerta = (mensaje, tipo = 'error') => {
    setAlerta({
      tipo,
      mostrar: true,
      mensaje,
    });

    setTimeout(() => {
      ocultarAlerta();
    }, 4000);
  };

  const ocultarAlerta = () => {
    setAlerta({
      tipo: '',
      mostrar: false,
      mensaje: '',
    });
  };

  return {
    alerta,
    mostrarAlerta,
    ocultarAlerta,
  };
};