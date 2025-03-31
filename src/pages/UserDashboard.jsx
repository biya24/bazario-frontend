import { useEffect, useState } from "react";
import axios from "axios";

const UserDashboard = () => {
    const [user, setUser] = useState(null);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [orders, setOrders] = useState([]);
    
    const userInfo = JSON.parse(localStorage.getItem("userInfo")); // Get user info
    const token = userInfo?.token; // Get token safely

    useEffect(() => {
        if (!token) {
            console.error("No token found! User is not authenticated.");
            return;
        }

        const headers = { Authorization: `Bearer ${token}` }; // ✅ Set Authorization Header

        // ✅ Fetch user profile
        const fetchUserProfile = async () => {
            try {
                const { data } = await axios.get("https://bazario-backend-iqac.onrender.com/api/users/profile", { headers });
                setUser(data);
                setName(data.name);
                setEmail(data.email);
            } catch (error) {
                console.error("❌ Error fetching user profile:", error.response?.data?.message || error.message);
            }
        };

        // ✅ Fetch user orders
        const fetchOrders = async () => {
            try {
                const { data } = await axios.get("https://bazario-backend-iqac.onrender.com/api/orders", { headers });
                setOrders(data);
            } catch (error) {
                console.error("❌ Error fetching orders:", error.response?.data?.message || error.message);
            }
        };

        fetchUserProfile();
        fetchOrders();
    }, [token]);

    // ✅ Handle Profile Update
    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.put(
                "https://bazario-backend-iqac.onrender.com/api/users/profile",
                { name, email, password },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            localStorage.setItem("userInfo", JSON.stringify(data)); // ✅ Update Local Storage
            setMessage("Profile updated successfully!");
        } catch (error) {
            setMessage(error.response?.data?.message || "Error updating profile");
        }
    };

    return (
        <div className="container mt-4">
            <h2>Welcome, {user?.name}!</h2>
            <p>Email: {user?.email}</p>

            {/* ✅ Profile Update Form */}
            <h3>Update Profile</h3>
            {message && <p className="alert alert-info">{message}</p>}
            <form onSubmit={handleUpdateProfile}>
                <div className="mb-3">
                    <label className="form-label">Name</label>
                    <input type="text" className="form-control" value={name} onChange={(e) => setName(e.target.value)} />
                </div>

                <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>

                <div className="mb-3">
                    <label className="form-label">New Password</label>
                    <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Leave blank to keep current password" />
                </div>

                <button type="submit" className="btn btn-primary">Update Profile</button>
            </form>

            <h3>My Orders</h3>
            <ul>
                {orders.length > 0 ? (
                    <Link className="btn text-white" style={{ backgroundColor: "#90e0ef" }} to="/orders">My Orders</Link>
                ) : (
                    <p>No orders found.</p>
                )}
            </ul>
        </div>
    );
};

export default UserDashboard;
