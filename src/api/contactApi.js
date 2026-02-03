import axios from "axios";
const API_URL = "http://localhost:20032/api/contact";

export const sendContactMessage = async (data) => {
  try {
    const res = await axios.post(API_URL, data);
    return res.data;
  } catch (error) {
    console.error("❌ Lỗi gửi liên hệ:", error);
    return { success: false, message: "Không thể gửi liên hệ" };
  }
};