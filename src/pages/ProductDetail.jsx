import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import { getProductById } from "../services/productService";
import { getAllCategories } from "../services/categoryService";
import { formatDate } from "../../utils/formatDate";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [productRes, categoriesRes] = await Promise.all([
          getProductById(id),
          getAllCategories(),
        ]);
        setProduct(productRes.data);
        setCategories(categoriesRes.data);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
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

    fetchData();
  }, [id, navigate]);

  const getCategoryName = (categoryId) => {
    const category = categories.find((c) => c.id === categoryId);
    return category ? category.name : "";
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "20px" }}>
        <p>Đang tải dữ liệu...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div style={{ textAlign: "center", padding: "20px" }}>
        <p>Không tìm thấy sản phẩm</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <div style={{ 
        backgroundColor: "white", 
        padding: "30px", 
        borderRadius: "8px", 
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)" 
      }}>
        <h2 style={{ marginBottom: "30px", color: "#333" }}>Chi tiết sản phẩm</h2>
        
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
          <div>
            <label style={{ fontWeight: "bold", color: "#666" }}>Mã sản phẩm:</label>
            <p style={{ margin: "5px 0 15px 0", fontSize: "16px" }}>{product.code}</p>
          </div>
          
          <div>
            <label style={{ fontWeight: "bold", color: "#666" }}>Tên sản phẩm:</label>
            <p style={{ margin: "5px 0 15px 0", fontSize: "16px" }}>{product.name}</p>
          </div>
          
          <div>
            <label style={{ fontWeight: "bold", color: "#666" }}>Ngày nhập:</label>
            <p style={{ margin: "5px 0 15px 0", fontSize: "16px" }}>{formatDate(product.importDate)}</p>
          </div>
          
          <div>
            <label style={{ fontWeight: "bold", color: "#666" }}>Số lượng:</label>
            <p style={{ margin: "5px 0 15px 0", fontSize: "16px" }}>
              {product.quantity}
            </p>
          </div>
          
          <div>
            <label style={{ fontWeight: "bold", color: "#666" }}>Loại sản phẩm:</label>
            <p style={{ margin: "5px 0 15px 0", fontSize: "16px" }}>{getCategoryName(product.categoryId)}</p>
          </div>
          
          {product.description && (
            <div style={{ gridColumn: "1 / -1" }}>
              <label style={{ fontWeight: "bold", color: "#666" }}>Mô tả:</label>
              <p style={{ margin: "5px 0 15px 0", fontSize: "16px" }}>{product.description}</p>
            </div>
          )}
        </div>
        
        <div style={{ marginTop: "30px", textAlign: "center" }}>
          <button 
            onClick={() => navigate(`/edit/${product.id}`)}
            style={{ 
              padding: "10px 20px", 
              backgroundColor: "#007bff", 
              color: "white", 
              border: "none", 
              borderRadius: "4px",
              marginRight: "10px",
              cursor: "pointer"
            }}
          >
            Sửa sản phẩm
          </button>
          <button 
            onClick={() => navigate("/")}
            style={{ 
              padding: "10px 20px", 
              backgroundColor: "#6c757d", 
              color: "white", 
              border: "none", 
              borderRadius: "4px",
              cursor: "pointer"
            }}
          >
            Quay lại
          </button>
        </div>
      </div>
    </div>
  );
} 