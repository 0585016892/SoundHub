import axios from "axios";

const API_URL = "http://localhost:5000/api";

export const getAllProducts = async () => {
  const res = await axios.get(`${API_URL}/products`);
  console.log(res);
  
  return res.data.data;
};

export const getProductDetail = async (slug) => {
  const res = await axios.get(`${API_URL}/products/v1/productdetail/${slug}`);
  console.log(res);
  
  return res.data;
};
export const getProducts = async (filters = {}) => {
  const params = {};

  if (filters.category) params.category = filters.category;
  if (filters.brand) params.brand = filters.brand;
  if (filters.minPrice) params.minPrice = filters.minPrice;
  if (filters.maxPrice) params.maxPrice = filters.maxPrice;
  if (filters.sort) params.sort = filters.sort;
  if (filters.page) params.page = filters.page;

  const res = await axios.get(`${API_URL}/products/a/filter`, {
    params,
  });

  return res.data;
};

export const searchProducts = async ({ keyword, page = 1, limit = 12 }) => {
  try {
    const res = await axios.get(`${API_URL}/products/v1/search`, {
      params: { 
        search: keyword || "", 
        page: Number(page),
        limit: Number(limit),
      },
    });

    return {
      success: res.data.success ?? true,
      products: res.data.products || [],
      total: res.data.total || 0,
      totalPages: res.data.totalPages || 1,
      currentPage: res.data.currentPage || page,
    };
  } catch (error) {
    console.error("Search API error:", error);
    return { 
      success: false,
      products: [],
      total: 0,
      totalPages: 1,
      currentPage: 1
    };
  }
};
// Lấy sản phẩm hot
export const getHotProducts = async (limit = 10) => {
  try {
    const res = await axios.get(`${API_URL}/products/v1/hot?limit=${limit}`);
    return res.data.data; // mảng sản phẩm
  } catch (error) {
    console.error("❌ Lỗi lấy sản phẩm hot:", error);
    return [];
  }
};

// Lấy sản phẩm nổi bật
export const getFeaturedProducts = async (limit = 10) => {
  try {
    const res = await axios.get(`${API_URL}/products/v1/featured?limit=${limit}`);
    return res.data.data; // mảng sản phẩm
  } catch (error) {
    console.error("❌ Lỗi lấy sản phẩm nổi bật:", error);
    return [];
  }
};