import React, { useState, useEffect, useRef } from "react";
import { FaSignInAlt, FaUser, FaClipboardList, FaSearch, FaTimes, FaHeart, FaChartBar } from "react-icons/fa";
import { TiShoppingCart } from "react-icons/ti";
import { Link, useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../features/Auth/authSlice";

function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const { user } = useSelector((state) => state.auth);
  const totalQuantity = useSelector((state) => state.cart.totalQuantity);
  const wishlistCount = useSelector((state) => state.wishlist.items.length);

  const [query, setQuery] = useState(searchParams.get("q") || "");
  const inputRef = useRef(null);
  const debounceRef = useRef(null);

  // Keep input in sync when user navigates back/forward
  useEffect(() => {
    setQuery(searchParams.get("q") || "");
  }, [searchParams]);

  // Debounced search — waits 300ms after user stops typing
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      if (value.trim()) {
        navigate(`/?q=${encodeURIComponent(value.trim())}`, { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    }, 300);
  };

  const clearSearch = () => {
    setQuery("");
    navigate("/", { replace: true });
    inputRef.current?.focus();
  };

  const Logout = () => {
    localStorage.removeItem("user");
    dispatch(logout());
    navigate("/login");
  };

  const showSearch = location.pathname === "/";

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center gap-4">

        {/* Logo */}
        <Link to="/" className="text-2xl font-bold tracking-tight flex-shrink-0">
          <span className="text-indigo-600">buy</span>
          <span className="text-gray-900">cart</span>
        </Link>

        {/* Search Bar — auto-search on every keystroke */}
        {showSearch && (
          <div className="flex-1 max-w-xl mx-auto">
            <div className="relative flex items-center">
              <FaSearch size={14} className="absolute left-3.5 text-gray-400 pointer-events-none" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={handleSearchChange}
                placeholder="Search products..."
                className="w-full pl-9 pr-9 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition"
              />
              {query && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-3 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <FaTimes size={13} />
                </button>
              )}
            </div>
          </div>
        )}

        {!showSearch && <div className="flex-1" />}

        {/* Nav */}
        <nav className="flex items-center gap-2 flex-shrink-0">

          {/* Wishlist */}
          <Link
            to="/wishlist"
            className="relative p-2 text-gray-500 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50"
          >
            <FaHeart size={20} />
            {wishlistCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold leading-none">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* Cart */}
          <Link
            to="/cart"
            className="relative p-2 text-gray-500 hover:text-indigo-600 transition-colors rounded-lg hover:bg-indigo-50"
          >
            <TiShoppingCart size={24} />
            {totalQuantity > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-indigo-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold leading-none">
                {totalQuantity}
              </span>
            )}
          </Link>

          {/* My Orders + Profile */}
          {user && (
            <>
              {user.isAdmin && (
                <Link
                  to="/admin"
                  className="flex items-center gap-1.5 text-sm text-indigo-600 hover:text-indigo-800 font-medium px-3 py-2 rounded-lg hover:bg-indigo-50 transition-colors"
                >
                  <FaChartBar size={13} />
                  Admin
                </Link>
              )}
              <Link
                to="/orders"
                className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-indigo-600 font-medium px-3 py-2 rounded-lg hover:bg-indigo-50 transition-colors"
              >
                <FaClipboardList size={13} />
                My Orders
              </Link>
              <Link
                to="/profile"
                className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-600 hover:bg-indigo-700 transition-colors text-white text-sm font-bold"
                title={`${user.name} — Profile`}
              >
                {user.name?.charAt(0).toUpperCase()}
              </Link>
            </>
          )}

          {/* Register */}
          {!user && (
            <Link
              to="/register"
              className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-indigo-600 font-medium px-3 py-2 rounded-lg hover:bg-indigo-50 transition-colors"
            >
              <FaUser size={13} />
              Register
            </Link>
          )}

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
              to="/login"
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
