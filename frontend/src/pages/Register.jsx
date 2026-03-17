import React, { useEffect, useState } from "react";
import { FaUser } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { register, reset } from "../features/Auth/authSlice";
import Spinner from "./Spinner";

function Register() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isError, isLoading, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  const [formdata, setformdata] = useState({
    name: "",
    email: "",
    password: "",
    password2: "",
  });

  const { name, email, password, password2 } = formdata;

  const onchange = (e) => {
    setformdata((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const onsubmit = (e) => {
    e.preventDefault();
    if (password !== password2) {
      toast.error("Passwords don't match");
    } else {
      dispatch(register({ name, email, password }));
    }
  };

  useEffect(() => {
    if (isError) toast.error(message);
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
            <FaUser size={22} className="text-indigo-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Create an account</h1>
          {/* <p className="text-gray-500 text-sm mt-1">Join us today, it&apos;s free</p> */}
        </div>

        {/* Form */}
        <form onSubmit={onsubmit} className="space-y-4 text-left">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Full name
            </label>
            <input
              type="text"
              name="name"
              value={name}
              placeholder="Your full name"
              onChange={onchange}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Email address
            </label>
            <input
              type="email"
              name="email"
              value={email}
              placeholder="you@example.com"
              onChange={onchange}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={password}
              placeholder="••••••••"
              onChange={onchange}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Confirm password
            </label>
            <input
              type="password"
              name="password2"
              value={password2}
              placeholder="••••••••"
              onChange={onchange}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
            />
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
          <Link
            to="/Login"
            className="text-indigo-600 hover:text-indigo-800 font-semibold"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
