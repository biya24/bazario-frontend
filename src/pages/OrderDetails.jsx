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
                console.log("Order Data:", data); // Log the fetched order data

                if (!data.items || data.items.length === 0) {
                    console.warn("No items found in this order.");
                    return;
                }
                
                // Verify if order items have productId
                console.log("Order Items:", data.items); 

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
        return await Promise.all(
            items.map(async (item) => {
                if (!item.productId) {
                    console.warn("Missing productId for item:", item);
                    return { ...item, name: "Unknown Product", image: "/placeholder.png" };
                }
    
                try {
                    const { data } = await axios.get(`https://bazario-backend-iqac.onrender.com/api/products/${item.productId}`);
                    return { 
                        ...item, 
                        name: data.name || "Unknown Product", 
                        image: data.images?.[0] || "/placeholder.png"
                    };
                } catch (error) {
                    console.error(`Error fetching product ${item.productId}:`, error);
                    return { ...item, name: "Unknown Product", image: "/placeholder.png" };
                }
            })
        );
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
                {order.items.map((item, index) => (
                    <li key={index} className="list-group-item d-flex align-items-center">
                        <img src={item.image || "/placeholder.png"} alt={item.name || "Unknown"} width="50" className="me-3" />
                        <div>
                            <strong>{item.name || "Unknown Product"}</strong> (Qty: {item.quantity})
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
    
};

export default OrderDetailsUser;
