import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Products from './pages/Products';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Register from './pages/Register';
import ProductDetail from './pages/ProductDetail';
import Orders from './pages/Orders';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/routes/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />

        <Routes>
          {/* Rutas públicas */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Rutas privadas - requieren autenticación */}
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <CartProvider>
                  <Routes>
                    <Route path="/" element={<Products />} />
                    <Route path="/productos" element={<Products />} />
                    <Route path="/pedidos" element={<Orders />} />
                    <Route path="/productos/:id" element={<ProductDetail />} />
                    <Route path="/carrito" element={<Cart />} />
                  </Routes>
                </CartProvider>
              </ProtectedRoute>
            }
          />
        </Routes>

        <Footer />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;