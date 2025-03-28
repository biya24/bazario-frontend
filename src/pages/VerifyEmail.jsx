import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const VerifyEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState("Verifying...");

  useEffect(() => {
    const verify = async () => {
      try {
        const { data } = await axios.get(`https://bazario-backend-iqac.onrender.com/api/auth/verify-email/${token}`);
        setMessage(data.message);
        setTimeout(() => navigate("/login"), 3000);
      } catch (error) {
        setMessage("Invalid or expired link.");
      }
    };
    verify();
  }, [token, navigate]);

  return <div className="container mt-5"><h3>{message}</h3></div>;
};

export default VerifyEmail;
