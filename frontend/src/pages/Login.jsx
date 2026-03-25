import React, { useState, useEffect } from "react";
import { FaSignInAlt, FaEye, FaEyeSlash } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { reset, login } from "../features/Auth/authSlice";
import Spinner from "./Spinner";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isError, isLoading, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  const [formdata, setformdata] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState({});
  const { email, password } = formdata;

  const onchange = (e) => {
    setformdata((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const onBlur = (e) => setTouched((prev) => ({ ...prev, [e.target.name]: true }));

  const emailError = touched.email && email && !EMAIL_REGEX.test(email);

  const onsubmit = (e) => {
    e.preventDefault();
    if (!EMAIL_REGEX.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }
    if (!password) {
      toast.error("Please enter your password");
      return;
    }
    dispatch(login({ email, password }));
  };

  useEffect(() => {
    if (isError) toast.error(message || "Login failed");
    if (isSuccess && user) navigate("/");
    dispatch(reset());
  }, [user, isError, isSuccess, message, navigate, dispatch]);

  if (isLoading) return <Spinner />;

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 w-full max-w-md p-8">

        {/* Icon + Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-indigo-50 rounded-2xl mb-4">
            <FaSignInAlt size={22} className="text-indigo-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
          <p className="text-gray-500 text-sm mt-1">Sign in to your account</p>
        </div>

        {/* Form */}
        <form onSubmit={onsubmit} className="space-y-4 text-left">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Email address
            </label>
            <input
              type="text"
              name="email"
              value={email}
              placeholder="you@example.com"
              onChange={onchange}
              onBlur={onBlur}
              className={`w-full px-4 py-2.5 border rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 transition ${
                emailError ? "border-red-400 focus:ring-red-400" : "border-gray-200 focus:ring-indigo-500"
              }`}
            />
            {emailError && (
              <p className="text-red-500 text-xs mt-1">Please enter a valid email address</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={password}
                placeholder="••••••••"
                onChange={onchange}
                onBlur={onBlur}
                className="w-full px-4 py-2.5 pr-10 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <FaEyeSlash size={15} /> : <FaEye size={15} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white py-2.5 rounded-lg font-semibold text-sm transition-colors mt-2 shadow-sm"
          >
            Sign In
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Don&apos;t have an account?{" "}
          <Link
            to="/register"
            className="text-indigo-600 hover:text-indigo-800 font-semibold"
          >
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
