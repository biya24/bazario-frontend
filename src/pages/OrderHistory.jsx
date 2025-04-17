import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
    fetchUserOrders,
    cancelOrder,
    retryPayment,
    returnOrder,
    submitReview
} from "../services/api";

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const [reviews, setReviews] = useState({});
    const [loading, setLoading] = useState(true);
    const getUserInfo = () => JSON.parse(localStorage.getItem("userInfo")) || {};
    const API_BASE_URL = "https://bazario-backend-iqac.onrender.com/api";

    // Fetch Orders
    const fetchOrders = useCallback(async () => {
        setLoading(true);
        const userOrders = await fetchUserOrders();
        setOrders(userOrders);
        setLoading(false);
    }, []);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

   

// Cancel Order
const handleCancelOrder = async (orderId) => {
    const confirmCancel = window.confirm("Are you sure you want to cancel this order?");
    if (!confirmCancel) return;

    const success = await cancelOrder(orderId);
    if (success) {
        fetchOrders();
    } else {
        alert("Failed to cancel order.");
    }
};

// Return Order
const handleReturnOrder = async (orderId) => {
    const confirmReturn = window.confirm("Are you sure you want to return this order?");
    if (!confirmReturn) return;

    const success = await returnOrder(orderId);
    if (success) {
        fetchOrders();
    } else {
        alert("Failed to return order.");
    }
};

// Reorder
const handleReorder = async (order) => {
    const orderId = order?._id;
    if (!orderId) {
        alert("Invalid order");
        return;
    }

    try {
        const userInfo = getUserInfo();
        const response = await axios.post(
            `${API_BASE_URL}/orders/reorder/${orderId}`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${userInfo.token}`,
                },
            }
        );
        alert("Order reordered successfully!");
    } catch (error) {
        console.error("Reorder error:", error);
        alert("Failed to reorder. Please try again.");
    }
};


    

    return (
        <div className="container mt-5">
            <h2 className="text-center">My Orders</h2>
            {loading ? (
                <p>Loading your orders, please wait...</p>
            ) : orders.length === 0 ? (
                <p>No orders found.</p>
            ) : (
                <div className="table-responsive"> {/* ✅ Makes table scrollable on small screens */}
                    <table className="table table-striped table-bordered">
                        <thead className="table-dark text-center">
                            <tr>
                                <th>Order ID</th>
                                <th>Total</th>
                                <th>Status</th>
                                <th>Date</th>
                                <th>Products</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order) => (
                                <tr key={order._id}>
                                    <td>
                                        <Link to={`/order/${order._id}`} className="text-primary">
                                            {order._id}
                                        </Link>
                                    </td>
                                    <td>${order.totalAmount}</td>
                                    <td>{order.status}</td>
                                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                                    <td>
                                        {order.items.map((item, index) => (
                                            <div key={index} className="d-flex flex-wrap align-items-center mb-2">
                                                <img src={item.image || "/placeholder.png"} alt={item.name} className="img-fluid me-2" style={{ width: "50px", height: "50px", objectFit: "cover" }} />
                                                <Link to={`/product/${item.productId}`} className="text-decoration-none">
                                                    <strong>{item.name}</strong> (Qty: {item.quantity})
                                                </Link>
                                            </div>
                                        ))}
                                    </td>
                                    <td>
                                        {/* ✅ Stack buttons on mobile */}
                                        <div className="d-grid gap-2 d-md-block">
                                            {order.status === "Pending" && (
                                                <button className="btn btn-success btn-sm me-2" onClick={() => retryPayment(order._id)}>
                                                    Retry Payment
                                                </button>
                                            )}
                                            {(order.status === "Paid" || order.status === "Pending") && (
                                                <button className="btn btn-danger btn-sm me-2" onClick={() => handleCancelOrder(order._id)}>
                                                    Cancel
                                                </button>
                                            )}
                                            {order.status === "Delivered" && (
                                                <button className="btn btn-warning btn-sm me-2" onClick={() => handleReturnOrder(order._id)}>
                                                    Return
                                                </button>
                                                
                                            )}
                                            {order.status !== "Canceled" && (
                                                <button className="btn btn-info btn-sm" onClick={() => handleReorder(order)}>
                                                    Reorder
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default OrderHistory;
