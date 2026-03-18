import axios from "axios";

const API = "/users";

// Axios instance used for all authenticated requests
export const axiosAuth = axios.create();

// Intercept 401 responses and attempt token refresh
axiosAuth.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        const res = await axios.post(`${API}/refresh`, {}, { withCredentials: true });
        const { token } = res.data;
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (storedUser) {
          storedUser.token = token;
          localStorage.setItem("user", JSON.stringify(storedUser));
        }
        original.headers["Authorization"] = `Bearer ${token}`;
        return axiosAuth(original);
      } catch {
        localStorage.removeItem("user");
        window.location.href = "/Login";
      }
    }
    return Promise.reject(error);
  }
);

const register = async (userdata) => {
  const response = await axios.post(API, userdata, { withCredentials: true });
  if (response.data) {
    localStorage.setItem("user", JSON.stringify(response.data));
  }
  return response.data;
};

const login = async (userdata) => {
  const response = await axios.post(`${API}/login`, userdata, { withCredentials: true });
  if (response.data) {
    localStorage.setItem("user", JSON.stringify(response.data));
  }
  return response.data;
};

const logout = async () => {
  await axios.post(`${API}/logout`, {}, { withCredentials: true });
  localStorage.removeItem("user");
};

const authService = { register, login, logout };
export default authService;
