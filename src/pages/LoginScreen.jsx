import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showResend, setShowResend] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const { data } = await axios.post("https://bazario-backend-iqac.onrender.com/api/users/login", {
        email,
        password,
      });

      if (!data.isVerified) {
        setShowResend(true);
        setError("Your email is not verified. Please verify before logging in.");
        setLoading(false);
        return;
      }

      localStorage.setItem("userInfo", JSON.stringify(data)); // Store user data
      navigate("/dashboard");
    } catch (err) {
      if (err.response?.data?.message === "Please verify your email before logging in") {
        setShowResend(true); // ✅ This ensures the button appears if verification is required
    }
      setError(err.response?.data?.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    setMessage("");
    setError("");
    setLoading(true);

    try {
      const { data } = await axios.post("https://bazario-backend-iqac.onrender.com/api/users/resend-verification", { email });
      setMessage(data.message);
      setShowResend(false);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to resend email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 shadow" style={{ width: "400px" }}>
        <h2 className="text-center">Login</h2>
        
        {error && <p className="alert alert-danger">{error}</p>}
        {message && <p className="alert alert-success">{message}</p>}

        <form onSubmit={handleLogin}>
          <input type="email" className="form-control my-2" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input type="password" className="form-control my-2" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <button type="submit" className="btn btn-success w-100 mt-2" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {showResend && (
          <button className="btn btn-warning w-100 mt-3" onClick={handleResendVerification} disabled={loading}>
            {loading ? "Resending..." : "Resend Verification Email"}
          </button>
        )}

        <p className="text-center mt-3">
          Don't have an account? <a href="/register">Register</a>
        </p>
      </div>
    </div>
  );
};

export default LoginScreen;
