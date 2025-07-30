import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import ProductForm from "../compoments/ProductForm";
import { getProductById, updateProduct } from "../services/productService";

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProduct() {
      try {
        setLoading(true);
        const response = await getProductById(id);
        if (!response.data) {
          toast.error("Không tìm thấy sản phẩm.", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
          navigate("/");
        } else {
          setInitialData(response.data);
        }
      } catch (error) {
        console.error("Lỗi khi tải sản phẩm:", error);
        toast.error("Không tìm thấy sản phẩm.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        navigate("/");
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [id, navigate]);

  const handleSubmit = async (updatedProduct) => {
    try {
      await updateProduct(id, updatedProduct);
      toast.success("Cập nhật sản phẩm thành công!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      navigate("/");
    } catch (error) {
      console.error("Lỗi khi cập nhật sản phẩm:", error);
      toast.error("Cập nhật thất bại. Vui lòng thử lại!", {
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

  if (loading) {
    return (
      <div style={{ 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center",
        minHeight: "60vh"
      }}>
        <div style={{
          textAlign: "center",
          padding: "40px",
          backgroundColor: "white",
          borderRadius: "12px",
          boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
          border: "1px solid #e9ecef"
        }}>
          <p style={{ fontSize: "18px", color: "#6c757d" }}>Đang tải dữ liệu sản phẩm...</p>
        </div>
      </div>
    );
  }

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
          borderBottom: "3px solid #17a2b8",
          paddingBottom: "15px"
        }}>
          Cập nhật sản phẩm
        </h2>
        {initialData ? (
          <ProductForm 
            initialData={initialData} 
            onSubmit={handleSubmit} 
            onCancel={handleCancel}
          />
        ) : (
          <div style={{ textAlign: "center", padding: "20px" }}>
            <p style={{ color: "#dc3545", fontSize: "16px" }}>Không tìm thấy sản phẩm</p>
          </div>
        )}
      </div>
    </div>
  );
}
