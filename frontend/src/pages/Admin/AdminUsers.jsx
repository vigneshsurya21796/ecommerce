import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers, toggleUserRole } from "../../features/Admin/adminSlice";
import { toast } from "react-toastify";
import { FaShieldAlt, FaUser } from "react-icons/fa";

function AdminUsers() {
  const dispatch = useDispatch();
  const { users, isLoading } = useSelector((s) => s.admin);

  useEffect(() => { dispatch(fetchUsers()); }, [dispatch]);

  const handleToggleRole = async (id, currentIsAdmin, name) => {
    const action = currentIsAdmin ? "Remove admin from" : "Make admin";
    if (!window.confirm(`${action} "${name}"?`)) return;
    await dispatch(toggleUserRole(id));
    toast.success(`Role updated for ${name}`);
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Users <span className="text-base font-normal text-gray-400 ml-1">({users.length})</span>
      </h1>

      {isLoading && users.length === 0 ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600" />
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                <tr>
                  {["Avatar", "Name", "Email", "Role", "Joined", "Actions"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left font-semibold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm">
                        {u.name?.charAt(0).toUpperCase() || "?"}
                      </div>
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-800">{u.name}</td>
                    <td className="px-4 py-3 text-gray-500">{u.email}</td>
                    <td className="px-4 py-3">
                      {u.isAdmin ? (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-100 text-indigo-700">
                          <FaShieldAlt size={10} /> Admin
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-gray-100 text-gray-600">
                          <FaUser size={10} /> User
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-xs">
                      {new Date(u.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleToggleRole(u._id, u.isAdmin, u.name)}
                        className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${
                          u.isAdmin
                            ? "bg-red-50 text-red-600 hover:bg-red-100"
                            : "bg-indigo-50 text-indigo-600 hover:bg-indigo-100"
                        }`}
                      >
                        {u.isAdmin ? "Remove Admin" : "Make Admin"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {users.length === 0 && !isLoading && (
              <p className="text-center py-16 text-gray-400">No users found.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminUsers;
