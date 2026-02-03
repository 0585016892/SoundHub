import axios from "axios";

// Base URL backend
const API_URL = "http://localhost:20032/api"; // thay bằng URL backend của bạn

// --- Login ---
export const  loginApi = async ({ email, password }) => {
  try {
    const res = await axios.post(`${API_URL}/auth/customer/login`, { email, password });
    return { success: true, user: res.data.user, token: res.data.token };
  } catch (err) {
    return { success: false, message: err.response?.data?.message || "Lỗi server" };
  }
};

// --- Register ---
export const registerApi = async (data) => {
  try {
    const res = await axios.post(`${API_URL}/auth/customer/register`, data);
    return { success: true, user: res.data.user };
  } catch (err) {
    return { success: false, message: err.response?.data?.message || "Lỗi server" };
  }
};

// --- Get profile ---
export const getProfile = async (token) => {
  try {
    const res = await axios.get(`${API_URL}/auth/customer/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log(res);
    
    return res.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

// --- Update profile ---
export const updateProfile = async (token, data) => {
  try {
    const res = await axios.put(
      `${API_URL}/auth/customer/profile`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Lưu user mới vào localStorage (giống Tiki)
    if (res.data?.user) {
      localStorage.setItem("user", JSON.stringify(res.data.user));
    }

    return {
      success: true,
      message: res.data.message || "Cập nhật thành công",
      user: res.data.user,
    };
  } catch (err) {
    return {
      success: false,
      message: err.response?.data?.message || "Lỗi server",
    };
  }
};


// --- Change password ---
export const changePassword = async (token, data) => {
  try {
    const res = await axios.post(`${API_URL}/customer/change-password`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return { success: true, message: res.data.message };
  } catch (err) {
    return { success: false, message: err.response?.data?.message || "Lỗi server" };
  }
};

// --- Logout ---
export const logoutApi = async () => {
  try {
    // Nếu backend có endpoint logout, gọi ở đây, còn không có thể chỉ xoá token ở frontend
    return { success: true };
  } catch (err) {
    return { success: false, message: "Lỗi server" };
  }
};
export const getUserOrders = async (userId) => {
  try {
    const res = await axios.get(`${API_URL}/customers/orders/user/${userId}`);
    return res; // backend trả về mảng orders
  } catch (error) {
    console.error("Lỗi lấy đơn hàng:", error);
    return [];
  }
};
