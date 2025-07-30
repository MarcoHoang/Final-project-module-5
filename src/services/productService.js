import axios from "axios";

const PRODUCT_API = "http://localhost:3001/products";

/**
 * Lấy tất cả sản phẩm
 */
export const getAllProducts = () => {
  return axios.get(PRODUCT_API);
};

/**
 * Lấy chi tiết 1 sản phẩm theo id
 */
export const getProductById = (id) => {
  return axios.get(`${PRODUCT_API}/${id}`);
};

/**
 * Tạo sản phẩm mới
 */
export const createProduct = (data) => {
  return axios.post(PRODUCT_API, data);
};

/**
 * Cập nhật thông tin sản phẩm
 */
export const updateProduct = (id, data) => {
  return axios.put(`${PRODUCT_API}/${id}`, data);
};
