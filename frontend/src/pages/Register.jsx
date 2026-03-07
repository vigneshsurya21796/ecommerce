import React, { useEffect, useState } from "react";
import { FaUser } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { register, reset } from "../features/Auth/authSlice";

import Spinner from "./Spinner";

function Register() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isError, isLoading, isSuccess, message } = useSelector(
    (state) => state.auth,
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
      navigate("/");
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
    return <Spinner />;
  }
  return (
    <>
      <section className="header">
        <h1 className="flex flex-row gap-3 justify-center items-center">
          <FaUser />
          Register
        </h1>
        <p>Please create an account</p>
      </section>
      <section className="form py-3">
        <form onSubmit={onsubmit}>
          <div className="form-group">
            <input
              type="text"
              name="name"
              value={name}
              placeholder="Please enter your name"
              // id="name"
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
              // id="email"
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
              // id="password"
              className="form-control"
              onChange={onchange}
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              name="password2"
              value={password2}
              placeholder="Please confirm your password"
              // id="password2"
              className="form-control"
              onChange={onchange}
            />
          </div>
          <div>
            <button
              type="submit"
              className=" px-5 py-1 bg-purple-500 text-white rounded-md hover:bg-purple-700 duration-75 transition"
            >
              Submit
            </button>
          </div>
        </form>
      </section>
    </>
  );
}

export default Register;
