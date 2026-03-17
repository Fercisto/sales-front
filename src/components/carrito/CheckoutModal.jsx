import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";

const CONEKTA_PUBLIC_KEY = "key_H9DhTiiH3VqTjInPvkUP9gm";
const API_URL = "http://localhost/sales-api/public";

export default function CheckoutModal({ total, cart, usuario, onClose }) {
  const navigate = useNavigate();
  const { vaciarCarrito } = useCart();

  const [form, setForm] = useState({
    nombre: usuario?.nombre ?? "",
    numero: "",
    mes: "",
    anio: "",
    cvv: "",
  });
  const [procesando, setProcesando] = useState(false);
  const [error, setError] = useState(null);
  const [exito, setExito] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "numero") {
      // Solo dígitos, máx 16, con espacios cada 4
      const digits = value.replace(/\D/g, "").slice(0, 16);
      const formatted = digits.replace(/(.{4})/g, "$1-").replace(/-$/, "");
      setForm({ ...form, numero: formatted });
      return;
    }

    if (name === "mes" || name === "anio" || name === "cvv") {
      // Solo dígitos
      setForm({ ...form, [name]: value.replace(/\D/g, "") });
      return;
    }

    setForm({ ...form, [name]: value });
  };

  const handlePagar = async (e) => {
    e.preventDefault();
    setError(null);
    setProcesando(true);

    try {
      // 1. Configurar Conekta con la llave pública
      window.Conekta.setPublicKey(CONEKTA_PUBLIC_KEY);
      window.Conekta.setLanguage("es");

      // 2. Tokenizar la tarjeta (Conekta nunca envía los datos al backend)
      const token = await tokenizarTarjeta(form);

      // 3. Crear el pedido en el backend
      const pedidoRes = await fetch(`${API_URL}/pedidos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          comprador_id: usuario.id,
          productos: cart.items,
        }),
      });

      const pedidoData = await pedidoRes.json();

      if (!pedidoRes.ok) {
        throw new Error(pedidoData.error ?? "No se pudo crear el pedido");
      }

      // 4. Crear el pago en el backend (backend llama a Conekta con el token)
      const pagoRes = await fetch(`${API_URL}/pagos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pedido_id: pedidoData.id,
          token: token,
          customer_name: usuario.nombre,
          customer_email: usuario.email,
        }),
      });

      const pagoData = await pagoRes.json();

      if (!pagoRes.ok) {
        throw new Error(pagoData.error ?? "No se pudo procesar el pago");
      }

      // 5. Vaciar carrito y redirigir
      await vaciarCarrito(usuario.id);
      setExito(true);

      setTimeout(() => {
        navigate("/pedidos");
      }, 2000);

    } catch (err) {
      setError(err.message ?? "Error al procesar el pago");
    } finally {
      setProcesando(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">

        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b">
          <h2 className="text-xl font-bold text-gray-800">Datos de pago</h2>
          <button
            onClick={onClose}
            disabled={procesando}
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none cursor-pointer disabled:opacity-50"
          >
            &times;
          </button>
        </div>

        {exito ? (
          <div className="p-8 text-center">
            <div className="text-5xl mb-3">✅</div>
            <p className="text-lg font-semibold text-green-700">¡Pago enviado!</p>
            <p className="text-gray-500 text-sm mt-1">Redirigiendo a tus pedidos...</p>
          </div>
        ) : (
          <form onSubmit={handlePagar} className="p-5 space-y-4">

            {/* Total */}
            <div className="bg-indigo-50 rounded-lg p-3 flex justify-between items-center">
              <span className="text-gray-600 font-medium">Total a pagar</span>
              <span className="text-indigo-700 text-xl font-bold">${total?.toFixed(2)} MXN</span>
            </div>

            {/* Nombre en la tarjeta */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre en la tarjeta
              </label>
              <input
                type="text"
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                placeholder="Nombre Apellido"
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
            </div>

            {/* Número de tarjeta */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Número de tarjeta
              </label>
              <input
                type="text"
                name="numero"
                value={form.numero}
                onChange={handleChange}
                placeholder="4111-1111-1111-1111"
                maxLength={19}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-mono"
              />
            </div>

            {/* Expiración y CVV */}
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mes</label>
                <input
                  type="text"
                  name="mes"
                  value={form.mes}
                  onChange={handleChange}
                  placeholder="MM"
                  maxLength={2}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Año</label>
                <input
                  type="text"
                  name="anio"
                  value={form.anio}
                  onChange={handleChange}
                  placeholder="YY"
                  maxLength={2}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                <input
                  type="text"
                  name="cvv"
                  value={form.cvv}
                  onChange={handleChange}
                  placeholder="123"
                  maxLength={4}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                />
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="p-3 bg-red-100 text-red-700 text-sm rounded-lg">
                {error}
              </div>
            )}

            {/* Aviso seguridad */}
            <p className="text-xs text-gray-400 text-center">
              🔒 Tus datos son tokenizados por Conekta y nunca llegan a nuestro servidor.
            </p>

            {/* Botones */}
            <div className="flex gap-3 pt-1">
              <button
                type="button"
                onClick={onClose}
                disabled={procesando}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2.5 rounded-lg text-sm cursor-pointer disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={procesando}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-lg text-sm cursor-pointer"
              >
                {procesando ? "Procesando..." : `Pagar $${total?.toFixed(2)}`}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

// ─── Helper: tokenización ────────────────────────────────────────────────────

function tokenizarTarjeta(form) {
  return new Promise((resolve, reject) => {
    const cardData = {
      card: {
        number:    form.numero.replace(/\s/g, ""),
        name:      form.nombre,
        exp_year:  form.anio,
        exp_month: form.mes,
        cvc:       form.cvv,
      },
    };

    window.Conekta.token.create(
      cardData,
      (token) => resolve(token.id),   // éxito → devuelve tok_test_xxx
      (err) => reject(new Error(err.message_to_purchaser ?? "Tarjeta inválida"))
    );
  });
}
