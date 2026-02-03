import axios from "axios";
const API = "http://localhost:20032/api/brands";

export const getBrands = async () => {
  const res = await axios.get(API);
  return res.data.data;
};
