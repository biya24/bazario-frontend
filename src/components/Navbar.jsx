import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaHeart } from "react-icons/fa";

const Navbar = () => {
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.cart.cartItems);
  const wishlistItems = useSelector((state) => state.wishlist.wishlistItems);


  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg" style={{ backgroundColor: "#0077b6", boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)" }}>
      <div className="container">
        {/* ✅ Brand Logo */}
        <Link className="navbar-brand fw-bold fs-4 text-white" to="/">Bazario</Link>

        {/* ✅ Navbar Toggler (Mobile) */}
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
          aria-controls="navbarNav" 
          aria-expanded="false" 
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* ✅ Navbar Items */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto d-flex align-items-center gap-3">

            {userInfo ? (
              <>
                {/* ✅ User Greeting */}
                <li className="nav-item text-white">Welcome, <strong>{userInfo.name}</strong></li>

                {/* ✅ Role-based Navigation */}
                {userInfo.role === "admin" && (
                  <li className="nav-item">
                    <Link className="btn text-white" style={{ backgroundColor: "#023e8a" }} to="/admin-dashboard">Admin Panel</Link>
                  </li>
                )}

                {userInfo.role === "vendor" && (
                  <>
                    <li className="nav-item">
                      <Link className="btn text-white" style={{ backgroundColor: "#0096c7" }} to="/vendor-dashboard">Vendor Dashboard</Link>
                    </li>
                    <li className="nav-item">
                      <Link className="btn text-white" style={{ backgroundColor: "#00b4d8" }} to="/vendor-orders">My Sales</Link>
                    </li>
                  </>
                )}

                {userInfo.role === "customer" && (
                  <>
                    <li className="nav-item">
                      <Link className="btn text-white" style={{ backgroundColor: "#48cae4" }} to="/user-dashboard">My Dashboard</Link>
                    </li>
                    <li className="nav-item">
                      <Link className="btn text-white" style={{ backgroundColor: "#90e0ef" }} to="/orders">My Orders</Link>
                    </li>
                    <li className="nav-item position-relative">
                      <Link className="btn text-white position-relative" style={{ backgroundColor: "#ade8f4" }} to="/cart">
                        🛒 Cart
                        {cartItems.length > 0 && (
                          <span className="badge bg-danger position-absolute top-0 start-100 translate-middle">
                            {cartItems.length}
                          </span>
                        )}
                      </Link>
                    </li>
                    <li>
                    <Link className="btn text-white" style={{ backgroundColor: "#90e0ef" }} to="/wishlist">
                <FaHeart /> Wishlist ({wishlistItems.length})
            </Link>
                    </li>
                  </>
                )}

                {/* ✅ Logout Button */}
                <li className="nav-item">
                  <button className="btn btn-danger" onClick={logoutHandler}>Logout</button>
                </li>
              </>
            ) : (
              <>
                {/* ✅ Login & Register */}
                <li className="nav-item">
                  <Link className="btn text-white" style={{ backgroundColor: "#00b4d8" }} to="/login">Login</Link>
                </li>
                <li className="nav-item">
                  <Link className="btn text-white" style={{ backgroundColor: "#48cae4" }} to="/register">Register</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
