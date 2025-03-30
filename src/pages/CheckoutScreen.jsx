import { useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";

const CheckoutScreen = () => {
    const [loading, setLoading] = useState(false);

    // ✅ State for Delivery Address
    const [address, setAddress] = useState({
        fullName: "",
        houseName: "",
        street: "",
        city: "",
        district: "",
        pin: "",
        mobile: "",
        addressType: "home", // Default to home
    });

    const cartItems = useSelector((state) => state.cart.cartItems);
    const userInfo = JSON.parse(localStorage.getItem("userInfo")) || null;

    const cartTotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setAddress({ ...address, [name]: value });
    };

    const handleAddressTypeChange = (e) => {
        setAddress({ ...address, addressType: e.target.value });
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
        const { fullName, houseName, street, city, district, pin, mobile } = address;
        if (!fullName || !houseName || !street || !city || !district || !pin || !mobile) {
            alert("Please fill in all address details! ❌");
            return;
        }

        if (!/^\d{6}$/.test(pin)) {
            alert("Invalid PIN code! ❌");
            return;
        }

        if (!/^\d{10}$/.test(mobile)) {
            alert("Invalid mobile number! ❌");
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
                    deliveryAddress: address, // ✅ Include structured delivery address
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

            {/* ✅ Address Input Form */}
            <div className="mb-3">
                <label className="form-label">Full Name:</label>
                <input
                    type="text"
                    className="form-control"
                    name="fullName"
                    placeholder="Enter full name"
                    value={address.fullName}
                    onChange={handleInputChange}
                />
            </div>

            <div className="mb-3">
                <label className="form-label">Apartment/House Name:</label>
                <input
                    type="text"
                    className="form-control"
                    name="houseName"
                    placeholder="Enter house/apartment name"
                    value={address.houseName}
                    onChange={handleInputChange}
                />
            </div>

            <div className="mb-3">
                <label className="form-label">Street Address:</label>
                <input
                    type="text"
                    className="form-control"
                    name="street"
                    placeholder="Enter street name"
                    value={address.street}
                    onChange={handleInputChange}
                />
            </div>

            <div className="row">
                <div className="col-md-6 mb-3">
                    <label className="form-label">City:</label>
                    <input
                        type="text"
                        className="form-control"
                        name="city"
                        placeholder="Enter city"
                        value={address.city}
                        onChange={handleInputChange}
                    />
                </div>

                <div className="col-md-6 mb-3">
                    <label className="form-label">District:</label>
                    <input
                        type="text"
                        className="form-control"
                        name="district"
                        placeholder="Enter district"
                        value={address.district}
                        onChange={handleInputChange}
                    />
                </div>
            </div>

            <div className="row">
                <div className="col-md-6 mb-3">
                    <label className="form-label">PIN Code:</label>
                    <input
                        type="text"
                        className="form-control"
                        name="pin"
                        placeholder="Enter PIN code"
                        value={address.pin}
                        onChange={handleInputChange}
                    />
                </div>

                <div className="col-md-6 mb-3">
                    <label className="form-label">Mobile Number:</label>
                    <input
                        type="text"
                        className="form-control"
                        name="mobile"
                        placeholder="Enter mobile number"
                        value={address.mobile}
                        onChange={handleInputChange}
                    />
                </div>
            </div>

            {/* ✅ Address Type (Home/Work) */}
            <div className="mb-3">
                <label className="form-label">Address Type:</label>
                <div className="form-check">
                    <input
                        className="form-check-input"
                        type="radio"
                        name="addressType"
                        value="home"
                        checked={address.addressType === "home"}
                        onChange={handleAddressTypeChange}
                    />
                    <label className="form-check-label">Home</label>
                </div>
                <div className="form-check">
                    <input
                        className="form-check-input"
                        type="radio"
                        name="addressType"
                        value="work"
                        checked={address.addressType === "work"}
                        onChange={handleAddressTypeChange}
                    />
                    <label className="form-check-label">Work</label>
                </div>
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
