import React from "react";
import { useState, useEffect } from "react";
import { FaUser, FaSignInAlt } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";

import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { reset, login } from "../features/Auth/authSlice";
import Spinner from "./Spinner";
function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isError, isLoading, isSuccess, message } = useSelector(
    (state) => state.auth
  );
  const [formdata, setformdata] = useState({
    email: "",
    password: "",
  });

  const { email, password } = formdata;
  const onchange = (e) => {
    setformdata((prevstate) => ({
      ...prevstate,
      [e.target.name]: e.target.value,
    }));
  };
  const onsubmit = (e) => {
    e.preventDefault();
    const userdata = {
      email,
      password,
    };
    dispatch(login(userdata));
  };
  useEffect(() => {
    if (isError) {
      toast.error("invalid credentials");
    }
    console.log(isSuccess);
    console.log(user);
    console.log(isError);
    console.log(message);
    if (isSuccess && user) {
      navigate("/dashboard");
    }
    dispatch(reset());
  }, [user, isError, isSuccess, message, navigate, dispatch]);
  if (isLoading) {
    <Spinner />;
  }
  return (
    <>
      <section className="header">
        <h1>
          <FaSignInAlt />
          Login
        </h1>
        <p>Please Login and set goals</p>
      </section>
      <section className="form">
        <form onSubmit={onsubmit}>
          <div className="form-group">
            <input
              type="email"
              name="email"
              value={email}
              placeholder="Please enter your email"
              id="email"
              className="form-control"
              onChange={onchange}
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              name="password"
              value={password}
              placeholder="Please enter your password"
              id="password"
              className="form-control"
              onChange={onchange}
            />
          </div>

          <div>
            <button type="submit" className="btn btn-block">
              Submit
            </button>
          </div>
        </form>
      </section>
    </>
  );
}

export default Login;
