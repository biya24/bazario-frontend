import { useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const EmailVerification = () => {
  const { token } = useParams();

  useEffect(() => {
    console.log("🔹 Extracted Token:", token); // Debugging step
    if (token) {
      verifyEmail(token);
    }
  }, [token]);

  const verifyEmail = async (token) => {
    try {
      const res = await axios.get(
        `https://bazario-backend-iqac.onrender.com/api/users/verify-email/${token}`
      );
      console.log("✅ Verification Response:", res.data);
    } catch (error) {
      console.error("❌ Verification Error:", error);
    }
  };

  return <h2>Verifying Email...</h2>;
};

export default EmailVerification;
