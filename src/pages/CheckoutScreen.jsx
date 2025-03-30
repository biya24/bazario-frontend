import { useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaSpinner } from "react-icons/fa";
import "../CheckoutScreen.css";
import { clearCart } from "../redux/cartSlice";
import { useDispatch } from 'react-redux';


const CheckoutScreen = () => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState({
        order: false,
        payment: false
    });
    const [address, setAddress] = useState({
        fullName: "",
        houseName: "",
        street: "",
        city: "",
        district: "",
        pin: "",
        mobile: "",
        addressType: "home",
    });
    const [paymentError, setPaymentError] = useState(null);
    const navigate = useNavigate();

    const cartItems = useSelector((state) => state.cart.cartItems);
    const userInfo = JSON.parse(localStorage.getItem("userInfo")) || null;
    const cartTotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

    const handleAddressChange = (e) => {
        setAddress((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    const validateAddress = () => {
        const requiredFields = ['fullName', 'houseName', 'street', 'city', 'district', 'pin', 'mobile'];
        const missingFields = requiredFields.filter(field => !address[field]);
        
        if (missingFields.length > 0) {
            setPaymentError(`Missing required fields: ${missingFields.join(', ')}`);
            return false;
        }
        
        if (!/^\d{10}$/.test(address.mobile)) {
            setPaymentError("Mobile number must be 10 digits");
            return false;
        }
        
        if (!/^\d{6}$/.test(address.pin)) {
            setPaymentError("PIN code must be 6 digits");
            return false;
        }
        
        setPaymentError(null);
        return true;
    };

    const handlePayment = async () => {
        if (!userInfo) {
            alert("You must be logged in to place an order! ❌");
            navigate('/login');
            return;
        }

        if (!cartItems || cartItems.length === 0) {
            alert("Your cart is empty! ❌");
            navigate('/cart');
            return;
        }

        if (!validateAddress()) {
            return;
        }

        try {
            // Step 1: Create Order
            setLoading(prev => ({ ...prev, order: true }));
            
            const orderResponse = await axios.post(
                "https://bazario-backend-iqac.onrender.com/api/orders",
                {
                    items: cartItems.map((item) => ({
                        productId: item._id,
                        name: item.name,
                        quantity: item.quantity,
                        price: item.price,
                        image: item.image // Include if needed by backend
                    })),
                    totalAmount: cartTotal,
                    deliveryAddress: address,
                },
                {
                    headers: { 
                        Authorization: `Bearer ${userInfo.token}`,
                        "Content-Type": "application/json"
                    },
                }
            );

            const orderId = orderResponse.data.order?._id;
            if (!orderId) {
                throw new Error("Order ID not received from server");
            }

            console.log("✅ Order Created:", orderResponse.data);

            // Step 2: Process Payment
            setLoading(prev => ({ ...prev, payment: true }));
            
            const paymentResponse = await axios.post(
                "https://bazario-backend-iqac.onrender.com/api/payments/pay",
                {
                    orderId,
                    amount: Math.round(cartTotal * 100), // Convert to cents
                    currency: "CAD",
                    customerEmail: userInfo.email,
                    customerName: userInfo.name
                },
                {
                    headers: { 
                        Authorization: `Bearer ${userInfo.token}`,
                        "Content-Type": "application/json"
                    },
                }
            );

            console.log("✅ Payment Response:", paymentResponse.data);

            if (paymentResponse.data?.url) {
                dispatch(clearCart());
                window.location.href = paymentResponse.data.url;
            } else {
                throw new Error("Payment gateway URL not received");
            }

        } catch (error) {
            console.error("❌ Checkout Error:", {
                message: error.message,
                response: error.response?.data,
                stack: error.stack
            });
            
            setPaymentError(
                error.response?.data?.message || 
                error.message || 
                "Payment processing failed. Please try again."
            );
            
            // Optionally: Redirect to order page if order was created but payment failed
            if (error.response?.data?.orderId) {
                navigate(`/order/${error.response.data.orderId}`);
            }
        } finally {
            setLoading({ order: false, payment: false });
        }
    };

    return (
        <div className="checkout-container">
            <h2 className="checkout-title">Checkout</h2>
            
            {paymentError && (
                <div className="alert alert-danger">
                    {paymentError}
                </div>
            )}

            <div className="address-section">
                <h4>Delivery Address</h4>
                <div className="address-form">
                    <input 
                        type="text" 
                        name="fullName" 
                        placeholder="Full Name" 
                        value={address.fullName} 
                        onChange={handleAddressChange} 
                        required 
                    />
                    <input 
                        type="text" 
                        name="houseName" 
                        placeholder="House/Apartment Name/Number" 
                        value={address.houseName} 
                        onChange={handleAddressChange} 
                        required 
                    />
                    <input 
                        type="text" 
                        name="street" 
                        placeholder="Street Address" 
                        value={address.street} 
                        onChange={handleAddressChange} 
                        required 
                    />
                    <input 
                        type="text" 
                        name="city" 
                        placeholder="City" 
                        value={address.city} 
                        onChange={handleAddressChange} 
                        required 
                    />
                    <input 
                        type="text" 
                        name="district" 
                        placeholder="District" 
                        value={address.district} 
                        onChange={handleAddressChange} 
                        required 
                    />
                    <input 
                        type="text" 
                        name="pin" 
                        placeholder="PIN Code" 
                        value={address.pin} 
                        onChange={handleAddressChange} 
                        pattern="\d{6}"
                        title="6-digit PIN code"
                        required 
                    />
                    <input 
                        type="tel" 
                        name="mobile" 
                        placeholder="Mobile Number" 
                        value={address.mobile} 
                        onChange={handleAddressChange} 
                        pattern="\d{10}"
                        title="10-digit mobile number"
                        required 
                    />

                    <div className="address-type">
                        <label>
                            <input 
                                type="radio" 
                                name="addressType" 
                                value="home" 
                                checked={address.addressType === "home"} 
                                onChange={handleAddressChange} 
                            /> Home
                        </label>
                        <label>
                            <input 
                                type="radio" 
                                name="addressType" 
                                value="work" 
                                checked={address.addressType === "work"} 
                                onChange={handleAddressChange} 
                            /> Work
                        </label>
                    </div>
                </div>
            </div>

            <div className="order-summary">
                <h4>Order Summary</h4>
                <ul>
                    {cartItems.map(item => (
                        <li key={item._id}>
                            {item.name} × {item.quantity} - ${(item.price * item.quantity).toFixed(2)}
                        </li>
                    ))}
                </ul>
                <p className="total-amount">Total: ${cartTotal.toFixed(2)} CAD</p>
            </div>

            <button 
                onClick={handlePayment} 
                disabled={loading.order || loading.payment} 
                className="pay-button"
            >
                {loading.order || loading.payment ? (
                    <>
                        <FaSpinner className="spinner" />
                        {loading.order ? "Creating Order..." : "Processing Payment..."}
                    </>
                ) : (
                    "Pay Now"
                )}
            </button>
        </div>
    );
};

export default CheckoutScreen;