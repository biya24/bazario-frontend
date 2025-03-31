import { useState } from "react";
import axios from "axios";

const EditProductModal = ({ product, onClose, onProductUpdated }) => {
    const [name, setName] = useState(product.name);
    const [description, setDescription] = useState(product.description);
    const [price, setPrice] = useState(product.price);
    const [stock, setStock] = useState(product.stock);
    const [category, setCategory] = useState(product.category);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            const userInfo = JSON.parse(localStorage.getItem("userInfo"));

            if (!userInfo || !userInfo.token) {
                throw new Error("User not authenticated");
            }

            const config = {
                headers: { Authorization: `Bearer ${userInfo.token}` },
            };

            await axios.put(`https://bazario-backend-iqac.onrender.com/api/products/${product._id}`, 
                { name, description, price, stock, category }, config
            );

            setMessage("✅ Product updated successfully!");
            onProductUpdated(); // Refresh product list
            setTimeout(onClose, 1000); // Close modal after success
        } catch (error) {
            setMessage(`❌ Error: ${error.response?.data?.message || error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal show d-block" style={{ background: "rgba(0, 0, 0, 0.5)" }}>
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Edit Product</h5>
                        <button className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        {message && <p className={message.includes("✅") ? "text-success" : "text-danger"}>{message}</p>}
                        <form onSubmit={handleUpdate}>
                            <div className="mb-3">
                                <label className="form-label">Product Name</label>
                                <input type="text" className="form-control" value={name} onChange={(e) => setName(e.target.value)} required />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Description</label>
                                <textarea className="form-control" value={description} onChange={(e) => setDescription(e.target.value)} required />
                            </div>

                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Price ($)</label>
                                    <input type="number" className="form-control" value={price} onChange={(e) => setPrice(e.target.value)} required />
                                </div>

                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Stock</label>
                                    <input type="number" className="form-control" value={stock} onChange={(e) => setStock(e.target.value)} required />
                                </div>
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Category</label>
                                <input type="text" className="form-control" value={category} onChange={(e) => setCategory(e.target.value)} required />
                            </div>

                            <button type="submit" className="btn btn-success w-100" disabled={loading}>
                                {loading ? "Updating..." : "Update Product"}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditProductModal;
