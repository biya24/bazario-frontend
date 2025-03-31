import { useEffect, useState } from "react";
import axios from "axios";
import AddProductForm from "../components/AddProductForm";
import EditProductModal from "../components/EditProductModal"; // Import the modal component

const VendorDashboard = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [selectedProduct, setSelectedProduct] = useState(null); // For editing

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
                                    <th>Stock</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map((product, index) => (
                                    <tr key={product._id}>
                                        <td>{index + 1}</td>
                                        <td>{product.name}</td>
                                        <td>${product.price.toFixed(2)}</td>
                                        <td>{product.stock}</td>
                                        <td>
                                            <button
                                                className="btn btn-warning btn-sm me-2"
                                                onClick={() => setSelectedProduct(product)}
                                            >
                                                Edit
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Edit Product Modal */}
            {selectedProduct && (
                <EditProductModal 
                    product={selectedProduct} 
                    onClose={() => setSelectedProduct(null)} 
                    onProductUpdated={fetchProducts} 
                />
            )}
        </div>
    );
}; 

export default VendorDashboard;
