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
      <div style={{ textAlign: "center", padding: "20px" }}>
        <p>Đang tải dữ liệu sản phẩm...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2>Cập nhật sản phẩm</h2>
      {initialData ? (
        <ProductForm 
          initialData={initialData} 
          onSubmit={handleSubmit} 
          onCancel={handleCancel}
        />
      ) : (
        <p>Không tìm thấy sản phẩm</p>
      )}
    </div>
  );
}
