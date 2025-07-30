import { useEffect, useState } from "react";
import { toast } from 'react-toastify';
import { getAllCategories } from "../services/categoryService";
import { getAllProducts } from "../services/productService";

export default function ProductForm({ initialData, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    importDate: "",
    quantity: "",
    categoryId: "",
  });

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        importDate: initialData.importDate?.slice(0, 10), // Cắt chuỗi ngày cho input[type="date"]
        categoryId: initialData.categoryId?.toString() || "", // Đảm bảo categoryId là string cho select
      });
    }
  }, [initialData]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [categoriesRes, productsRes] = await Promise.all([
        getAllCategories(),
        getAllProducts(),
      ]);
      
      console.log("Categories loaded:", categoriesRes.data); // Debug log
      console.log("Products loaded:", productsRes.data); // Debug log
      
      setCategories(categoriesRes.data);
      setProducts(productsRes.data);
    } catch (error) {
      console.error("Lỗi khi load dữ liệu:", error);
      toast.error("Không thể tải dữ liệu", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Kiểm tra mã sản phẩm không được trùng
    const existingProduct = products.find(p => 
      p.code.toLowerCase() === formData.code.toLowerCase() && 
      p.id !== initialData?.id
    );
    if (existingProduct) {
      newErrors.code = "Mã sản phẩm đã tồn tại. Vui lòng chọn mã khác.";
    }

    // Kiểm tra tên sản phẩm không dài quá 100 ký tự
    if (formData.name.length > 100) {
      newErrors.name = "Tên sản phẩm không được dài quá 100 ký tự";
    }

    // Kiểm tra ngày nhập không được lớn hơn ngày hiện tại
    const today = new Date().toISOString().split('T')[0];
    if (formData.importDate > today) {
      newErrors.importDate = "Ngày nhập không được lớn hơn ngày hiện tại";
    }

    // Kiểm tra số lượng phải là số nguyên lớn hơn 0
    const quantity = parseInt(formData.quantity);
    if (isNaN(quantity) || quantity <= 0) {
      newErrors.quantity = "Số lượng phải là số nguyên lớn hơn 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.code || !formData.name || !formData.importDate || !formData.quantity || !formData.categoryId) {
      toast.warning("Vui lòng điền đầy đủ thông tin.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }

    if (!validateForm()) {
      toast.error("Vui lòng kiểm tra lại thông tin nhập.", {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }

    // Ép kiểu categoryId về số trước khi submit
    const submitData = {
      ...formData,
      categoryId: parseInt(formData.categoryId),
      quantity: parseInt(formData.quantity)
    };

    onSubmit(submitData);
  };

  if (loading) {
    return (
      <div style={{ 
        textAlign: "center", 
        padding: "40px",
        backgroundColor: "#f8f9fa",
        borderRadius: "8px",
        border: "1px solid #dee2e6"
      }}>
        <p style={{ fontSize: "16px", color: "#6c757d" }}>Đang tải dữ liệu...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ width: "100%" }}>
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "1fr 1fr", 
        gap: "30px",
        marginBottom: "30px"
      }}>
        <div style={{ marginBottom: "20px" }}>
          <label style={{ 
            display: "block", 
            marginBottom: "10px",
            fontWeight: "600",
            color: "#495057",
            fontSize: "14px"
          }}>
            Mã sản phẩm:
          </label>
          <input
            type="text"
            name="code"
            value={formData.code}
            onChange={handleChange}
            required
            placeholder="VD: SP001"
            style={{ 
              width: "100%", 
              padding: "12px 16px", 
              border: errors.code ? "2px solid #dc3545" : "2px solid #ced4da", 
              borderRadius: "8px",
              fontSize: "14px",
              transition: "all 0.3s ease",
              backgroundColor: errors.code ? "#fff5f5" : "white"
            }}
            onFocus={(e) => {
              e.target.style.borderColor = errors.code ? "#dc3545" : "#007bff";
              e.target.style.boxShadow = "0 0 0 3px rgba(0,123,255,0.1)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = errors.code ? "#dc3545" : "#ced4da";
              e.target.style.boxShadow = "none";
            }}
          />
          {errors.code && (
            <span style={{ 
              color: "#dc3545", 
              fontSize: "12px",
              marginTop: "5px",
              display: "block"
            }}>
              {errors.code}
            </span>
          )}
        </div>
        
        <div style={{ marginBottom: "20px" }}>
          <label style={{ 
            display: "block", 
            marginBottom: "10px",
            fontWeight: "600",
            color: "#495057",
            fontSize: "14px"
          }}>
            Tên sản phẩm:
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            maxLength={100}
            placeholder="Nhập tên sản phẩm"
            style={{ 
              width: "100%", 
              padding: "12px 16px", 
              border: errors.name ? "2px solid #dc3545" : "2px solid #ced4da", 
              borderRadius: "8px",
              fontSize: "14px",
              transition: "all 0.3s ease",
              backgroundColor: errors.name ? "#fff5f5" : "white"
            }}
            onFocus={(e) => {
              e.target.style.borderColor = errors.name ? "#dc3545" : "#007bff";
              e.target.style.boxShadow = "0 0 0 3px rgba(0,123,255,0.1)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = errors.name ? "#dc3545" : "#ced4da";
              e.target.style.boxShadow = "none";
            }}
          />
          {errors.name && (
            <span style={{ 
              color: "#dc3545", 
              fontSize: "12px",
              marginTop: "5px",
              display: "block"
            }}>
              {errors.name}
            </span>
          )}
        </div>
      </div>
      
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "1fr 1fr", 
        gap: "30px",
        marginBottom: "30px"
      }}>
        <div style={{ marginBottom: "20px" }}>
          <label style={{ 
            display: "block", 
            marginBottom: "10px",
            fontWeight: "600",
            color: "#495057",
            fontSize: "14px"
          }}>
            Ngày nhập:
          </label>
          <input
            type="date"
            name="importDate"
            value={formData.importDate}
            onChange={handleChange}
            required
            max={new Date().toISOString().split('T')[0]}
            style={{ 
              width: "100%", 
              padding: "12px 16px", 
              border: errors.importDate ? "2px solid #dc3545" : "2px solid #ced4da", 
              borderRadius: "8px",
              fontSize: "14px",
              transition: "all 0.3s ease",
              backgroundColor: errors.importDate ? "#fff5f5" : "white"
            }}
            onFocus={(e) => {
              e.target.style.borderColor = errors.importDate ? "#dc3545" : "#007bff";
              e.target.style.boxShadow = "0 0 0 3px rgba(0,123,255,0.1)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = errors.importDate ? "#dc3545" : "#ced4da";
              e.target.style.boxShadow = "none";
            }}
          />
          {errors.importDate && (
            <span style={{ 
              color: "#dc3545", 
              fontSize: "12px",
              marginTop: "5px",
              display: "block"
            }}>
              {errors.importDate}
            </span>
          )}
        </div>
        
        <div style={{ marginBottom: "20px" }}>
          <label style={{ 
            display: "block", 
            marginBottom: "10px",
            fontWeight: "600",
            color: "#495057",
            fontSize: "14px"
          }}>
            Số lượng:
          </label>
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            required
            min="1"
            placeholder="Nhập số lượng"
            style={{ 
              width: "100%", 
              padding: "12px 16px", 
              border: errors.quantity ? "2px solid #dc3545" : "2px solid #ced4da", 
              borderRadius: "8px",
              fontSize: "14px",
              transition: "all 0.3s ease",
              backgroundColor: errors.quantity ? "#fff5f5" : "white"
            }}
            onFocus={(e) => {
              e.target.style.borderColor = errors.quantity ? "#dc3545" : "#007bff";
              e.target.style.boxShadow = "0 0 0 3px rgba(0,123,255,0.1)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = errors.quantity ? "#dc3545" : "#ced4da";
              e.target.style.boxShadow = "none";
            }}
          />
          {errors.quantity && (
            <span style={{ 
              color: "#dc3545", 
              fontSize: "12px",
              marginTop: "5px",
              display: "block"
            }}>
              {errors.quantity}
            </span>
          )}
        </div>
      </div>
      
      <div style={{ marginBottom: "35px" }}>
        <label style={{ 
          display: "block", 
          marginBottom: "10px",
          fontWeight: "600",
          color: "#495057",
          fontSize: "14px"
        }}>
          Loại sản phẩm:
        </label>
        <select
          name="categoryId"
          value={formData.categoryId}
          onChange={handleChange}
          required
          style={{ 
            width: "100%", 
            padding: "12px 16px", 
            border: "2px solid #ced4da", 
            borderRadius: "8px",
            fontSize: "14px",
            transition: "all 0.3s ease",
            backgroundColor: "white"
          }}
          onFocus={(e) => {
            e.target.style.borderColor = "#007bff";
            e.target.style.boxShadow = "0 0 0 3px rgba(0,123,255,0.1)";
          }}
          onBlur={(e) => {
            e.target.style.borderColor = "#ced4da";
            e.target.style.boxShadow = "none";
          }}
        >
          <option value="">-- Chọn loại sản phẩm --</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        {categories.length === 0 && (
          <span style={{ 
            color: "#ffc107", 
            fontSize: "12px",
            marginTop: "5px",
            display: "block"
          }}>
            Đang tải danh sách loại sản phẩm...
          </span>
        )}
      </div>
      
      <div style={{ 
        display: "flex", 
        justifyContent: "center", 
        gap: "20px",
        marginTop: "40px"
      }}>
        <button 
          type="submit" 
          style={{ 
            padding: "12px 30px", 
            backgroundColor: "#28a745", 
            color: "white", 
            border: "none", 
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "16px",
            fontWeight: "600",
            transition: "all 0.3s ease",
            boxShadow: "0 2px 4px rgba(40,167,69,0.2)"
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = "#218838";
            e.target.style.transform = "translateY(-2px)";
            e.target.style.boxShadow = "0 4px 8px rgba(40,167,69,0.3)";
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = "#28a745";
            e.target.style.transform = "translateY(0)";
            e.target.style.boxShadow = "0 2px 4px rgba(40,167,69,0.2)";
          }}
        >
          Lưu
        </button>
        <button 
          type="button" 
          onClick={onCancel}
          style={{ 
            padding: "12px 30px", 
            backgroundColor: "#6c757d", 
            color: "white", 
            border: "none", 
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "16px",
            fontWeight: "600",
            transition: "all 0.3s ease",
            boxShadow: "0 2px 4px rgba(108,117,125,0.2)"
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = "#5a6268";
            e.target.style.transform = "translateY(-2px)";
            e.target.style.boxShadow = "0 4px 8px rgba(108,117,125,0.3)";
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = "#6c757d";
            e.target.style.transform = "translateY(0)";
            e.target.style.boxShadow = "0 2px 4px rgba(108,117,125,0.2)";
          }}
        >
          Hủy
        </button>
      </div>
    </form>
  );
}
