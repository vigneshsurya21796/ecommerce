import axios from "axios";

const API_URL = "/orders";
const PAYMENT_URL = "/payment";

const getAuthHeader = (token) => ({
  headers: { Authorization: `Bearer ${token}` },
});

const createOrder = async (orderData, token) => {
  const res = await axios.post(API_URL, orderData, getAuthHeader(token));
  return res.data;
};

const getMyOrders = async (token) => {
  const res = await axios.get(API_URL, getAuthHeader(token));
  return res.data;
};

const getOrderById = async (id, token) => {
  const res = await axios.get(`${API_URL}/${id}`, getAuthHeader(token));
  return res.data;
};

const createPaymentIntent = async (amount, token) => {
  const res = await axios.post(
    `${PAYMENT_URL}/create-intent`,
    { amount },
    getAuthHeader(token)
  );
  return res.data;
};

const orderService = { createOrder, getMyOrders, getOrderById, createPaymentIntent };
export default orderService;
