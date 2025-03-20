import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";

const PaymentSuccess = () => {
    const [searchParams] = useSearchParams();
    const sessionId = searchParams.get("session_id"); // Extract session_id from URL
    const navigate = useNavigate();

    useEffect(() => {
        const updateOrderStatus = async () => {
            if (!sessionId) {
                console.error("❌ No session_id found in URL");
                return;
            }

            try {
                console.log("🔄 Updating order with session_id:", sessionId);
                const { data } = await axios.post("https://bazario-backend-iqac.onrender.com/api/payments/success", {
                    session_id: sessionId, 
                });

                console.log("✅ Order Updated Successfully:", data);
                alert("Payment Successful! ✅ Order status updated.");

                // Redirect to user dashboard or orders page
                navigate("/user-dashboard");

            } catch (error) {
                console.error("❌ Order Update Error:", error.response?.data || error.message);
                alert("Failed to update order. Please contact support.");
            }
        };

        updateOrderStatus();
    }, [sessionId, navigate]);

    return (
        <div className="container">
            <h2>Processing Payment...</h2>
            <p>Please wait while we verify your payment and update your order.</p>
        </div>
    );
};

export default PaymentSuccess;
