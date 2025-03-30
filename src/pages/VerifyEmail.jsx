import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const VerifyEmail = () => {
  const { token } = useParams();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const verifyEmail = async () => {
      console.log("Verification token:", token); // Debugging
      try {
        const response = await axios.get(
          `https://bazario-backend-iqac.onrender.com/api/users/verify-email/${token}`
        );
        setMessage(response.data.message);
      } catch (err) {
        setError(err.response?.data?.message || "Verification failed.");
      }
    };

    if (token) {
      verifyEmail();
    }
  }, [token]);

  return (
    <div className="container">
      <h2>Email Verification</h2>
      {message && <p className="alert alert-success">{message}</p>}
      {error && <p className="alert alert-danger">{error}</p>}
      {message && (
        <button onClick={() => navigate("/login")} className="btn btn-primary">
          Go to Login
        </button>
      )}
    </div>
  );
};

export default VerifyEmail;
