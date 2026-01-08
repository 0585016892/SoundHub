import axios from "axios";
const API = "http://localhost:5000/api/brands";

export const getBrands = async () => {
  const res = await axios.get(API);
  return res.data.data;
};
