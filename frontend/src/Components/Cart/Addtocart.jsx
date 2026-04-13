import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import {
  incrementQuantity,
  decrementQuantity,
  removeFromCart,
  clearCart,
} from "../../features/Cart/cartSlice";
import { FaTrash, FaShoppingBag, FaArrowLeft, FaTag } from "react-icons/fa";
import { MdDeleteSweep } from "react-icons/md";

const SHIPPING_FEE = 50;

const Addtocart = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);
  const totalPrice = useSelector((state) => state.cart.totalPrice);
  const totalQuantity = useSelector((state) => state.cart.totalQuantity);

  /* ── Empty state ── */
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-sky-50 rounded-full mb-6">
            <FaShoppingBag size={40} className="text-sky-300" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
          <p className="text-gray-500 mb-8">Looks like you haven't added anything yet.</p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors shadow-sm"
          >
            <FaArrowLeft size={13} />
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  const grandTotal = totalPrice + SHIPPING_FEE;

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-6xl mx-auto">

        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Shopping Cart</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              {totalQuantity} {totalQuantity === 1 ? "item" : "items"}
            </p>
          </div>
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sky-600 hover:text-sky-800 text-sm font-medium transition-colors"
          >
            <FaArrowLeft size={11} />
            Continue Shopping
          </Link>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">

          {/* ── Left: Cart Items ── */}
          <div className="flex-1 space-y-3">

            {/* Column Headers */}
            <div className="hidden md:grid grid-cols-12 text-xs font-semibold text-gray-400 uppercase tracking-wider px-4 pb-2">
              <span className="col-span-5">Product</span>
              <span className="col-span-2 text-center">Price</span>
              <span className="col-span-3 text-center">Quantity</span>
              <span className="col-span-2 text-right">Subtotal</span>
            </div>

            {cartItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm px-4 py-4 grid grid-cols-12 gap-4 items-center"
              >
                {/* Image + Name */}
                <div className="col-span-12 md:col-span-5 flex items-center gap-4">
                  <Link to={`/product/${item.id}`} className="flex-shrink-0">
                    <div className="w-16 h-16 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-center overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-contain p-1"
                      />
                    </div>
                  </Link>
                  <div className="min-w-0">
                    <Link to={`/product/${item.id}`}>
                      <p className="text-sm font-semibold text-gray-800 line-clamp-2 hover:text-sky-600 transition-colors leading-snug">
                        {item.name}
                      </p>
                    </Link>
                    {/* Mobile price */}
                    <p className="text-xs text-gray-400 mt-0.5 md:hidden">₹{item.price.toFixed(2)} each</p>
                  </div>
                </div>

                {/* Price */}
                <div className="hidden md:flex col-span-2 justify-center">
                  <span className="text-sm text-gray-600 font-medium">₹{item.price.toFixed(2)}</span>
                </div>

                {/* Quantity controls */}
                <div className="col-span-8 md:col-span-3 flex justify-start md:justify-center">
                  <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-2 py-1">
                    <button
                      onClick={() => dispatch(decrementQuantity(item.id))}
                      className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-600 hover:bg-sky-100 hover:text-sky-700 transition-colors font-bold text-base"
                    >
                      −
                    </button>
                    <span className="w-6 text-center text-sm font-bold text-gray-800">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => dispatch(incrementQuantity(item.id))}
                      className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-600 hover:bg-sky-100 hover:text-sky-700 transition-colors font-bold text-base"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Subtotal + Remove */}
                <div className="col-span-4 md:col-span-2 flex items-center justify-end gap-3">
                  <span className="text-sm font-bold text-gray-800">
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </span>
                  <button
                    onClick={() => dispatch(removeFromCart(item.id))}
                    className="text-gray-300 hover:text-red-500 transition-colors p-1"
                    title="Remove item"
                  >
                    <FaTrash size={13} />
                  </button>
                </div>
              </div>
            ))}

            {/* Clear cart */}
            <div className="flex justify-end pt-1">
              <button
                onClick={() => dispatch(clearCart())}
                className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-red-500 transition-colors font-medium"
              >
                <MdDeleteSweep size={17} />
                Clear cart
              </button>
            </div>
          </div>

          {/* ── Right: Order Summary ── */}
          <div className="lg:w-80 xl:w-96 flex-shrink-0">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sticky top-24">
              <h2 className="text-base font-bold text-gray-900 mb-5">Order Summary</h2>

              {/* Line items */}
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({totalQuantity} items)</span>
                  <span className="font-medium text-gray-800">₹{totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="font-medium text-gray-800">₹{SHIPPING_FEE.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-400 text-xs">
                  <span className="flex items-center gap-1">
                    <FaTag size={10} />
                    Have a coupon?
                  </span>
                  <button className="text-sky-500 hover:text-sky-700 font-medium transition-colors">
                    Apply
                  </button>
                </div>
              </div>

              <div className="border-t border-gray-100 my-4" />

              {/* Total */}
              <div className="flex justify-between items-center mb-6">
                <span className="text-base font-bold text-gray-900">Total</span>
                <span className="text-xl font-bold text-sky-600">₹{grandTotal.toFixed(2)}</span>
              </div>

              {/* CTA */}
              <Link
                to="/checkout"
                className="w-full flex items-center justify-center gap-2 bg-sky-600 hover:bg-sky-700 active:bg-sky-800 text-white font-semibold py-3.5 rounded-xl transition-colors shadow-md hover:shadow-lg text-sm"
              >
                Proceed to Checkout
              </Link>

              <p className="text-center text-xs text-gray-400 mt-4">
                Secure checkout · Free returns
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Addtocart;
