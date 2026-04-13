export default function Alert({ tipo, mensaje }) {

  const estilos = {
    base: 'p-2 rounded-md text-sm font-semibold mb-4 w-full text-center',
    error: 'bg-red-200 text-red-800 border border-red-300',
    success: 'bg-green-200 text-green-800 border border-green-300',
    warning: 'bg-yellow-200 text-yellow-800 border border-yellow-300'
  }

  return (
    <div className={`${estilos.base} ${estilos[tipo] || ''}`}>
      {mensaje}
    </div>
  )
}