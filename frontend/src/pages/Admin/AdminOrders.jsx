import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrders, updateOrderStatus } from "../../features/Admin/adminSlice";
import { toast } from "react-toastify";

const ORDER_STATUSES  = ["processing", "shipped", "delivered", "cancelled"];
const PAYMENT_STATUSES = ["pending", "paid", "failed"];

const orderBadge = {
  processing: "bg-yellow-100 text-yellow-700",
  shipped:    "bg-blue-100 text-blue-700",
  delivered:  "bg-green-100 text-green-700",
  cancelled:  "bg-red-100 text-red-700",
};
const payBadge = {
  paid:    "bg-green-100 text-green-700",
  pending: "bg-yellow-100 text-yellow-700",
  failed:  "bg-red-100 text-red-700",
};

function AdminOrders() {
  const dispatch = useDispatch();
  const { orders, isLoading } = useSelector((s) => s.admin);

  useEffect(() => { dispatch(fetchOrders()); }, [dispatch]);

  const handleStatus = async (id, field, value) => {
    await dispatch(updateOrderStatus({ id, data: { [field]: value } }));
    toast.success("Order updated");
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Orders <span className="text-base font-normal text-gray-400 ml-1">({orders.length})</span>
      </h1>

      {isLoading && orders.length === 0 ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600" />
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                <tr>
                  {["Order ID", "Customer", "Items", "Total", "Payment", "Order Status", "Date"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left font-semibold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {orders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-gray-400">
                      #{order._id.slice(-8).toUpperCase()}
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-800">{order.user?.name || "—"}</p>
                      <p className="text-xs text-gray-400">{order.user?.email}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{order.items.length} item{order.items.length !== 1 ? "s" : ""}</td>
                    <td className="px-4 py-3 font-semibold text-gray-800">₹{order.totalPrice.toFixed(2)}</td>

                    {/* Payment status */}
                    <td className="px-4 py-3">
                      <select
                        value={order.paymentStatus}
                        onChange={(e) => handleStatus(order._id, "paymentStatus", e.target.value)}
                        className={`text-xs font-semibold px-2 py-1 rounded-full border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-400 ${payBadge[order.paymentStatus]}`}
                      >
                        {PAYMENT_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>

                    {/* Order status */}
                    <td className="px-4 py-3">
                      <select
                        value={order.orderStatus}
                        onChange={(e) => handleStatus(order._id, "orderStatus", e.target.value)}
                        className={`text-xs font-semibold px-2 py-1 rounded-full border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-400 ${orderBadge[order.orderStatus]}`}
                      >
                        {ORDER_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>

                    <td className="px-4 py-3 text-gray-400 text-xs">
                      {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {orders.length === 0 && (
              <p className="text-center py-16 text-gray-400">No orders yet.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminOrders;
