import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import { addToCart } from "../redux/cartSlice";

const ProductScreen = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1); // ✅ Default quantity is 1

  useEffect(() => {
    const fetchProduct = async () => {
      const { data } = await axios.get(`http://localhost:5000/api/products/${id}`);
      setProduct(data);
    };
    fetchProduct();
  }, [id]);

  const addToCartHandler = () => {
    if (!product) return;
    dispatch(addToCart({ ...product, quantity })); // ✅ Add selected quantity
  };

  if (!product) return <h2>Loading...</h2>;

  return (
    <div className="row">
      <div className="col-md-6">
        <img src={product.images[0]} className="img-fluid" alt={product.name} />
      </div>
      <div className="col-md-6">
        <h2>{product.name}</h2>
        <p>{product.description}</p>
        <h3>${product.price}</h3>

        {/* ✅ Quantity Selector */}
        <label>Quantity:</label>
        <select 
          className="form-select w-25 mb-3" 
          value={quantity} 
          onChange={(e) => setQuantity(Number(e.target.value))}
        >
          {[...Array(10).keys()].map((x) => (
            <option key={x + 1} value={x + 1}>
              {x + 1}
            </option>
          ))}
        </select>

        <button className="btn btn-success" onClick={addToCartHandler}>
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductScreen;
