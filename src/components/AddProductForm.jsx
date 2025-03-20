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
            onProductAdded(); // Refresh product list
        } catch (error) {
            setMessage(`❌ Error: ${error.response?.data?.message || error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card p-3 mt-3">
            <h3>Add New Product</h3>
            {message && <p>{message}</p>}
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Product Name" value={name} onChange={(e) => setName(e.target.value)} required />
                <input type="text" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} required />
                <input type="number" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} required />
                <input type="number" placeholder="Stock" value={stock} onChange={(e) => setStock(e.target.value)} required />
                <input type="text" placeholder="Category" value={category} onChange={(e) => setCategory(e.target.value)} required />
                <input type="file" onChange={(e) => setImage(e.target.files[0])} required />
                <button type="submit" disabled={loading} className="btn btn-primary">
                    {loading ? "Adding..." : "Add Product"}
                </button>
            </form>
        </div>
    );
};

export default AddProductForm;
