import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

const VendorOrderScreen = () => {
    const { id } = useParams(); // Get order ID from URL
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const userInfo = JSON.parse(localStorage.getItem("userInfo")) || null;

    useEffect(() => {
        const fetchOrderDetails = async () => {
            if (!userInfo) return;

            try {
                const { data } = await axios.get(`https://bazario-backend-iqac.onrender.com/api/orders/${id}`, {
                    headers: { Authorization: `Bearer ${userInfo.token}` },
                });
                setOrder(data);
            } catch (err) {
                setError(err.response?.data?.message || "Failed to fetch order details");
            } finally {
                setLoading(false);
            }
        };

        fetchOrderDetails();
    }, [id, userInfo]);

    if (!userInfo) {
        return <h2 className="text-center">Please <Link to="/login">Login</Link> to view order details</h2>;
    }

    if (loading) return <h2>Loading order details...</h2>;
    if (error) return <h2 className="text-danger">{error}</h2>;

    return (
        <div className="container mt-4">
            <h2>Order Details</h2>
            <p><strong>Order ID:</strong> {order._id}</p>
            <p><strong>Buyer Name:</strong> {order.buyer?.name || "Unknown"}</p>
            <p><strong>Total Amount:</strong> ${order.totalAmount.toFixed(2)}</p>
            <p><strong>Status:</strong> {order.status}</p>

            <h3>Items:</h3>
            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th>Product ID</th>
                        <th>Quantity</th>
                        <th>Price</th>
                    </tr>
                </thead>
                <tbody>
                    {order.items.map((item) => (
                        <tr key={item.productId}>
                            <td>{typeof item.productId === "object" ? item.productId._id : item.productId}</td>
                            <td>{item.quantity}</td>
                            <td>${typeof item.price === "number" ? item.price.toFixed(2) : "N/A"}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <h3>Delivery Address:</h3>
            <p>{order.deliveryAddress.fullName}</p>
            <p>{order.deliveryAddress.houseName}, {order.deliveryAddress.street}</p>
            <p>{order.deliveryAddress.city}, {order.deliveryAddress.district}</p>
            <p>Pin: {order.deliveryAddress.pin}</p>
            <p>Mobile: {order.deliveryAddress.mobile}</p>

            <Link to="/vendor/sales" className="btn btn-secondary mt-3">Back to Sales</Link>
        </div>
    );
};

export default VendorOrderScreen;
