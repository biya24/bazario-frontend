import { useEffect, useState } from "react";
import axios from "axios";
import AddProductForm from "../components/AddProductForm";

const VendorDashboard = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");

    const fetchProducts = async () => {
        try {
            const userInfo = JSON.parse(localStorage.getItem("userInfo"));

            if (!userInfo || !userInfo.token) {
                throw new Error("User not authenticated");
            }

            const config = {
                headers: { Authorization: `Bearer ${userInfo.token}` },
            };

            const { data } = await axios.get("http://localhost:5000/api/products/vendor", config);
            setProducts(data);
        } catch (error) {
            setMessage(error.response?.data?.message || "Failed to fetch products");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    return (
        <div className="container mt-4">
            <h2>Vendor Dashboard</h2>

            <AddProductForm onProductAdded={fetchProducts} />

            {loading ? <p>Loading products...</p> : products.length === 0 ? (
                <p>No products found.</p>
            ) : (
                <ul>
                    {products.map((product) => (
                        <li key={product._id}>{product.name} - ${product.price}</li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default VendorDashboard;
