import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./Components/Header";
import Dashboard from "./pages/Dashboard/Dashboard.jsx";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Singlepage from "./pages/Singlepage/Singlepage";
import Addtocart from "./Components/Cart/Addtocart.jsx";
import Checkout from "./pages/Checkout/Checkout.jsx";
import OrderHistory from "./pages/OrderHistory/OrderHistory.jsx";
import Wishlist from "./pages/Wishlist/Wishlist.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <>
      <Router>
        <div className="container">
          <Header />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/cart" element={<Addtocart />} />
            <Route path="/product/:id" element={<Singlepage />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/orders" element={<OrderHistory />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="*" element={<h1>Not Found</h1>} />
          </Routes>
        </div>
      </Router>
      <ToastContainer />
    </>
  );
}

export default App;
