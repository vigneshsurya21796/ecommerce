import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import {
  incrementQuantity,
  decrementQuantity,
  removeFromCart,
} from "../../features/Cart/Cartslice";
import "./Addtocart.css";

const Addtocart = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);
  const totalPrice = useSelector((state) => state.cart.totalPrice);
  // console.log(cartItems);
  const shippingfee = 50;
  return (
    <div>
      <div className="cart-container">
        <h2>Your Shopping Cart</h2>
        {cartItems.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <div className="cart__items-border">
            {cartItems.map((item) => (
              <div key={item.id} className="cart-item">
                <img
                  src={item.image}
                  alt={item.name}
                  className="cart-item-image"
                />
                <div className="cart-item-details">
                  <div>
                    <h3>{item.name}</h3>
                    <p>Price: ₹{item.price}</p>
                  </div>

                  <div className="cart-item-quantity">
                    <button
                      onClick={() => dispatch(decrementQuantity(item.id))}
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() => dispatch(incrementQuantity(item.id))}
                    >
                      +
                    </button>
                  </div>
                  <button
                    className="remove-btn"
                    onClick={() => dispatch(removeFromCart(item.id))}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
            <div>
              <h3>Total Price: ₹{totalPrice.toFixed(2)}</h3>
            </div>
          </div>
        )}
      </div>
      {cartItems.length >= 1 && (
        <div className="cart__container">
          <div className="cart__checkout">
            <div className="cart__heading">
              <div>CART TOTALS:</div>
              <span></span>
            </div>

            <div className="text-green-500">subtotal:{totalPrice}</div>
            <div>Shipping fee: {shippingfee}</div>
            <div>Total: {totalPrice + shippingfee}</div>
            <div>
              <button className="bg-green-500">
                <Link to="/payment"> Proceed to checkout</Link>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Addtocart;
