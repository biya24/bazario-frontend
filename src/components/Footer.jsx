import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="text-white py-4 mt-5" style={{ backgroundColor: "#0077b6" }}>
      <div className="container text-center">
        <div className="row">
          {/* ✅ Company Info */}
          <div className="col-md-4 mb-3">
            <h5>Bazario</h5>
            <p>Your go-to multi-vendor marketplace for quality products!</p>
          </div>

          {/* ✅ Quick Links */}
          <div className="col-md-4 mb-3">
            <h5>Quick Links</h5>
            <ul className="list-unstyled">
              <li><Link to="/" className="text-white text-decoration-none">Home</Link></li>
              <li><Link to="/about" className="text-white text-decoration-none">About Us</Link></li>
              <li><Link to="/contact" className="text-white text-decoration-none">Contact</Link></li>
              <li><Link to="/faq" className="text-white text-decoration-none">FAQ</Link></li>
            </ul>
          </div>

          {/* ✅ Contact Info */}
          <div className="col-md-4 mb-3">
            <h5>Contact Us</h5>
            <p>Email: support@bazario.com</p>
            <p>Phone: +1 (234) 567-890</p>
            <p>Location: Toronto, Canada</p>
          </div>
        </div>

        {/* ✅ Bottom Copyright Section */}
        <hr style={{ borderColor: "#90e0ef" }} />
        <p className="mb-0">© {new Date().getFullYear()} Bazario. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
