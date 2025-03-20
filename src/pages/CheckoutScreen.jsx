import { useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";

const CheckoutScreen = () => {
    const [loading, setLoading] = useState(false);
    //const cartTotal = 5000; // ✅ Example total (50.00 CAD in cents)
    const cartItems = useSelector((state) => state.cart.cartItems);
    const orderId = localStorage.getItem("orderId"); // ✅ Retrieve stored order ID
    const userInfo = JSON.parse(localStorage.getItem("userInfo")) || null; 

    const cartTotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0); // ✅ Calculate total price

    const handlePayment = async () => {
        if (!userInfo) {
            alert("You must be logged in to place an order! ❌");
            return;
        }
    
        if (!cartItems || cartItems.length === 0) {
            alert("Your cart is empty! ❌");
            return;
        }
    
        setLoading(true);
        try {
            // ✅ Step 1: Create Order First
            const orderResponse = await axios.post(
                "http://localhost:5000/api/orders",
                {
                    items: cartItems.map((item) => ({
                        productId: item._id,  // ✅ Ensure correct productId
                        name: item.name,
                        quantity: item.quantity,
                        price: item.price,
                    })),
                    totalAmount: cartTotal,
                },
                {
                    headers: { Authorization: `Bearer ${userInfo.token}` }, // ✅ Send token for authentication
                }
            );
    
            const orderId = orderResponse.data._id; // ✅ Get Order ID
            console.log("✅ Order Created, Order ID:", orderId);
    
            // ✅ Step 2: Proceed with Payment
            const { data } = await axios.post(
                "http://localhost:5000/api/payments/pay",
                {
                    orderId, // ✅ Include Order ID in payment request
                    amount: cartTotal * 100, // Convert to cents
                    currency: "cad",
                }
            );
    
            console.log("✅ Payment Session Created:", data);
    
            if (data.url) {
                window.location.href = data.url; // Redirect to Stripe Checkout
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
            <p>Total: ${(cartTotal / 100).toFixed(2)} CAD</p>  {/* ✅ Convert cents to dollars */}
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
