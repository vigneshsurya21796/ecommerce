import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { updateProfile, reset } from "../../features/Auth/authSlice";
import {
  FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash,
  FaCheck, FaTimes, FaShoppingBag, FaHeart, FaEdit,
} from "react-icons/fa";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRules = [
  { label: "At least 8 characters", test: (p) => p.length >= 8 },
  { label: "One uppercase letter",  test: (p) => /[A-Z]/.test(p) },
  { label: "One lowercase letter",  test: (p) => /[a-z]/.test(p) },
  { label: "One number",            test: (p) => /[0-9]/.test(p) },
  { label: "One special character", test: (p) => /[^A-Za-z0-9]/.test(p) },
];

function getStrength(p) {
  const n = passwordRules.filter((r) => r.test(p)).length;
  if (n <= 1) return { label: "Weak",      color: "bg-red-500",    width: "w-1/5" };
  if (n <= 2) return { label: "Fair",      color: "bg-orange-400", width: "w-2/5" };
  if (n <= 3) return { label: "Good",      color: "bg-yellow-400", width: "w-3/5" };
  if (n === 4) return { label: "Strong",   color: "bg-blue-500",   width: "w-4/5" };
  return              { label: "Very Strong", color: "bg-green-500", width: "w-full" };
}

function Profile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isLoading, isSuccess, isError, message } = useSelector((s) => s.auth);
  const orderCount   = useSelector((s) => s.orders?.orders?.length ?? 0);
  const wishlistCount = useSelector((s) => s.wishlist.items.length);

  // Info form
  const [infoForm, setInfoForm] = useState({ name: user?.name || "", email: user?.email || "" });
  const [infoTouched, setInfoTouched] = useState({});
  const [editingInfo, setEditingInfo] = useState(false);

  // Password form
  const [pwForm, setPwForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [showPw, setShowPw] = useState({ current: false, new: false, confirm: false });
  const [pwTouched, setPwTouched] = useState({});
  const [editingPw, setEditingPw] = useState(false);

  // Track which section was submitted
  const [lastAction, setLastAction] = useState(null);

  useEffect(() => {
    if (!user) { navigate("/login"); return; }
  }, [user, navigate]);

  useEffect(() => {
    if (isSuccess && lastAction === "info") {
      toast.success("Profile updated");
      setEditingInfo(false);
      setLastAction(null);
    }
    if (isSuccess && lastAction === "password") {
      toast.success("Password changed");
      setEditingPw(false);
      setPwForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setPwTouched({});
      setLastAction(null);
    }
    if (isError && message) {
      toast.error(message);
    }
    dispatch(reset());
  }, [isSuccess, isError, message, lastAction, dispatch]);

  const handleInfoSubmit = (e) => {
    e.preventDefault();
    if (!infoForm.name.trim()) return toast.error("Name is required");
    if (!EMAIL_REGEX.test(infoForm.email)) return toast.error("Invalid email address");
    setLastAction("info");
    dispatch(updateProfile({ name: infoForm.name.trim(), email: infoForm.email }));
  };

  const handlePwSubmit = (e) => {
    e.preventDefault();
    if (!pwForm.currentPassword) return toast.error("Enter your current password");
    if (!passwordRules.every((r) => r.test(pwForm.newPassword)))
      return toast.error("New password doesn't meet all requirements");
    if (pwForm.newPassword !== pwForm.confirmPassword)
      return toast.error("Passwords don't match");
    setLastAction("password");
    dispatch(updateProfile({ currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword }));
  };

  const initials = user?.name
    ? user.name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase()
    : null;

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })
    : "Member";

  const strength = pwForm.newPassword ? getStrength(pwForm.newPassword) : null;
  const emailError = infoTouched.email && !EMAIL_REGEX.test(infoForm.email);
  const pwMismatch = pwTouched.confirmPassword && pwForm.confirmPassword && pwForm.newPassword !== pwForm.confirmPassword;

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-3xl mx-auto space-y-6">

        {/* ── Profile Header Card ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex items-center gap-6">
          {/* Avatar */}
          <div className="w-20 h-20 rounded-2xl bg-sky-600 flex items-center justify-center flex-shrink-0">
            {initials
              ? <span className="text-2xl font-bold text-white">{initials}</span>
              : <FaUser size={32} className="text-white opacity-80" />
            }
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold text-gray-900 truncate">{user?.name}</h1>
            <p className="text-sm text-gray-500 truncate">{user?.email}</p>
            <p className="text-xs text-gray-400 mt-1">Member since {memberSince}</p>
          </div>

          {/* Stats */}
          <div className="hidden sm:flex items-center gap-6 flex-shrink-0">
            <div className="text-center">
              <div className="flex items-center justify-center w-10 h-10 bg-sky-50 rounded-xl mb-1 mx-auto">
                <FaShoppingBag size={16} className="text-sky-500" />
              </div>
              <p className="text-lg font-bold text-gray-800">{orderCount}</p>
              <p className="text-xs text-gray-400">Orders</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-10 h-10 bg-red-50 rounded-xl mb-1 mx-auto">
                <FaHeart size={16} className="text-red-400" />
              </div>
              <p className="text-lg font-bold text-gray-800">{wishlistCount}</p>
              <p className="text-xs text-gray-400">Wishlist</p>
            </div>
          </div>
        </div>

        {/* ── Edit Profile Card ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
            <div className="flex items-center gap-2">
              <FaUser size={14} className="text-sky-500" />
              <h2 className="font-semibold text-gray-800">Profile Information</h2>
            </div>
            {!editingInfo && (
              <button
                onClick={() => setEditingInfo(true)}
                className="flex items-center gap-1.5 text-sm text-sky-600 hover:text-sky-800 font-medium transition-colors"
              >
                <FaEdit size={12} />
                Edit
              </button>
            )}
          </div>

          <form onSubmit={handleInfoSubmit} className="p-6 space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
              <input
                type="text"
                value={infoForm.name}
                onChange={(e) => setInfoForm((p) => ({ ...p, name: e.target.value }))}
                onBlur={() => setInfoTouched((p) => ({ ...p, name: true }))}
                disabled={!editingInfo}
                className={`w-full px-4 py-2.5 border rounded-lg text-sm transition focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                  editingInfo ? "bg-white border-gray-200" : "bg-gray-50 border-gray-100 text-gray-500 cursor-not-allowed"
                }`}
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
              <div className="relative">
                <FaEnvelope size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input
                  type="text"
                  value={infoForm.email}
                  onChange={(e) => setInfoForm((p) => ({ ...p, email: e.target.value }))}
                  onBlur={() => setInfoTouched((p) => ({ ...p, email: true }))}
                  disabled={!editingInfo}
                  className={`w-full pl-9 pr-4 py-2.5 border rounded-lg text-sm transition focus:outline-none focus:ring-2 ${
                    emailError
                      ? "border-red-400 focus:ring-red-400"
                      : editingInfo
                      ? "bg-white border-gray-200 focus:ring-sky-500"
                      : "bg-gray-50 border-gray-100 text-gray-500 cursor-not-allowed"
                  }`}
                />
              </div>
              {emailError && <p className="text-red-500 text-xs mt-1">Please enter a valid email address</p>}
            </div>

            {editingInfo && (
              <div className="flex gap-3 pt-1">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-60"
                >
                  {isLoading && lastAction === "info" ? "Saving..." : "Save Changes"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditingInfo(false);
                    setInfoForm({ name: user?.name || "", email: user?.email || "" });
                    setInfoTouched({});
                  }}
                  className="px-5 py-2.5 border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm font-medium rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            )}
          </form>
        </div>

        {/* ── Change Password Card ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
            <div className="flex items-center gap-2">
              <FaLock size={13} className="text-sky-500" />
              <h2 className="font-semibold text-gray-800">Change Password</h2>
            </div>
            {!editingPw && (
              <button
                onClick={() => setEditingPw(true)}
                className="flex items-center gap-1.5 text-sm text-sky-600 hover:text-sky-800 font-medium transition-colors"
              >
                <FaEdit size={12} />
                Change
              </button>
            )}
          </div>

          {!editingPw ? (
            <div className="px-6 py-5">
              <p className="text-sm text-gray-400">••••••••••••</p>
              <p className="text-xs text-gray-400 mt-0.5">Click "Change" to update your password</p>
            </div>
          ) : (
            <form onSubmit={handlePwSubmit} className="p-6 space-y-4">
              {/* Current Password */}
              {[
                { key: "currentPassword", label: "Current Password",  show: "current" },
                { key: "newPassword",     label: "New Password",      show: "new"     },
                { key: "confirmPassword", label: "Confirm New Password", show: "confirm" },
              ].map(({ key, label, show }) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
                  <div className="relative">
                    <input
                      type={showPw[show] ? "text" : "password"}
                      value={pwForm[key]}
                      onChange={(e) => setPwForm((p) => ({ ...p, [key]: e.target.value }))}
                      onBlur={() => setPwTouched((p) => ({ ...p, [key]: true }))}
                      placeholder="••••••••"
                      className={`w-full px-4 py-2.5 pr-10 border rounded-lg text-sm focus:outline-none focus:ring-2 transition ${
                        key === "confirmPassword" && pwMismatch
                          ? "border-red-400 focus:ring-red-400"
                          : "border-gray-200 focus:ring-sky-500"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw((p) => ({ ...p, [show]: !p[show] }))}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPw[show] ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
                    </button>
                  </div>

                  {/* Strength bar for new password */}
                  {key === "newPassword" && pwForm.newPassword && strength && (
                    <div className="mt-2">
                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full transition-all duration-300 ${strength.color} ${strength.width}`} />
                      </div>
                      <p className={`text-xs mt-1 font-medium ${strength.color.replace("bg-", "text-")}`}>{strength.label}</p>
                    </div>
                  )}

                  {/* Rules checklist */}
                  {key === "newPassword" && pwTouched.newPassword && pwForm.newPassword && (
                    <ul className="mt-2 space-y-1">
                      {passwordRules.map((rule) => {
                        const ok = rule.test(pwForm.newPassword);
                        return (
                          <li key={rule.label} className={`flex items-center gap-1.5 text-xs ${ok ? "text-green-600" : "text-gray-400"}`}>
                            {ok ? <FaCheck size={9} /> : <FaTimes size={9} />}
                            {rule.label}
                          </li>
                        );
                      })}
                    </ul>
                  )}

                  {key === "confirmPassword" && pwMismatch && (
                    <p className="text-red-500 text-xs mt-1">Passwords do not match</p>
                  )}
                </div>
              ))}

              <div className="flex gap-3 pt-1">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-60"
                >
                  {isLoading && lastAction === "password" ? "Saving..." : "Update Password"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditingPw(false);
                    setPwForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
                    setPwTouched({});
                  }}
                  className="px-5 py-2.5 border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm font-medium rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>

      </div>
    </div>
  );
}

export default Profile;
