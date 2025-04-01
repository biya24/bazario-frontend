// services/api.jsx
import axios from "axios";

const API_BASE_URL = "https://bazario-backend-iqac.onrender.com/api";

// Get user info from local storage
const getUserInfo = () => JSON.parse(localStorage.getItem("userInfo")) || {};

export const fetchUserOrders = async () => {
    const userInfo = getUserInfo();
    if (!userInfo.token) return [];

    try {
        const { data } = await axios.get(`${API_BASE_URL}/orders/my-orders`, {
            headers: { Authorization: `Bearer ${userInfo.token}` },
        });

        return await Promise.all(
            data.map(async (order) => ({
                ...order,
                items: await fetchProductDetails(order.items),
            }))
        );
    } catch (error) {
        console.error("Error fetching orders:", error);
        return [];
    }
};

export const fetchProductDetails = async (items) => {
    try {
        return await Promise.all(
            items.map(async (item) => {
                try {
                    const { data } = await axios.get(`${API_BASE_URL}/products/${item.productId}`);
                    return { ...item, name: data.name, image: data.images?.[0] || "/placeholder.png" };
                } catch (error) {
                    console.error(`Error fetching product ${item.productId}:`, error);
                    return { ...item, name: "Unknown Product", image: "/placeholder.png" };
                }
            })
        );
    } catch (error) {
        console.error("Error fetching product details:", error);
        return items;
    }
};

export const cancelOrder = async (orderId) => {
    const userInfo = getUserInfo();
    if (!window.confirm("Are you sure you want to cancel this order?")) return false;

    try {
        await axios.put(`${API_BASE_URL}/orders/cancel/${orderId}`, {}, {
            headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        alert("Order cancelled successfully!");
        return true;
    } catch (error) {
        console.error("Error cancelling order:", error);
        alert("Failed to cancel order.");
        return false;
    }
};

export const retryPayment = async (orderId) => {
    const userInfo = getUserInfo();
    try {
        const { data } = await axios.put(`${API_BASE_URL}/payments/retry-payment/${orderId}`, {}, {
            headers: { Authorization: `Bearer ${userInfo.token}` },
        });

        if (data.url) {
            window.location.href = data.url; // Redirect to Stripe Checkout
        } else {
            alert("Failed to retrieve payment URL.");
        }
    } catch (error) {
        console.error("Error retrying payment:", error);
        alert("Failed to retry payment.");
    }
};

export const returnOrder = async (orderId) => {
    const userInfo = getUserInfo();
    if (!window.confirm("Are you sure you want to return this order?")) return false;

    try {
        await axios.put(`${API_BASE_URL}/orders/return/${orderId}`, {}, {
            headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        alert("Return request submitted successfully!");
        return true;
    } catch (error) {
        console.error("Error processing return:", error);
        alert("Failed to process return request.");
        return false;
    }
};

export const submitReview = async (productId, rating, comment) => {
    const userInfo = getUserInfo();
    try {
        await axios.post(`${API_BASE_URL}/reviews`, { productId, rating, comment }, {
            headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        alert("Review added successfully!");
        return true;
    } catch (error) {
        console.error("Error adding review:", error);
        alert("Failed to submit review.");
        return false;
    }
};
