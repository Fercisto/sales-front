import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProductDetailView from "../components/productos/ProductDetailView";

export default function ProductDetail() {

    const { id } = useParams();
    const [producto, setProducto] = useState([]);

    useEffect(() => {
        const consultarProducto = async () => {

            try {
                const response = await fetch(`http://localhost/sales-api/public/api/productos/${id}`);
                const data = await response.json();
                setProducto(data); 
            } catch (error) {
                console.log(error);
            }
        }

        consultarProducto();
        
    }, []);

    return (
        <ProductDetailView 
            producto={producto}
        />
    )
}
