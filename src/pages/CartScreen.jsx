import { useDispatch, useSelector } from "react-redux";
import { removeFromCart, updateCartQuantity } from "../redux/cartSlice";
import { Link } from "react-router-dom";

const CartScreen = () => {
    const dispatch = useDispatch();
    const cartItems = useSelector((state) => state.cart.cartItems);

    const handleQuantityChange = (id, quantity) => {
        if (quantity > 0) {
            dispatch(updateCartQuantity({ id, quantity }));
        }
    };

    return (
        <div className="container mt-4">
            <h2>🛒 Shopping Cart</h2>
            {cartItems.length === 0 ? (
                <p>Your cart is empty. <Link to="/">Go Shopping</Link></p>
            ) : (
                <div className="table-responsive">
                    <table className="table table-bordered">
                        <thead className="table-dark">
                            <tr>
                                <th>Product</th>
                                <th>Price</th>
                                <th>Quantity</th>
                                <th>Subtotal</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cartItems.map((item) => (
                                <tr key={item.productId || item._id}>
                                    <td>{item.name}</td>
                                    <td>${item.price}</td>
                                    <td>
                                        <button 
                                            className="btn btn-sm btn-secondary me-1" 
                                            onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                                            disabled={item.quantity <= 1}
                                        >-</button>

                                        <span className="mx-2">{item.quantity}</span>

                                        <button 
                                            className="btn btn-sm btn-secondary ms-1" 
                                            onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                                        >+</button>
                                    </td>
                                    <td>${(item.price * item.quantity).toFixed(2)}</td>
                                    <td>
                                        <button 
                                            className="btn btn-danger btn-sm"
                                            onClick={() => dispatch(removeFromCart(item._id))}
                                        >
                                            Remove
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* ✅ Show Total Price */}
            {cartItems.length > 0 && (
                <h4 className="mt-3">Total: ${cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2)}</h4>
            )}

            <Link to="/checkout" className="btn btn-success mt-3">Proceed to Checkout</Link>
        </div>
    );
};

export default CartScreen;
