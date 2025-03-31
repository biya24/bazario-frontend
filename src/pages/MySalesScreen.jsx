import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { Link } from "react-router-dom";

const MySalesScreen = () => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const userInfo = JSON.parse(localStorage.getItem("userInfo")) || null;
  
  useEffect(() => {
    const fetchSales = async () => {
      if (!userInfo) return;

      try {
        const { data } = await axios.get("https://bazario-backend-iqac.onrender.com/api/orders/vendor", {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        setSales(data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch sales");
      } finally {
        setLoading(false);
      }
    };

    fetchSales();
  }, [userInfo]);

  if (!userInfo) {
    return <h2 className="text-center">Please <Link to="/login">Login</Link> to view your sales</h2>;
  }

  return (
    <div className="container mt-4">
      <h2 className="text-center">My Sales</h2>

      {loading ? (
        <p>Loading sales...</p>
      ) : error ? (
        <p className="text-danger">{error}</p>
      ) : sales.length === 0 ? (
        <p>No sales found.</p>
      ) : (
        <table className="table table-bordered">
          <thead className="thead-dark">
            <tr>
              <th>Order ID</th>
              <th>Buyer</th>
              <th>Date</th>
              <th>Total</th>
              <th>Status</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {sales.map((sale) => (
              <tr key={sale._id}>
                <td>{sale._id}</td>
                <td>{sale.customerId?.name || "Unknown"}</td> 
                <td>{new Date(sale.createdAt).toLocaleDateString()}</td>
                <td>${sale.totalAmount.toFixed(2)}</td>
                <td>{sale.status}</td>
                <td>
                <Link to={`/vendor/order/${sale._id}`} className="btn btn-primary">
                  View Details
                </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MySalesScreen;
