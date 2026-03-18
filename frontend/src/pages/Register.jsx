import React, { useEffect, useState } from "react";
import { FaUser, FaEye, FaEyeSlash, FaCheck, FaTimes } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { register, reset } from "../features/Auth/authSlice";
import Spinner from "./Spinner";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const passwordRules = [
  { label: "At least 8 characters", test: (p) => p.length >= 8 },
  { label: "One uppercase letter", test: (p) => /[A-Z]/.test(p) },
  { label: "One lowercase letter", test: (p) => /[a-z]/.test(p) },
  { label: "One number", test: (p) => /[0-9]/.test(p) },
  { label: "One special character (!@#$...)", test: (p) => /[^A-Za-z0-9]/.test(p) },
];

function getStrength(password) {
  const passed = passwordRules.filter((r) => r.test(password)).length;
  if (passed <= 1) return { label: "Weak", color: "bg-red-500", width: "w-1/5" };
  if (passed <= 2) return { label: "Fair", color: "bg-orange-400", width: "w-2/5" };
  if (passed <= 3) return { label: "Good", color: "bg-yellow-400", width: "w-3/5" };
  if (passed === 4) return { label: "Strong", color: "bg-blue-500", width: "w-4/5" };
  return { label: "Very Strong", color: "bg-green-500", width: "w-full" };
}

function Register() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isError, isLoading, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  const [formdata, setformdata] = useState({ name: "", email: "", password: "", password2: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [touched, setTouched] = useState({});
  const { name, email, password, password2 } = formdata;

  const onchange = (e) => {
    setformdata((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const onBlur = (e) => {
    setTouched((prev) => ({ ...prev, [e.target.name]: true }));
  };

  const emailError = touched.email && email && !EMAIL_REGEX.test(email);
  const passwordMismatch = touched.password2 && password2 && password !== password2;
  const allRulesPassed = passwordRules.every((r) => r.test(password));
  const strength = password ? getStrength(password) : null;

  const onsubmit = (e) => {
    e.preventDefault();
    if (!EMAIL_REGEX.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }
    if (!allRulesPassed) {
      toast.error("Password does not meet all requirements");
      return;
    }
    if (password !== password2) {
      toast.error("Passwords don't match");
      return;
    }
    dispatch(register({ name, email, password }));
  };

  useEffect(() => {
    if (isError) toast.error(message);
    if (isSuccess && user) navigate("/");
    dispatch(reset());
  }, [user, isError, isSuccess, message, navigate, dispatch]);

  if (isLoading) return <Spinner />;

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-8">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 w-full max-w-md p-8">

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-indigo-50 rounded-2xl mb-4">
            <FaUser size={22} className="text-indigo-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Create an account</h1>
        </div>

        <form onSubmit={onsubmit} className="space-y-4 text-left">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Full name</label>
            <input
              type="text"
              name="name"
              value={name}
              placeholder="Your full name"
              onChange={onchange}
              onBlur={onBlur}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Email address</label>
            <input
              type="text"
              name="email"
              value={email}
              placeholder="you@example.com"
              onChange={onchange}
              onBlur={onBlur}
              className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 transition ${
                emailError
                  ? "border-red-400 focus:ring-red-400"
                  : "border-gray-200 focus:ring-indigo-500"
              }`}
            />
            {emailError && (
              <p className="text-red-500 text-xs mt-1">Please enter a valid email address</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={password}
                placeholder="••••••••"
                onChange={onchange}
                onBlur={onBlur}
                className="w-full px-4 py-2.5 pr-10 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <FaEyeSlash size={15} /> : <FaEye size={15} />}
              </button>
            </div>

            {/* Strength bar */}
            {password && strength && (
              <div className="mt-2">
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all duration-300 ${strength.color} ${strength.width}`} />
                </div>
                <p className={`text-xs mt-1 font-medium ${strength.color.replace("bg-", "text-")}`}>
                  {strength.label}
                </p>
              </div>
            )}

            {/* Rules checklist */}
            {touched.password && password && (
              <ul className="mt-2 space-y-1">
                {passwordRules.map((rule) => {
                  const passed = rule.test(password);
                  return (
                    <li key={rule.label} className={`flex items-center gap-1.5 text-xs ${passed ? "text-green-600" : "text-gray-400"}`}>
                      {passed ? <FaCheck size={10} /> : <FaTimes size={10} />}
                      {rule.label}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm password</label>
            <div className="relative">
              <input
                type={showPassword2 ? "text" : "password"}
                name="password2"
                value={password2}
                placeholder="••••••••"
                onChange={onchange}
                onBlur={onBlur}
                className={`w-full px-4 py-2.5 pr-10 border rounded-lg text-sm focus:outline-none focus:ring-2 transition ${
                  passwordMismatch
                    ? "border-red-400 focus:ring-red-400"
                    : "border-gray-200 focus:ring-indigo-500"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword2(!showPassword2)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword2 ? <FaEyeSlash size={15} /> : <FaEye size={15} />}
              </button>
            </div>
            {passwordMismatch && (
              <p className="text-red-500 text-xs mt-1">Passwords do not match</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white py-2.5 rounded-lg font-semibold text-sm transition-colors mt-2 shadow-sm"
          >
            Create Account
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{" "}
          <Link to="/Login" className="text-indigo-600 hover:text-indigo-800 font-semibold">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
