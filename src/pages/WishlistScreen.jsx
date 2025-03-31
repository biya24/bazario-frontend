import { useDispatch, useSelector } from "react-redux";
import { removeFromWishlist } from "../redux/wishlistSlice";
import { Link } from "react-router-dom";
import { FaTrash } from "react-icons/fa";

const WishlistScreen = () => {
  const dispatch = useDispatch();
  const wishlistItems = useSelector((state) => state.wishlist.wishlistItems);

  return (
    <div className="container mt-4">
      <h2 className="text-center">Your Wishlist</h2>

      {wishlistItems.length === 0 ? (
        <p className="text-center">Your wishlist is empty! <Link to="/">Go shopping</Link></p>
      ) : (
        <div className="row">
          {wishlistItems.map((item) => (
            <div key={item._id} className="col-md-4">
              <div className="card mb-4">
                {/* ✅ Fixed Image Display */}
                <img
                  src={item.images && item.images.length > 0 ? item.images[0] : "/placeholder.jpg"} 
                  className="card-img-top wishlist-img"
                  alt={item.name}
                />

                <div className="card-body">
                  <h5 className="card-title">{item.name}</h5>
                  <p className="card-text">${item.price}</p>

                  <div className="d-flex justify-content-between">
                    <Link to={`/product/${item._id}`} className="btn btn-primary">
                      View Product
                    </Link>

                    <button
                      className="btn btn-danger"
                      onClick={() => dispatch(removeFromWishlist(item._id))}
                    >
                      <FaTrash /> Remove
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistScreen;
