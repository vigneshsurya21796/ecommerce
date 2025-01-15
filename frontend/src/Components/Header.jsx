import React from "react";
import { FaSignInAlt, FaSignOutAlt, FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../features/Auth/authSlice";
import { ShoppingCart } from "lucide-react";
function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const Logout = () => {
    localStorage.removeItem("user");
    dispatch(logout());
    navigate("/Login");
  };
  return (
    <header className="header">
      <div className="logo">
        <Link to="/">Ecommercewebsite </Link>
      </div>
      <ul>
        <li>
          <Link to="/Addtocart">
            <ShoppingCart />
          </Link>
        </li>
        <li>
          <FaUser />
          <Link to="/Register">Register</Link>
        </li>

        {user ? (
          <li>
            {/*  <button className="btn" onClick={Logout}>
              <FaSignOutAlt />
              Login
            </button> */}
            <FaSignInAlt />
            <Link to="/Login">Login</Link>
          </li>
        ) : (
          <li>
            <FaSignInAlt />
            <Link to="/Login">Login</Link>
          </li>
        )}
      </ul>
    </header>
  );
}

export default Header;
