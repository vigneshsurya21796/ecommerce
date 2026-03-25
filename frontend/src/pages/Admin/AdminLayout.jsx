import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import {
  FaChartBar, FaShoppingBag, FaUsers, FaBox, FaHome,
} from "react-icons/fa";

const navItems = [
  { to: "/admin",          label: "Dashboard", icon: FaChartBar,   end: true },
  { to: "/admin/orders",   label: "Orders",    icon: FaShoppingBag          },
  { to: "/admin/products", label: "Products",  icon: FaBox                  },
  { to: "/admin/users",    label: "Users",     icon: FaUsers                },
];

function AdminLayout() {
  const { user } = useSelector((s) => s.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) { navigate("/login"); return; }
    if (!user.isAdmin) { navigate("/"); }
  }, [user, navigate]);

  if (!user?.isAdmin) return null;

  return (
    <div className="flex min-h-screen bg-slate-100">

      {/* Sidebar */}
      <aside className="w-56 bg-gray-900 text-white flex flex-col flex-shrink-0">
        <div className="px-5 py-5 border-b border-gray-700">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-0.5">Admin</p>
          <p className="text-lg font-bold text-white">buycart</p>
        </div>

        <nav className="flex-1 py-4 space-y-1 px-2">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-indigo-600 text-white"
                    : "text-gray-400 hover:bg-gray-800 hover:text-white"
                }`
              }
            >
              <Icon size={15} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="px-2 pb-4">
          <NavLink
            to="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
          >
            <FaHome size={14} />
            Back to Store
          </NavLink>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;
