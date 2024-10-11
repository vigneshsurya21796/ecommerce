import React from "react";
import { useState, useEffect } from "react";
import { FaUser } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
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
  useEffect(() => {
    if (isError) {
      toast.error(message);
    }
    console.log(isSuccess);
    console.log(user);
    if (isSuccess && user) {
      navigate("/dashboard");
    }
    dispatch(reset());
  }, [user, isError, isSuccess, message, navigate, dispatch]);
  const { name, email, password, password2 } = formdata;
  const onchange = (e) => {
    setformdata((prevstate) => ({
      ...prevstate,
      [e.target.name]: e.target.value,
    }));
  };
  const onsubmit = (e) => {
    e.preventDefault();
    if (password !== password2) {
      toast.error("passoword doesn't match");
    } else {
      const userdata = {
        name,
        email,
        password,
      };
      dispatch(register(userdata));
    }
  };
  if (isLoading) {
    <Spinner />;
  }
  return (
    <>
      <section className="header">
        <h1>
          <FaUser />
          Register
        </h1>
        <p>Please create an account</p>
      </section>
      <section className="form">
        <form onSubmit={onsubmit}>
          <div className="form-group">
            <input
              type="text"
              name="name"
              value={name}
              placeholder="Please enter your name"
              id="name"
              className="form-control"
              onChange={onchange}
            />
          </div>
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
          <div className="form-group">
            <input
              type="password"
              name="password2"
              value={password2}
              placeholder="Please enter your password2"
              id="password2"
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

export default Register;
