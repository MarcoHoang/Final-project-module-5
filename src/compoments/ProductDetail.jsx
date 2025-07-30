import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProductById } from "../services/productService";
import { getCategoryById } from "../services/categoryService";
import formatDate from "../src/services/formatDate";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [categoryName, setCategoryName] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const productData = await getProductById(id);
        if (!productData) {
          alert("Sản phẩm không tồn tại!");
          navigate("/");
          return;
        }
        setProduct(productData);

        const category = await getCategoryById(productData.categoryId);
        setCategoryName(category?.name || "Không rõ");
      } catch (error) {
        console.error("Lỗi khi lấy chi tiết sản phẩm:", error);
      }
    }

    fetchData();
  }, [id]);

  if (!product) {
    return <p>Đang tải sản phẩm...</p>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2>Chi tiết sản phẩm</h2>
      <p><strong>Tên sản phẩm:</strong> {product.name}</p>
      <p><strong>Loại sản phẩm:</strong> {categoryName}</p>
      <p><strong>Giá:</strong> {product.price.toLocaleString()} VND</p>
      <p><strong>Ngày tạo:</strong> {formatDate(product.createdAt)}</p>
      <p><strong>Mô tả:</strong> {product.description || "Không có"}</p>
      <button onClick={() => navigate("/")}>Quay lại danh sách</button>
    </div>
  );
}
