import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./redux/store"; // ✅ Import Redux store
import App from "./App";
import "bootstrap/dist/css/bootstrap.min.css"; // Bootstrap Styles
import "bootstrap/dist/js/bootstrap.bundle.min.js"; // ✅ Required for Navbar toggle



ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}> {/* ✅ Wrap entire app with Redux Provider */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
);
