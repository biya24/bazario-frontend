import { useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";

const CheckoutScreen = () => {
    const [loading, setLoading] = useState(false);
    const [address, setAddress] = useState(""); // ✅ State for address

    const cartItems = useSelector((state) => state.cart.cartItems);
    const userInfo = JSON.parse(localStorage.getItem("userInfo")) || null;

    const cartTotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0); 

    const handlePayment = async () => {
        if (!userInfo) {
            alert("You must be logged in to place an order! ❌");
            return;
        }
    
        if (!cartItems || cartItems.length === 0) {
            alert("Your cart is empty! ❌");
            return;
        }

        if (!address.trim()) {
            alert("Please enter a delivery address! ❌");
            return;
        }
    
        setLoading(true);
        try {
            // ✅ Step 1: Create Order First
            const orderResponse = await axios.post(
                "https://bazario-backend-iqac.onrender.com/api/orders",
                {
                    items: cartItems.map((item) => ({
                        productId: item._id,  
                        name: item.name,
                        quantity: item.quantity,
                        price: item.price,
                    })),
                    totalAmount: cartTotal,
                    deliveryAddress: address, // ✅ Include delivery address
                },
                {
                    headers: { Authorization: `Bearer ${userInfo.token}` }, 
                }
            );
    
            const orderId = orderResponse.data._id;
            console.log("✅ Order Created, Order ID:", orderId);
    
            // ✅ Step 2: Proceed with Payment
            const { data } = await axios.post(
                "https://bazario-backend-iqac.onrender.com/api/payments/pay",
                {
                    orderId, 
                    amount: cartTotal * 100, 
                    currency: "cad",
                }
            );
    
            console.log("✅ Payment Session Created:", data);
    
            if (data.url) {
                window.location.href = data.url; 
            } else {
                alert("Payment Failed: No redirect URL received ❌");
            }
    
        } catch (error) {
            console.error("❌ Payment Error:", error.response?.data || error.message);
            alert(`Payment Failed: ${error.response?.data?.message || "Something went wrong"}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-5">
            <h2>Checkout</h2>
            <p>Total: ${(cartTotal / 100).toFixed(2)} CAD</p>

            {/* ✅ Address Input */}
            <div className="mb-3">
                <label htmlFor="address" className="form-label">Delivery Address:</label>
                <input
                    type="text"
                    id="address"
                    className="form-control"
                    placeholder="Enter your address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                />
            </div>

            <button 
                onClick={handlePayment} 
                disabled={loading} 
                className="btn btn-primary"
            >
                {loading ? "Processing..." : "Pay Now"}
            </button>
        </div>
    );
};

export default CheckoutScreen;
