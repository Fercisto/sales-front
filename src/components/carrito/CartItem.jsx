export default function CartItem({ item, onIncrement, onDecrement, onRemove }) {
  return (
    <div className="bg-white rounded-lg shadow p-4 flex items-center gap-4">
      <div className="flex-1">
        <h3 className="font-semibold text-lg">{item.producto_nombre}</h3>
        <p className="text-gray-600 text-sm">{item.descripcion}</p>
        <p className="font-bold mt-2">${item.precio}</p>

        <div className="flex flex-col gap-2 mt-3 w-fit">
          <span className="text-xs text-gray-500">Cantidad:</span>
          <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
            <button
              className="bg-white hover:bg-gray-100 text-gray-700 font-bold w-7 h-7 flex items-center justify-center border-r border-gray-300 transition cursor-pointer text-sm"
              onClick={() => onDecrement(item)}
            >
              -
            </button>
            <input
              type="number"
              value={item.cantidad}
              className="w-10 h-7 text-center text-sm font-semibold border-0 outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              min="1"
              readOnly
            />
            <button
              className="bg-white hover:bg-gray-100 text-gray-700 font-bold w-7 h-7 flex items-center justify-center border-l border-gray-300 transition cursor-pointer text-sm"
              onClick={() => onIncrement(item)}
            >
              +
            </button>
          </div>
        </div>

        <p className="text-sm text-gray-600 mt-2">
          Subtotal: <span className="font-semibold">${item.precio * item.cantidad}</span>
        </p>
      </div>

      <button
        className="bg-red-500 hover:bg-red-600 font-semibold cursor-pointer text-white px-4 py-2 rounded"
        onClick={() => onRemove(item.id)}
      >
        Quitar
      </button>
    </div>
  );
}
