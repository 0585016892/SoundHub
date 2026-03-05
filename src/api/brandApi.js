import axios from "axios";
const API = `${process.env.REACT_APP_API_URL}/brands`;

export const getBrands = async () => {
  const res = await axios.get(API);
  return res.data.data;
};
