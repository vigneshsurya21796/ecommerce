import axios from "axios";

const API = "http://localhost:8000/users";
const register = async (userdata) => {
  const response = await axios.post(API, userdata);
  if (response.data) {
    localStorage.setItem("user", JSON.stringify(response.data));
  }
  console.log(response.data);
  return response.data;
};
const login = async (userdata) => {
  const response = await axios.post(API+"/login", userdata);
  if (response.data) {
    localStorage.setItem("user", JSON.stringify(response.data));
  }
  console.log(response.data);
  return response.data;
};
const authService = { register,login };

export default authService;
