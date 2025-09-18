import axios from "axios";

const API = "https://fakestoreapi.com/products";

const productsfunct = async () => {
  const response = await axios.get(API);

  // console.log(response.data);

  // console.log(response.data.products);
  return response.data;
};
const productsservice = { productsfunct };

export default productsservice;
