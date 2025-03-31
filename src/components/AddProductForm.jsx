import { useState } from "react";
import axios from "axios";

const AddProductForm = ({ onProductAdded }) => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [stock, setStock] = useState("");
    const [category, setCategory] = useState("");
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            const userInfo = JSON.parse(localStorage.getItem("userInfo"));

            if (!userInfo || !userInfo.token) {
                throw new Error("User not authenticated");
            }

            // ✅ Step 1: Upload image to Cloudinary (if available)
            let imageUrl = "";
            if (image) {
                const formData = new FormData();
                formData.append("image", image);

                const { data } = await axios.post(
                    "https://bazario-backend-iqac.onrender.com/api/products/upload",
                    formData,
                    { headers: { Authorization: `Bearer ${userInfo.token}` } }
                );

                imageUrl = data.imageUrl;
            }

            // ✅ Step 2: Create Product in Database
            const productData = {
                name,
                description,
                price,
                stock,
                category,
                vendorId: userInfo._id, // Vendor ID from login
                imageUrl, // Cloudinary image URL
            };

            await axios.post("https://bazario-backend-iqac.onrender.com/api/products", productData, {
                headers: { Authorization: `Bearer ${userInfo.token}` },
            });

            setMessage("✅ Product added successfully!");
            setName("");
            setDescription("");
            setPrice("");
            setStock("");
            setCategory("");
            setImage(null);
            onProductAdded(); // Refresh product list
        } catch (error) {
            setMessage(`❌ Error: ${error.response?.data?.message || error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card shadow p-4 mt-4">
            <h3 className="text-center text-primary">Add New Product</h3>

            {message && (
                <p className={`text-center ${message.includes("✅") ? "text-success" : "text-danger"}`}>
                    {message}
                </p>
            )}

            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Product Name</label>
                    <input type="text" className="form-control" placeholder="Enter product name" 
                        value={name} onChange={(e) => setName(e.target.value)} required />
                </div>

                <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea className="form-control" placeholder="Enter product description" 
                        value={description} onChange={(e) => setDescription(e.target.value)} required />
                </div>

                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label className="form-label">Price ($)</label>
                        <input type="number" className="form-control" placeholder="Enter price" 
                            value={price} onChange={(e) => setPrice(e.target.value)} required />
                    </div>

                    <div className="col-md-6 mb-3">
                        <label className="form-label">Stock</label>
                        <input type="number" className="form-control" placeholder="Enter stock quantity" 
                            value={stock} onChange={(e) => setStock(e.target.value)} required />
                    </div>
                </div>

                <div className="mb-3">
                    <label className="form-label">Category</label>
                    <input type="text" className="form-control" placeholder="Enter product category" 
                        value={category} onChange={(e) => setCategory(e.target.value)} required />
                </div>

                <div className="mb-3">
                    <label className="form-label">Product Image</label>
                    <input type="file" className="form-control" onChange={(e) => setImage(e.target.files[0])} required />
                </div>

                <button type="submit" className="btn btn-success w-100" disabled={loading}>
                    {loading ? "Adding Product..." : "Add Product"}
                </button>
            </form>
        </div>
    );
};

export default AddProductForm;
