import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const HomeScreen = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get("https://bazario-backend-iqac.onrender.com/api/products");
        setProducts(data);
      } catch (error) {
        console.error("❌ Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">🔥 Featured Products</h2>
      <div className="row">
        {products.map((product) => (
          <div key={product._id} className="col-lg-4 col-md-6 mb-4">
            <div className="card">
              <img src={product.images[0]} className="card-img-top" alt={product.name} />
              <div className="card-body">
                <h5 className="card-title">{product.name}</h5>
                <p className="card-text">${product.price}</p>
                <Link to={`/product/${product._id}`} className="btn btn-primary">View</Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomeScreen;
