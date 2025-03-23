import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

const OrderDetails = () => {
  const { id } = useParams(); // ✅ Get Order ID from URL
  const [order, setOrder] = useState(null);
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        if (!userInfo || !userInfo.token) {
          throw new Error("Unauthorized: No token found");
        }

        const config = {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        };

        const { data } = await axios.get(
          `https://bazario-backend-iqac.onrender.com/api/orders/${id}`,
          config
        );

        console.log("✅ Order Details:", data);
        setOrder(data);
      } catch (error) {
        console.error("❌ Error fetching order details:", error.response?.data || error.message);
      }
    };

    fetchOrderDetails();
  }, [id]);

  if (!order) {
    return <h3>Loading order details...</h3>;
  }

  return (
    <div>
      <h3>Order Details</h3>
      <p><strong>Order ID:</strong> {order._id}</p>
      <p><strong>Customer:</strong> {order.customerId?.name || "Unknown"}</p>
      <p><strong>Total Price:</strong> ${Number(order.totalAmount || 0).toFixed(2)}</p>
      <p><strong>Status:</strong> {order.status}</p>

      <h4>Items</h4>
      <ul>
        {order.items.map((item, index) => (
          <li key={index}>
            {item.productId?.name || "Unknown Product"} - {item.quantity} x ${item.price}
          </li>
        ))}
      </ul>

      <Link to="/admin/orders" className="btn btn-secondary">Back to Orders</Link>
    </div>
  );
};

export default OrderDetails;
