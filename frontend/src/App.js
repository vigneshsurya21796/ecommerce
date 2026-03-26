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
import Profile from "./pages/Profile/Profile.jsx";
import AdminLayout from "./pages/Admin/AdminLayout.jsx";
import AdminDashboard from "./pages/Admin/AdminDashboard.jsx";
import AdminOrders from "./pages/Admin/AdminOrders.jsx";
import AdminProducts from "./pages/Admin/AdminProducts.jsx";
import AdminUsers from "./pages/Admin/AdminUsers.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProtectedRoute from "./Components/ProtectedRoute";
import ErrorBoundary from "./Components/ErrorBoundary";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <>
      <Router>
        <Routes>
          {/* Admin routes — no Header */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="users" element={<AdminUsers />} />
          </Route>

          {/* Store routes — with Header */}
          <Route path="/*" element={
            <div className="container">
              <Header />
              <Routes>
                <Route path="/" element={<ErrorBoundary><Dashboard /></ErrorBoundary>} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/cart" element={<ProtectedRoute><Addtocart /></ProtectedRoute>} />
                <Route path="/product/:id" element={<Singlepage />} />
                <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
                <Route path="/orders" element={<ProtectedRoute><OrderHistory /></ProtectedRoute>} />
                <Route path="/wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
          } />
        </Routes>
      </Router>
      <ToastContainer />
    </>
  );
}

export default App;
