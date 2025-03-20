import { useState } from "react";
import ManageUsers from "../components/Admin/ManageUsers";
import ManageProducts from "../components/Admin/ManageProducts";
import ManageOrders from "../components/Admin/ManageOrders";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("users");

  return (
    <div className="container mt-4">
      <h2 className="text-primary">Admin Dashboard</h2>

      {/* Navigation Tabs */}
      <div className="btn-group mb-4">
        <button className={`btn ${activeTab === "users" ? "btn-primary" : "btn-outline-primary"}`} onClick={() => setActiveTab("users")}>
          Users
        </button>
        <button className={`btn ${activeTab === "products" ? "btn-primary" : "btn-outline-primary"}`} onClick={() => setActiveTab("products")}>
          Products
        </button>
        <button className={`btn ${activeTab === "orders" ? "btn-primary" : "btn-outline-primary"}`} onClick={() => setActiveTab("orders")}>
          Orders
        </button>
      </div>

      {/* Conditional Rendering for Tabs */}
      {activeTab === "users" && <ManageUsers />}
      {activeTab === "products" && <ManageProducts />}
      {activeTab === "orders" && <ManageOrders />}
    </div>
  );
};

export default AdminDashboard;
