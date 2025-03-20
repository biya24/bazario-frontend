import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../api/auth";

const RegisterScreen = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("customer");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await register(name, email, password, role);
      navigate("/login"); // ✅ Redirect to Login
    } catch (err) {
      setError("Registration failed. Try Again.");
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 shadow" style={{ width: "400px" }}>
        <h2 className="text-center">Register</h2>
        {error && <p className="alert alert-danger">{error}</p>}
        <form onSubmit={handleRegister}>
          <input type="text" className="form-control my-2" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
          <input type="email" className="form-control my-2" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input type="password" className="form-control my-2" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <select className="form-select my-2" value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="customer">Customer</option>
            <option value="vendor">Vendor</option>
          </select>
          <button type="submit" className="btn btn-success w-100 mt-2">Register</button>
        </form>
      </div>
    </div>
  );
};

export default RegisterScreen;
