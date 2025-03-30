import { useEffect } from "react";
import { useDispatch } from 'react-redux';
import Navbar from "./components/Navbar";
import AppRoutes from "./routes";
import Footer from "./components/Footer";
import { initializeCart } from "./redux/cartSlice";

function App() {
  const dispatch = useDispatch();
    
  useEffect(() => {
    // Initialize cart from localStorage
    dispatch(initializeCart());
    
    // Optional: You might want to add error handling here
    try {
      dispatch(initializeCart());
    } catch (error) {
      console.error("Failed to initialize cart:", error);
      // Optionally dispatch an action to handle the error state
    }
  }, [dispatch]);
    
  return (
    <div className="app-container">
      <Navbar />
      <main className="container mt-4 mb-5">  {/* Added mb-5 for footer spacing */}
        <AppRoutes />
      </main>
      <Footer />
    </div>
  );
}

export default App;