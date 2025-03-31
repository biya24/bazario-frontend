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

            const { data } = await axios.get("https://bazario-backend-iqac.onrender.com/api/products/vendor", config);
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
        <div className="container mt-5">
            <h2 className="text-center mb-4 text-primary">Vendor Dashboard</h2>

            {/* Add Product Form */}
            <div className="card p-4 mb-4 shadow">
                <h4 className="mb-3 text-success">Add New Product</h4>
                <AddProductForm onProductAdded={fetchProducts} />
            </div>

            {/* Product List Section */}
            <div className="card p-4 shadow">
                <h4 className="mb-3 text-info">Your Products</h4>

                {loading ? (
                    <p className="text-center text-warning">Loading products...</p>
                ) : message ? (
                    <p className="text-center text-danger">{message}</p>
                ) : products.length === 0 ? (
                    <p className="text-center text-muted">No products found.</p>
                ) : (
                    <div className="table-responsive">
                        <table className="table table-striped table-bordered">
                            <thead className="table-dark">
                                <tr>
                                    <th>#</th>
                                    <th>Product Name</th>
                                    <th>Price ($)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map((product, index) => (
                                    <tr key={product._id}>
                                        <td>{index + 1}</td>
                                        <td>{product.name}</td>
                                        <td>${product.price.toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VendorDashboard;
