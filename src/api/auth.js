import axios from "axios";


const API_URL = "http://localhost:5000/api/users";

// ✅ Login API Request
export const login = async (email, password) => {
    const { data } = await axios.post(`${API_URL}/login`, { email, password });
    return data; // ✅ This should return user data with token
  };

// ✅ Register API Request
export const register = async (name, email, password, role) => {
  console.log("🔹 Password Before Sending:", password);
    const { data } = await axios.post(`${API_URL}/signup`, { name, email, password, role });
    return data;
  };

// ✅ Get User Profile (Protected)
export const getUserProfile = async (token) => {
  const { data } = await axios.get(`${API_URL}/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};
