import { useEffect, useState } from "react";
import axios from "axios";

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));

    useEffect(() => {
        const fetchOrders = async () => {
            if (!userInfo) return;
            try {
                const { data } = await axios.get("https://bazario-backend-iqac.onrender.com/api/orders/my-orders", {
                    headers: { Authorization: `Bearer ${userInfo.token}` },
                });
                setOrders(data);
            } catch (error) {
                console.error("Error fetching orders:", error);
            }
        };
        fetchOrders();
    }, []);

    return (
        <div className="container mt-5">
            <h2>My Orders</h2>
            {orders.length === 0 ? (
                <p>No orders found.</p>
            ) : (
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Total</th>
                            <th>Status</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(order => (
                            <tr key={order._id}>
                                <td>{order._id}</td>
                                <td>${order.totalAmount}</td>
                                <td>{order.status}</td>
                                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default OrderHistory;
