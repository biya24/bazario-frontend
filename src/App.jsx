import Navbar from "./components/Navbar";
import AppRoutes from "./routes";
import Footer from "./components/Footer";

function App() {
  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <AppRoutes />
      </div>
      <Footer />
    </>
  );
}

export default App;
