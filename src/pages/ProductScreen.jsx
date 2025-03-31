import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { addToCart } from "../redux/cartSlice";
import { addToWishlist, removeFromWishlist } from "../redux/wishlistSlice";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import "../styles/wishlist.css";

const ProductScreen = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const wishlist = useSelector((state) => state.wishlist.wishlistItems);
  const isWishlisted = wishlist.some((item) => item._id === id);

  // ✅ Check if user is logged in
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  useEffect(() => {
    const fetchProduct = async () => {
      const { data } = await axios.get(
        `https://bazario-backend-iqac.onrender.com/api/products/${id}`
      );
      setProduct(data);
    };

    const fetchReviews = async () => {
      const { data } = await axios.get(
        `https://bazario-backend-iqac.onrender.com/api/reviews/${id}`
      );
      setReviews(data);
    };

    fetchProduct();
    fetchReviews();
  }, [id]);

  // ✅ Add to Cart with Login Check
  const addToCartHandler = () => {
    if (!userInfo || !userInfo.token) {
      alert("❌ Please log in to add items to your cart.");
      return;
    }
    if (!product) return;
    dispatch(addToCart({ ...product, quantity }));
    alert("✅ Product added to cart!");
  };

  // ✅ Toggle Wishlist with Login Check
  const toggleWishlistHandler = () => {
    if (!userInfo || !userInfo.token) {
      alert("❌ Please log in to add items to your wishlist.");
      return;
    }
    if (isWishlisted) {
      dispatch(removeFromWishlist(id));
      alert("✅ Product removed from wishlist!");
    } else {
      dispatch(addToWishlist(product));
      alert("✅ Product added to wishlist!");
    }
  };

  // ✅ Submit Review
  const submitReviewHandler = async () => {
    if (!userInfo || !userInfo.token) {
      alert("❌ Please log in to submit a review.");
      return;
    }

    if (!rating || rating < 1 || rating > 5) {
      alert("❌ Please provide a valid rating (1-5).");
      return;
    }

    try {
      const { data } = await axios.post(
        "https://bazario-backend-iqac.onrender.com/api/reviews",
        {
          productId: id,
          rating,
          comment,
        },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      alert("✅ Review submitted successfully!");
      setReviews([data.review, ...reviews]); // Add new review to the list
      setRating(0); // Clear rating
      setComment(""); // Clear comment
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("❌ Failed to submit review.");
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <span key={i} className={`star ${i < rating ? "filled" : ""}`}>
          ★
        </span>
      );
    }
    return stars;
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

        {/* ✅ Wishlist Button */}
        <button className="btn btn-light mx-2" onClick={toggleWishlistHandler}>
          {isWishlisted ? <FaHeart color="red" /> : <FaRegHeart />}
        </button>

        <button className="btn btn-success" onClick={addToCartHandler}>
          Add to Cart
        </button>

        {/* ✅ Review Form */}
        {/* {userInfo && userInfo.role === "customer" && (
          <div className="mt-4">
            <h4>Write a Review</h4>
            <div>
              <label>Rating (1 to 5):</label>
              <select
                className="form-select w-25 mb-3"
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
              >
                {[1, 2, 3, 4, 5].map((x) => (
                  <option key={x} value={x}>
                    {x}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label>Comment:</label>
              <textarea
                className="form-control"
                rows="3"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              ></textarea>
            </div>
            <button
              className="btn btn-primary mt-3"
              onClick={submitReviewHandler}
            >
              Submit Review
            </button>
          </div>
        )} */}

        {/* ✅ Display Reviews */}
        <div className="mt-4">
          <h4>Customer Reviews</h4>
          {reviews.length === 0 ? (
            <p>No reviews yet.</p>
          ) : (
            <ul className="list-group">
              {reviews.map((review) => (
                <li key={review._id} className="list-group-item">
                  <div className="d-flex justify-content-between">
                    <strong>{review.customerId.name}</strong>
                    <div className="text-warning">{renderStars(review.rating)}</div>
                  </div>
                  <p>{review.comment}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductScreen;
