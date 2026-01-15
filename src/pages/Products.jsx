import { useEffect, useState } from 'react'
import ProductList from '../components/productos/ProductList';

export default function Products() {

  const [productos, setProductos] = useState([]);

  useEffect(() => {
    const cargarProductos = async () => {
      try {
        const response = await fetch('http://localhost/sales-api/public/api/productos');
        const data = await response.json();
        setProductos(data);
      } catch (error) {
        console.log(error);
      }
    }
    
    cargarProductos();

  }, []);

  return (

    <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3'>
      <h2 className='text-4xl my-5 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent hover:from-indigo-700 font-bold'>Productos Disponibles</h2>
      <ProductList  
        productos={productos}
      />
    </div>

  )
}
