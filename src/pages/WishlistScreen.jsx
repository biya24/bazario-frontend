import { useDispatch, useSelector } from "react-redux";
import { removeFromWishlist } from "../redux/wishlistSlice";
import { Link } from "react-router-dom";
import "../styles/Wishlist.css"

const WishlistScreen = () => {
    const dispatch = useDispatch();
    const wishlistItems = useSelector((state) => state.wishlist.wishlistItems);

    return (
        <div className="wishlist-container">
            <h2>My Wishlist</h2>
            {wishlistItems.length === 0 ? (
                <p>Your wishlist is empty. <Link to="/">Start shopping!</Link></p>
            ) : (
                <ul>
                    {wishlistItems.map((item) => (
                        <li key={item._id} className="wishlist-item">
                            <img src={item.image} alt={item.name} />
                            <div>
                                <h4>{item.name}</h4>
                                <p>${item.price}</p>
                                <button onClick={() => dispatch(removeFromWishlist(item._id))}>
                                    Remove
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default WishlistScreen;
