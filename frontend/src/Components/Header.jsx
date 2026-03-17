import React from "react";
import { FaSignInAlt, FaUser } from "react-icons/fa";
import { TiShoppingCart } from "react-icons/ti";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../features/Auth/authSlice";

function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const totalQuantity = useSelector((state) => state.cart.totalQuantity);

  const Logout = () => {
    localStorage.removeItem("user");
    dispatch(logout());
    navigate("/Login");
  };

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="text-2xl font-bold tracking-tight">
          <span className="text-indigo-600">buy</span>
          <span className="text-gray-900">cart</span>
        </Link>

        {/* Nav */}
        <nav className="flex items-center gap-2">

          {/* Cart */}
          <Link
            to="/Addtocart"
            className="relative p-2 text-gray-500 hover:text-indigo-600 transition-colors rounded-lg hover:bg-indigo-50"
          >
            <TiShoppingCart size={24} />
            {totalQuantity > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-indigo-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold leading-none">
                {totalQuantity}
              </span>
            )}
          </Link>

          {/* Register */}
          <Link
            to="/Register"
            className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-indigo-600 font-medium px-3 py-2 rounded-lg hover:bg-indigo-50 transition-colors"
          >
            <FaUser size={13} />
            Register
          </Link>

          {/* Login / Logout */}
          {user ? (
            <button
              onClick={Logout}
              className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-red-600 font-medium px-4 py-2 rounded-lg border border-gray-200 hover:border-red-200 hover:bg-red-50 transition-colors"
            >
              <FaSignInAlt size={13} />
              Logout
            </button>
          ) : (
            <Link
              to="/Login"
              className="flex items-center gap-1.5 text-sm text-white bg-indigo-600 hover:bg-indigo-700 font-medium px-4 py-2 rounded-lg transition-colors shadow-sm"
            >
              <FaSignInAlt size={13} />
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;
