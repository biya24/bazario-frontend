import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const OrderDetails = () => {
  const { id } = useParams(); // Get Order ID from URL
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
        console.error("❌ Error fetching order details:", error);
      }
    };

    fetchOrderDetails();
  }, [id]);

  if (!order) return <p>Loading...</p>;

  return (
    <div>
      <h3>Order Details - {order._id}</h3>
      <p><strong>Customer:</strong> {order.customerId?.name || "Unknown"}</p>
      <p><strong>Total Price:</strong> ${Number(order.totalAmount || 0).toFixed(2)}</p>
      <p><strong>Status:</strong> {order.status}</p>
    </div>
  );
};

export default OrderDetails;
