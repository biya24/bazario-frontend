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
        
                console.log("Fetched Order Data:", data);
        
                // If product images are missing, fetch product details
                const updatedItems = await Promise.all(
                    data.items.map(async (item) => {
                        if (!item.productId || !item.productId._id) {
                            console.warn("Missing productId for item:", item);
                            return { ...item, name: "Unknown Product", image: "/placeholder.png" };
                        }
        
                        // Fetch product details if images are missing
                        if (!item.productId.images || item.productId.images.length === 0) {
                            try {
                                const { data: productData } = await axios.get(
                                    `https://bazario-backend-iqac.onrender.com/api/products/${item.productId._id}`
                                );
                                return { 
                                    ...item, 
                                    name: productData.name || "Unknown Product", 
                                    image: productData.images?.[0] || "/placeholder.png" 
                                };
                            } catch (error) {
                                console.error(`Error fetching product ${item.productId._id}:`, error);
                                return { ...item, name: "Unknown Product", image: "/placeholder.png" };
                            }
                        }
        
                        // Use existing product details
                        return {
                            ...item,
                            name: item.productId.name || "Unknown Product",
                            image: item.productId.images[0] || "/placeholder.png",
                        };
                    })
                );
        
                setOrder({ ...data, items: updatedItems });
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
    
            {/* 🔹 Display Delivery Address */}
            <h4>Delivery Address:</h4>
            <p>
    <strong>{order.deliveryAddress.fullName}</strong> <br />
    {order.deliveryAddress.houseName}, {order.deliveryAddress.street} <br />
    {order.deliveryAddress.city}, {order.deliveryAddress.district} <br />
    <strong>Postal Code:</strong> {order.deliveryAddress.pin} <br />
    <strong>Mobile:</strong> {order.deliveryAddress.mobile}
</p>
    
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
