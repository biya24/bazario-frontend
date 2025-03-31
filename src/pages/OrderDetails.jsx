import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const OrderDetailsUser = () => {
    const { id } = useParams(); // Get order ID from URL
    const [order, setOrder] = useState(null);
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));

    useEffect(() => {
        const fetchOrderDetails = async () => {
            if (!userInfo) return;
            try {
                const { data } = await axios.get(`https://bazario-backend-iqac.onrender.com/api/orders/${id}`, {
                    headers: { Authorization: `Bearer ${userInfo.token}` },
                });

                // Fetch product details for each item
                const updatedOrder = {
                    ...data,
                    items: await fetchProductDetails(data.items), // Ensure each item has name and image
                };

                setOrder(updatedOrder); // Update state with the fetched order details
            } catch (error) {
                console.error("Error fetching order details:", error);
            }
        };
        fetchOrderDetails();
    }, [id, userInfo]);

    // 🔹 Fetch product details for each item in the order
    const fetchProductDetails = async (items) => {
        try {
            // Fetch each product's name and image based on productId
            const updatedItems = await Promise.all(
                items.map(async (item) => {
                    try {
                        const { data } = await axios.get(`https://bazario-backend-iqac.onrender.com/api/products/${item.productId}`);
                        return { 
                            ...item, 
                            name: data.name, 
                            image: data.images?.[0] || "/placeholder.png" // Use first image or placeholder if missing
                        }; 
                    } catch (error) {
                        console.error(`Error fetching product ${item.productId}:`, error);
                        return { ...item, name: "Unknown Product", image: "/placeholder.png" }; // Handle missing product data
                    }
                })
            );
            return updatedItems; // Return updated list of items with product details
        } catch (error) {
            console.error("Error fetching product details:", error);
            return items; // In case of error, return the original items
        }
    };

    if (!order) return <p>Loading order details...</p>;

    return (
        <div className="container mt-5">
            <h2>Order Details</h2>
            <p><strong>Order ID:</strong> {order._id}</p>
            <p><strong>Status:</strong> {order.status}</p>
            <p><strong>Total Amount:</strong> ${order.totalAmount}</p>
            <p><strong>Order Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>

            <h4>Products:</h4>
            <ul className="list-group">
                {order.items.map((item) => (
                    <li key={item.productId} className="list-group-item d-flex align-items-center">
                        <img src={item.image || "/placeholder.png"} alt={item.name} width="50" className="me-3" />
                        <div>
                            <strong>{item.name}</strong> (Qty: {item.quantity})
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default OrderDetailsUser;
