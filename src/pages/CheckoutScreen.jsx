import { useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";

const CheckoutScreen = () => {
    const [loading, setLoading] = useState(false);
    const cartItems = useSelector((state) => state.cart.cartItems);
    const userInfo = JSON.parse(localStorage.getItem("userInfo")) || null;

    const cartTotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

    // ✅ Address State
    const [address, setAddress] = useState({
        fullName: "",
        houseName: "",
        street: "",
        city: "",
        district: "",
        pin: "",
        mobile: "",
        addressType: "home"
    });

    // ✅ Handle Input Change
    const handleAddressChange = (e) => {
        setAddress({ ...address, [e.target.name]: e.target.value });
    };

    const handlePayment = async () => {
        if (!userInfo) {
            alert("You must be logged in to place an order! ❌");
            return;
        }
    
        if (!cartItems || cartItems.length === 0) {
            alert("Your cart is empty! ❌");
            return;
        }

        // ✅ Validate Address Fields
        if (!address.fullName || !address.houseName || !address.street || !address.city || !address.district || !address.pin || !address.mobile) {
            alert("Please fill in all address fields!");
            return;
        }
    
        setLoading(true);
        try {
            // ✅ Step 1: Create Order with Address
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
                    deliveryAddress: address, // ✅ Send the complete address!
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
            
            {/* ✅ Address Input Fields */}
            <h3>Delivery Address</h3>
            <input type="text" name="fullName" placeholder="Full Name" value={address.fullName} onChange={handleAddressChange} required />
            <input type="text" name="houseName" placeholder="House/Apartment Name" value={address.houseName} onChange={handleAddressChange} required />
            <input type="text" name="street" placeholder="Street" value={address.street} onChange={handleAddressChange} required />
            <input type="text" name="city" placeholder="City" value={address.city} onChange={handleAddressChange} required />
            <input type="text" name="district" placeholder="District" value={address.district} onChange={handleAddressChange} required />
            <input type="text" name="pin" placeholder="PIN Code" value={address.pin} onChange={handleAddressChange} required />
            <input type="text" name="mobile" placeholder="Mobile Number" value={address.mobile} onChange={handleAddressChange} required />
            
            <label>
                <input type="radio" name="addressType" value="home" checked={address.addressType === "home"} onChange={handleAddressChange} /> Home
            </label>
            <label>
                <input type="radio" name="addressType" value="work" checked={address.addressType === "work"} onChange={handleAddressChange} /> Work
            </label>

            <p>Total: ${(cartTotal / 100).toFixed(2)} CAD</p>

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
