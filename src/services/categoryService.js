import axios from "axios";

const CATEGORY_API = "http://localhost:3001/categories";

/**
 * Lấy toàn bộ loại sản phẩm
 */
export const getAllCategories = () => {
  return axios.get(CATEGORY_API);
};
