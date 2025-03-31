import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

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

    // ✅ Cancel Order (Updates status instead of deleting)
    const cancelOrder = async (orderId) => {
        if (!window.confirm("Are you sure you want to cancel this order?")) return;
        try {
            await axios.put(`https://bazario-backend-iqac.onrender.com/api/orders/cancel/${orderId}`, {}, {
                headers: { Authorization: `Bearer ${userInfo.token}` },
            });
            alert("Order cancelled successfully!");
            setOrders(orders.map(order =>
                order._id === orderId ? { ...order, status: "Cancelled" } : order
            ));
        } catch (error) {
            console.error("Error cancelling order:", error);
            alert("Failed to cancel order.");
        }
    };

    // ✅ Reorder
    const reorder = (order) => {
        alert(`Reordering items from order ${order._id}. Implement this feature.`);
    };

    // ✅ Retry Payment (If failed)
    const retryPayment = (orderId) => {
        alert(`Retrying payment for order ${orderId}. Implement payment gateway logic.`);
    };

    // ✅ Return Order (Only if delivered)
    const returnOrder = async (orderId) => {
        if (!window.confirm("Are you sure you want to return this order?")) return;
        try {
            await axios.put(`https://bazario-backend-iqac.onrender.com/api/orders/return/${orderId}`, {}, {
                headers: { Authorization: `Bearer ${userInfo.token}` },
            });
            alert("Return request submitted successfully!");
            setOrders(orders.map(order =>
                order._id === orderId ? { ...order, status: "Return Requested" } : order
            ));
        } catch (error) {
            console.error("Error processing return:", error);
            alert("Failed to process return request.");
        }
    };

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
                            <th>View Products</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(order => (
                            <tr key={order._id}>
                                {/* ✅ Clickable Order ID */}
                                <td>
                                    <Link to={`/order/${order._id}`} className="text-primary">
                                        {order._id}
                                    </Link>
                                </td>
                                <td>${order.totalAmount}</td>
                                <td>{order.status}</td>
                                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                                
                                {/* ✅ Display Product Details */}
                                <td>
                                    {order.items.map((item, index) => (
                                        <div key={index} className="mb-2">
                                            <Link to={`/product/${item.productId}`} className="text-decoration-none">
                                                <img src={item.image} alt={item.name} width="50" className="me-2" />
                                                {item.name} ({item.quantity})
                                            </Link>
                                        </div>
                                    ))}
                                </td>

                                <td>
                                    {/* ✅ Cancel Order (Now just updates status) */}
                                    {order.status !== "Shipped" && order.status !== "Delivered" && order.status !== "Cancelled" && (
                                        <button className="btn btn-danger btn-sm me-2" onClick={() => cancelOrder(order._id)}>
                                            Cancel
                                        </button>
                                    )}

                                    {/* ✅ Reorder */}
                                    <button className="btn btn-primary btn-sm me-2" onClick={() => reorder(order)}>
                                        Reorder
                                    </button>

                                    {/* ✅ Retry Payment (If failed) */}
                                    {order.status === "Pending" && (
                                        <button className="btn btn-success btn-sm" onClick={() => retryPayment(order._id)}>
                                            Retry Payment
                                        </button>
                                    )}

                                    {/* ✅ Return Order (Only if delivered) */}
                                    {order.status === "Delivered" && (
                                        <button className="btn btn-info btn-sm" onClick={() => returnOrder(order._id)}>
                                            Return
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default OrderHistory;
