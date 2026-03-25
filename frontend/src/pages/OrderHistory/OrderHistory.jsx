import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getMyOrders } from "../../features/Orders/orderSlice";
import { toast } from "react-toastify";

const statusColors = {
  processing: "bg-yellow-100 text-yellow-700",
  shipped: "bg-blue-100 text-blue-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

const paymentColors = {
  pending: "bg-gray-100 text-gray-600",
  paid: "bg-green-100 text-green-700",
  failed: "bg-red-100 text-red-700",
};

function OrderHistory() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { orders, isLoading, isError, message } = useSelector((state) => state.orders);

  useEffect(() => {
    if (!user) {
      toast.error("Please login to view orders");
      navigate("/login");
      return;
    }
    dispatch(getMyOrders());
  }, [user, dispatch, navigate]);

  useEffect(() => {
    if (isError) toast.error(message);
  }, [isError, message]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">My Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-500 text-lg">You haven't placed any orders yet.</p>
          <button
            onClick={() => navigate("/")}
            className="mt-4 bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Shop Now
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order._id} className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
              {/* Order Header */}
              <div className="bg-gray-50 px-5 py-3 flex flex-wrap items-center justify-between gap-2 border-b border-gray-200">
                <div className="text-sm text-gray-500">
                  <span className="font-medium text-gray-800">Order ID:</span> {order._id.slice(-8).toUpperCase()}
                </div>
                <div className="text-sm text-gray-500">
                  {new Date(order.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </div>
                <div className="flex gap-2">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColors[order.orderStatus] || "bg-gray-100 text-gray-600"}`}>
                    {order.orderStatus}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${paymentColors[order.paymentStatus] || "bg-gray-100 text-gray-600"}`}>
                    {order.paymentStatus}
                  </span>
                </div>
              </div>

              {/* Order Items */}
              <div className="px-5 py-4 space-y-3">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-4">
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-14 h-14 object-contain rounded border border-gray-100"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">{item.title}</p>
                      <p className="text-xs text-gray-500">Qty: {item.quantity} × ₹{item.price.toFixed(2)}</p>
                    </div>
                    <p className="text-sm font-semibold text-gray-700">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Order Footer */}
              <div className="bg-gray-50 px-5 py-3 border-t border-gray-200 flex flex-wrap items-center justify-between gap-2">
                <div className="text-sm text-gray-500">
                  <span className="font-medium">Ship to:</span> {order.shippingAddress.city}, {order.shippingAddress.country}
                </div>
                <div className="text-sm font-bold text-gray-800">
                  Total: ₹{order.totalPrice.toFixed(2)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default OrderHistory;
