import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import ProductForm from "../compoments/ProductForm";
import { createProduct } from "../services/productService";

export default function CreateProduct() {
  const navigate = useNavigate();

  const handleSubmit = async (newProduct) => {
    try {
      await createProduct(newProduct);
      toast.success("Thêm sản phẩm thành công!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      navigate("/");
    } catch (error) {
      console.error("Lỗi khi thêm sản phẩm:", error);
      toast.error("Thêm sản phẩm thất bại. Vui lòng thử lại!", {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  const handleCancel = () => {
    navigate("/");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Thêm sản phẩm mới</h2>
      <ProductForm onSubmit={handleSubmit} onCancel={handleCancel} />
    </div>
  );
} 