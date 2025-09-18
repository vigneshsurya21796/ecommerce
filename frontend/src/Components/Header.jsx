import React from "react";
import { FaSignInAlt, FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../features/Auth/authSlice";
import { TiShoppingCart } from "react-icons/ti";

function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const totalQuantity = useSelector((state) => state.cart.totalQuantity); // Get cart quantity

  const Logout = () => {
    localStorage.removeItem("user");
    dispatch(logout());
    navigate("/Login");
  };

  return (
    <header className="header">
      <div className="logo">
        <Link to="/">buycart</Link>
      </div>
      <ul>
        <li className="cart__icons" style={{ position: "relative" }}>
          <Link to="/Addtocart">
            <TiShoppingCart size={25} />
          </Link>
          {totalQuantity > 0 && (
            <div
            >
              {totalQuantity}
            </div>
          )}
        </li>
        <li>
          <FaUser />
          <Link to="/Register">Register</Link>
        </li>
        {user ? (
          <li>
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
