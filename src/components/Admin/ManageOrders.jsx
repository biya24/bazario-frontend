import { useEffect, useState } from "react";
import axios from "axios";

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        if (!userInfo || !userInfo.token) {
          throw new Error("Unauthorized: No token found");
        }

        const config = {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        };

        const { data } = await axios.get(
          "https://bazario-backend-iqac.onrender.com/api/orders/admin",
          config
        );

        console.log("✅ Admin Orders Response:", data);
        setOrders(data);
      } catch (error) {
        console.error("❌ Error fetching orders:", error.response?.data || error.message);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div>
      <h3>Manage Orders</h3>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer</th>
            <th>Total Price</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order._id}>
              <td>{order._id}</td>
              <td>{order.user?.name || "Guest"}</td>
              <td>${order.totalPrice.toFixed(2)}</td>
              <td>{order.status}</td>
              <td>
                <button className="btn btn-sm btn-primary">
                  View Details
                </button>
                <button className="btn btn-sm btn-danger ms-2">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageOrders;
