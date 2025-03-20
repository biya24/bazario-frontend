import { Routes, Route } from "react-router-dom";
import HomeScreen from "./pages/HomeScreen";
import LoginScreen from "./pages/LoginScreen";
import RegisterScreen from "./pages/RegisterScreen";
import ProductScreen from "./pages/ProductScreen";
import CartScreen from "./pages/CartScreen";
import DashboardScreen from "./pages/DashboardScreen";
import UserDashboard from "./pages/UserDashboard"; 
import AdminDashboard from "./pages/AdminDashboard";
import VendorDashboard from "./pages/VendorDashboard";
import CheckoutScreen from "./pages/CheckoutScreen";
import PaymentSuccess from "./pages/PaymentSuccess";
import OrderHistory from "./pages/OrderHistory";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomeScreen />} />
      <Route path="/login" element={<LoginScreen />} />
      <Route path="/register" element={<RegisterScreen />} />
      <Route path="/product/:id" element={<ProductScreen />} />
      <Route path="/cart" element={<CartScreen />} />
      <Route path="/dashboard" element={<DashboardScreen />} />
      <Route path="/user-dashboard" element={<UserDashboard />} />
      <Route path="/admin-dashboard" element={<AdminDashboard />} />
      <Route path="/vendor-dashboard" element={<VendorDashboard />} />
      <Route path="/checkout" element={<CheckoutScreen />} />
      <Route path="/payment-success" element={<PaymentSuccess />} />
      <Route path="/orders" element={<OrderHistory />} />
    </Routes>
  );
};

export default AppRoutes;
