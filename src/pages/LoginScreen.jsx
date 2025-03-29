import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api/auth";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
        const userData = await login(email, password);
        console.log("Login Success:", userData);  // ✅ Debug API Response
        
        localStorage.setItem("userInfo", JSON.stringify(userData)); // ✅ Save user data
        navigate("/dashboard"); // ✅ Redirect user
    } catch (err) {
        console.error("Login Error:", err.response?.data || err.message); // ✅ Debug Errors
        setError("Invalid Credentials. Try Again.");
    }
};

const handleResendVerification = async () => {
  try {
    const { data } = await axios.post(
      "https://bazario-backend-iqac.onrender.com/api/users/resend-verification",
      { email }
    );
    alert(data.message);
  } catch (error) {
    alert(error.response?.data?.message || "Failed to resend email");
  }
};

<button onClick={handleResendVerification} className="btn btn-warning">
  Resend Verification Email
</button>;



  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 shadow" style={{ width: "400px" }}>
        <h2 className="text-center">Login</h2>
        {error && <p className="alert alert-danger">{error}</p>}
        <form onSubmit={handleLogin}>
          <input type="email" className="form-control my-2" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input type="password" className="form-control my-2" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <button type="submit" className="btn btn-primary w-100 mt-2">Login</button>
        </form>
        <button onClick={handleResendVerification} className="btn btn-warning">
  Resend Verification Email
</button>;
      </div>
    </div>
  );
};

export default LoginScreen;
