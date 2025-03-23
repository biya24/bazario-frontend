import { useEffect, useState } from "react";
import { Link } from "react-router-dom";  // ✅ Import Link
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

  // ✅ Delete Order Function
  const deleteOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return; // Confirm before deleting

    try {
      const config = {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      };

      await axios.delete(
        `https://bazario-backend-iqac.onrender.com/api/orders/${orderId}/admin`, 
        config
      );

      // ✅ Remove from state after deletion
      setOrders(orders.filter((order) => order._id !== orderId));
      alert("Order deleted successfully!");
    } catch (error) {
      console.error("❌ Error deleting order:", error);
      alert("Failed to delete order.");
    }
  };

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
              <td>{order.customerId?.name || "Unknown Customer"}</td>
              <td>${Number(order.totalAmount || 0).toFixed(2)}</td> 
              <td>{order.status}</td>
              <td>
                {/* ✅ Link to View Order Details */}
                <Link to={`/admin/orders/${order._id}`} className="btn btn-sm btn-primary">
                  View Details
                </Link>

                {/* ✅ Delete Order */}
                <button 
                  className="btn btn-sm btn-danger ms-2" 
                  onClick={() => deleteOrder(order._id)}
                >
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
