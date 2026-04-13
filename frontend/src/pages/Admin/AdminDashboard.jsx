import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchStats } from "../../features/Admin/adminSlice";
import { FaShoppingBag, FaUsers, FaBox, FaRupeeSign } from "react-icons/fa";

const STATUS_COLORS = {
  processing: "bg-yellow-100 text-yellow-700",
  shipped:    "bg-blue-100 text-blue-700",
  delivered:  "bg-green-100 text-green-700",
  cancelled:  "bg-red-100 text-red-700",
};

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
        <Icon size={20} className="text-white" />
      </div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-2xl font-bold text-gray-800">{value ?? "—"}</p>
      </div>
    </div>
  );
}

function AdminDashboard() {
  const dispatch = useDispatch();
  const { stats, isLoading } = useSelector((s) => s.admin);

  useEffect(() => { dispatch(fetchStats()); }, [dispatch]);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-1">Dashboard</h1>
      <p className="text-sm text-gray-500 mb-8">Welcome back, Admin</p>

      {isLoading && !stats ? (
        <div className="flex items-center justify-center h-40">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-sky-600" />
        </div>
      ) : (
        <>
          {/* Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-10">
            <StatCard icon={FaRupeeSign}  label="Total Revenue"  value={stats ? `₹${stats.totalRevenue.toFixed(2)}` : null} color="bg-sky-500" />
            <StatCard icon={FaShoppingBag} label="Total Orders"  value={stats?.totalOrders}   color="bg-blue-500"   />
            <StatCard icon={FaUsers}       label="Total Users"   value={stats?.totalUsers}    color="bg-sky-400" />
            <StatCard icon={FaBox}         label="Products (DB)" value={stats?.totalProducts} color="bg-emerald-500" />
          </div>

          {/* Order Status Breakdown */}
          {stats?.ordersByStatus?.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 max-w-md">
              <h2 className="text-base font-semibold text-gray-700 mb-4">Orders by Status</h2>
              <div className="space-y-2">
                {stats.ordersByStatus.map(({ _id, count }) => (
                  <div key={_id} className="flex items-center justify-between">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${STATUS_COLORS[_id] || "bg-gray-100 text-gray-600"}`}>
                      {_id}
                    </span>
                    <span className="text-sm font-bold text-gray-700">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default AdminDashboard;
