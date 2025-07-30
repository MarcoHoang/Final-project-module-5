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
    <div style={{ 
      display: "flex", 
      flexDirection: "column", 
      alignItems: "center",
      minHeight: "60vh",
      padding: "20px"
    }}>
      <div style={{
        width: "100%",
        maxWidth: "800px",
        backgroundColor: "white",
        borderRadius: "12px",
        boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
        padding: "40px",
        border: "1px solid #e9ecef"
      }}>
        <h2 style={{ 
          textAlign: "center", 
          marginBottom: "40px",
          color: "#2c3e50",
          fontSize: "2rem",
          fontWeight: "700",
          borderBottom: "3px solid #28a745",
          paddingBottom: "15px"
        }}>
          Thêm sản phẩm mới
        </h2>
        <ProductForm onSubmit={handleSubmit} onCancel={handleCancel} />
      </div>
    </div>
  );
} 