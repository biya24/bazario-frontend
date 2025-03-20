import { useEffect, useState } from "react";
import axios from "axios";

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  useEffect(() => {
    const fetchProducts = async () => {
      try {
          if (!userInfo || !userInfo.token) {
              throw new Error("Unauthorized: No token found");
          }
    
          const config = {
              headers: { Authorization: `Bearer ${userInfo.token}` },
          };
    
          const { data } = await axios.get("http://localhost:5000/api/products/admin", config);
    
          console.log("✅ Admin API Response:", data); // ✅ Log API Response
    
          setProducts(data);
      } catch (error) {
          console.error("❌ Error fetching products:", error.response?.data || error.message);
      }
    };
    
    
    
  
    fetchProducts();
  }, []);

  const deleteProduct = async (productId) => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      };
  
      await axios.delete(`http://localhost:5000/api/products/${productId}/admin`, config); // ✅ Updated route
      setProducts(products.filter((product) => product._id !== productId));
    } catch (error) {
      console.error("❌ Error deleting product:", error);
    }
  };
  

  return (
    <div>
      <h3>Manage Products</h3>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Product</th>
            <th>Vendor</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product._id}>
              <td>{product.name}</td>
              <td>{product.vendorId?.name || "Unknown Vendor"}</td>
              <td>${product.price}</td>
              <td>{product.stock}</td>
              <td>
                <button className="btn btn-sm btn-danger" onClick={() => deleteProduct(product._id)}>
                  Delete
                </button>
                {/* Optional: Add Edit Button Here */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageProducts;
