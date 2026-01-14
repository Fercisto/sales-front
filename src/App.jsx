import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Products from './pages/Products';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Register from './pages/Register';
import { CartProvider } from './context/CartContext';

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        {/* Pública */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Privadas */}
        <Route
          path="/*"
          element={
            <CartProvider>
              <Routes>
                <Route path="/" element={<Products />} />
                <Route path="/productos" element={<Products />} />
                <Route path="/cart" element={<Cart />} />
              </Routes>
            </CartProvider>
          }
        />        
      </Routes>

      <Footer />
      
    </BrowserRouter>
  );
}

export default App;