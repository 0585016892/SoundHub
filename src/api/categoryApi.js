import axios from "axios";
const API = `${process.env.REACT_APP_API_URL}/category`;

export const getCategories = async () => {
  const res = await axios.get(API);
  return res.data.data;
};
