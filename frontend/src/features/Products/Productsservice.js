import axios from "axios";

const API = "https://fakestoreapi.com/products";

const productsfunct = async () => {
  const response = await axios.get(API);
  return response.data;
};

const productsservice = { productsfunct };
export default productsservice;
