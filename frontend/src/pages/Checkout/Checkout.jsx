import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { toast } from "react-toastify";
import { createPaymentIntent, createOrder, resetOrderState } from "../../features/Orders/orderSlice";
import { clearCart } from "../../features/Cart/cartSlice";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || "pk_test_YOUR_STRIPE_PUBLISHABLE_KEY_HERE");

const SHIPPING_FEE = 50;

function CheckoutForm({ totalAmount }) {
  const stripe = useStripe();
  const elements = useElements();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { clientSecret, isLoading, isSuccess, currentOrder } = useSelector((state) => state.orders);
  const cartItems = useSelector((state) => state.cart.items);
  const totalPrice = useSelector((state) => state.cart.totalPrice);

  const [address, setAddress] = useState({
    fullName: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
  });
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (totalAmount > 0) {
      dispatch(createPaymentIntent(totalAmount));
    }
  }, [dispatch, totalAmount]);

  useEffect(() => {
    if (isSuccess && currentOrder) {
      toast.success("Order placed successfully!");
      dispatch(clearCart());
      dispatch(resetOrderState());
      navigate(`/orders`);
    }
  }, [isSuccess, currentOrder, dispatch, navigate]);

  const handleChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { fullName, address: addr, city, postalCode, country } = address;
    if (!fullName || !addr || !city || !postalCode || !country) {
      toast.error("Please fill in all shipping details");
      return;
    }

    if (!stripe || !elements || !clientSecret) {
      toast.error("Payment not ready. Please wait.");
      return;
    }

    setProcessing(true);

    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
        billing_details: { name: fullName },
      },
    });

    if (error) {
      toast.error(error.message);
      setProcessing(false);
      return;
    }

    if (paymentIntent.status === "succeeded") {
      const orderItems = cartItems.map((item) => ({
        productId: item.id,
        title: item.name || item.title,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
      }));

      dispatch(
        createOrder({
          items: orderItems,
          totalPrice: totalAmount,
          shippingAddress: address,
          paymentIntentId: paymentIntent.id,
        })
      );
    }

    setProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Shipping Address */}
      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Shipping Address</h2>
        <div className="grid grid-cols-1 gap-4">
          {[
            { name: "fullName", label: "Full Name", placeholder: "John Doe" },
            { name: "address", label: "Street Address", placeholder: "123 Main St" },
            { name: "city", label: "City", placeholder: "Mumbai" },
            { name: "postalCode", label: "Postal Code", placeholder: "400001" },
            { name: "country", label: "Country", placeholder: "India" },
          ].map((field) => (
            <div key={field.name}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {field.label}
              </label>
              <input
                type="text"
                name={field.name}
                value={address[field.name]}
                onChange={handleChange}
                placeholder={field.placeholder}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Card Payment */}
      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Payment Details</h2>
        <div className="border border-gray-300 rounded-lg px-3 py-3">
          <CardElement
            options={{
              style: {
                base: { fontSize: "16px", color: "#374151", "::placeholder": { color: "#9ca3af" } },
                invalid: { color: "#ef4444" },
              },
            }}
          />
        </div>
        <p className="text-xs text-gray-400 mt-2">Test card: 4242 4242 4242 4242 | Any future date | Any CVC</p>
      </div>

      {/* Order Summary */}
      <div className="bg-gray-50 rounded-lg p-4 text-sm space-y-2">
        <div className="flex justify-between text-gray-600">
          <span>Subtotal</span>
          <span>₹{totalPrice.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>Shipping</span>
          <span>₹{SHIPPING_FEE}</span>
        </div>
        <div className="flex justify-between font-semibold text-gray-800 border-t pt-2">
          <span>Total</span>
          <span>₹{totalAmount.toFixed(2)}</span>
        </div>
      </div>

      <button
        type="submit"
        disabled={!stripe || processing || isLoading}
        className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white font-semibold py-3 rounded-lg transition-colors"
      >
        {processing || isLoading ? "Processing..." : `Pay ₹${totalAmount.toFixed(2)}`}
      </button>
    </form>
  );
}

function Checkout() {
  const { user } = useSelector((state) => state.auth);
  const cartItems = useSelector((state) => state.cart.items);
  const totalPrice = useSelector((state) => state.cart.totalPrice);
  const navigate = useNavigate();

  const totalAmount = totalPrice + SHIPPING_FEE;

  useEffect(() => {
    if (!user) {
      toast.error("Please login to checkout");
      navigate("/Login");
    }
    if (cartItems.length === 0) {
      navigate("/");
    }
  }, [user, cartItems, navigate]);

  return (
    <div className="max-w-xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Checkout</h1>
      <Elements stripe={stripePromise}>
        <CheckoutForm totalAmount={totalAmount} />
      </Elements>
    </div>
  );
}

export default Checkout;
