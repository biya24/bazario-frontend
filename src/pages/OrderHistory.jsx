import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const [reviews, setReviews] = useState({});
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));

    useEffect(() => {
        const fetchOrders = async () => {
            if (!userInfo) return;
            try {
                const { data } = await axios.get("https://bazario-backend-iqac.onrender.com/api/orders/my-orders", {
                    headers: { Authorization: `Bearer ${userInfo.token}` },
                });

                // Fetch product names for each order
                const updatedOrders = await Promise.all(
                    data.map(async (order) => ({
                        ...order,
                        items: await fetchProductDetails(order.items),
                    }))
                );

                setOrders(updatedOrders);
            } catch (error) {
                console.error("Error fetching orders:", error);
            }
        };
        fetchOrders();
    }, []);

    // 🔹 Fetch product details for each item
    const fetchProductDetails = async (items) => {
        try {
            const updatedItems = await Promise.all(
                items.map(async (item) => {
                    try {
                        const { data } = await axios.get(`https://bazario-backend-iqac.onrender.com/api/products/${item.productId}`);
                        return { ...item, name: data.name, image: data.images?.[0] }; // Add product name & image
                    } catch (error) {
                        console.error(`Error fetching product ${item.productId}:`, error);
                        return { ...item, name: "Unknown Product", image: "" }; // Handle missing product data
                    }
                })
            );
            return updatedItems;
        } catch (error) {
            console.error("Error fetching product details:", error);
            return items;
        }
    };

    // 🔹 Handle Review Input
    const handleReviewChange = (productId, field, value) => {
        setReviews((prev) => ({
            ...prev,
            [productId]: {
                ...prev[productId],
                [field]: value,
            },
        }));
    };

    // 🔹 Submit Review
    const submitReview = async (productId) => {
        const review = reviews[productId];
        if (!review || !review.rating || !review.comment) {
            alert("Please provide both rating and comment.");
            return;
        }
        try {
            const { data } = await axios.post(
                "https://bazario-backend-iqac.onrender.com/api/reviews",
                { productId, rating: review.rating, comment: review.comment },
                {
                    headers: {
                        Authorization: `Bearer ${userInfo.token}`,
                    },
                }
            );
            alert("Review added successfully!");
            // Optionally, refresh the reviews for this product
        } catch (error) {
            console.error("Error adding review:", error);
            alert("Failed to submit review.");
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
                                        <div key={index} className="mb-2">
                                            <Link to={`/product/${item.productId}`} className="text-decoration-none">
                                                <img src={item.image || "/placeholder.png"} alt={item.name} width="50" className="me-2" />
                                                <strong>{item.name}</strong> (Qty: {item.quantity})
                                            </Link>

                                            {/* Review Section */}
                                            {order.status === "Delivered" && (
                                                <div>
                                                    <textarea
                                                        placeholder="Write your review..."
                                                        value={reviews[item.productId]?.comment || ""}
                                                        onChange={(e) => handleReviewChange(item.productId, "comment", e.target.value)}
                                                    />
                                                    <select
                                                        value={reviews[item.productId]?.rating || ""}
                                                        onChange={(e) => handleReviewChange(item.productId, "rating", e.target.value)}
                                                    >
                                                        <option value="">Select Rating</option>
                                                        {[1, 2, 3, 4, 5].map((rating) => (
                                                            <option key={rating} value={rating}>
                                                                {rating} Stars
                                                            </option>
                                                        ))}
                                                    </select>
                                                    <button
                                                        className="btn btn-primary mt-2"
                                                        onClick={() => submitReview(item.productId)}
                                                    >
                                                        Submit Review
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </td>
                                <td>
                                    {/* Additional Actions for Order */}
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
