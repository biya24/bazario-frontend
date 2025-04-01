import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
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

    // Handle Review Input
    const handleReviewChange = (productId, field, value) => {
        setReviews((prev) => ({
            ...prev,
            [productId]: { ...prev[productId], [field]: value },
        }));
    };

    // Submit Review
    const handleReviewSubmit = async (productId) => {
        const review = reviews[productId];
        if (!review?.rating || !review?.comment) {
            alert("Please provide both rating and comment.");
            return;
        }
        if (await submitReview(productId, review.rating, review.comment)) {
            setReviews((prev) => ({ ...prev, [productId]: {} }));
        }
    };

    return (
        <div className="container mt-5">
            <h2>My Orders</h2>
            {loading ? (
                <p>Loading your orders, please wait...</p>
            ) : orders.length === 0 ? (
                <p>No orders found.</p>
            ) : (
                <table className="table table-striped">
                    <thead>
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
                        {orders.map(order => (
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
                                        <div key={index} className="mb-3">
                                            <Link to={`/product/${item.productId}`} className="text-decoration-none">
                                                <img src={item.image || "/placeholder.png"} alt={item.name} width="50" className="me-2" />
                                                <strong>{item.name}</strong> (Qty: {item.quantity})
                                            </Link>

                                            {order.status === "Delivered" && (
                                                <div className="mt-3 p-3 border rounded bg-light">
                                                    <h5>Write a Review</h5>
                                                    <textarea
                                                        placeholder="Write your review..."
                                                        value={reviews[item.productId]?.comment || ""}
                                                        onChange={(e) => handleReviewChange(item.productId, "comment", e.target.value)}
                                                        className="form-control mb-2"
                                                        rows="3"
                                                    />
                                                    <button
                                                        className="btn btn-primary mt-2"
                                                        onClick={() => handleReviewSubmit(item.productId)}
                                                    >
                                                        Submit Review
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </td>
                                <td>
                                    {order.status === "Pending" && (
                                        <button className="btn btn-success btn-sm" onClick={() => retryPayment(order._id)}>
                                            Retry Payment
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
