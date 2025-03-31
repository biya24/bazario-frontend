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

    // ✅ Edit Order (Only if pending)
    const editOrder = (orderId) => {
        alert(`Editing order ${orderId} - Implement edit functionality here.`);
    };

    // ✅ Cancel Order (Only if not shipped)
    const cancelOrder = async (orderId) => {
        if (!window.confirm("Are you sure you want to cancel this order?")) return;
        try {
            await axios.delete(`https://bazario-backend-iqac.onrender.com/api/orders/${orderId}`, {
                headers: { Authorization: `Bearer ${userInfo.token}` },
            });
            alert("Order cancelled successfully!");
            setOrders(orders.filter(order => order._id !== orderId)); // Remove from UI
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
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(order => (
                            <tr key={order._id}>
                                <td>{order._id}</td>
                                <td>${order.totalAmount}</td>
                                <td>{order.status}</td>
                                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                                <td>
                                    {/* ✅ Edit (Only if pending) */}
                                    {order.status === "Pending" && (
                                        <button className="btn btn-warning btn-sm me-2" onClick={() => editOrder(order._id)}>
                                            Edit
                                        </button>
                                    )}

                                    {/* ✅ Cancel (Only if not shipped and not delivered) */}
                                    {order.status !== "Shipped" && order.status !== "Delivered" && (
                                        <button className="btn btn-danger btn-sm me-2" onClick={() => cancelOrder(order._id)}>
                                            Cancel
                                        </button>
                                    )}

                                    {/* ✅ Reorder */}
                                    <button className="btn btn-primary btn-sm me-2" onClick={() => reorder(order)}>
                                        Reorder
                                    </button>

                                    {/* ✅ Retry Payment (If failed) */}
                                    {order.status === "Payment Failed" && (
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
