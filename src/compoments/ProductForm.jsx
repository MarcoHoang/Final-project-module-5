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
      <div style={{ textAlign: "center", padding: "20px" }}>
        <p>Đang tải dữ liệu...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: "500px" }}>
      <div style={{ marginBottom: "15px" }}>
        <label style={{ display: "block", marginBottom: "5px" }}>Mã sản phẩm:</label>
        <input
          type="text"
          name="code"
          value={formData.code}
          onChange={handleChange}
          required
          style={{ 
            width: "100%", 
            padding: "8px", 
            border: errors.code ? "1px solid red" : "1px solid #ddd", 
            borderRadius: "4px" 
          }}
        />
        {errors.code && <span style={{ color: "red", fontSize: "12px" }}>{errors.code}</span>}
      </div>
      
      <div style={{ marginBottom: "15px" }}>
        <label style={{ display: "block", marginBottom: "5px" }}>Tên sản phẩm:</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          maxLength={100}
          style={{ 
            width: "100%", 
            padding: "8px", 
            border: errors.name ? "1px solid red" : "1px solid #ddd", 
            borderRadius: "4px" 
          }}
        />
        {errors.name && <span style={{ color: "red", fontSize: "12px" }}>{errors.name}</span>}
      </div>
      
      <div style={{ marginBottom: "15px" }}>
        <label style={{ display: "block", marginBottom: "5px" }}>Ngày nhập:</label>
        <input
          type="date"
          name="importDate"
          value={formData.importDate}
          onChange={handleChange}
          required
          max={new Date().toISOString().split('T')[0]}
          style={{ 
            width: "100%", 
            padding: "8px", 
            border: errors.importDate ? "1px solid red" : "1px solid #ddd", 
            borderRadius: "4px" 
          }}
        />
        {errors.importDate && <span style={{ color: "red", fontSize: "12px" }}>{errors.importDate}</span>}
      </div>
      
      <div style={{ marginBottom: "15px" }}>
        <label style={{ display: "block", marginBottom: "5px" }}>Số lượng:</label>
        <input
          type="number"
          name="quantity"
          value={formData.quantity}
          onChange={handleChange}
          required
          min="1"
          style={{ 
            width: "100%", 
            padding: "8px", 
            border: errors.quantity ? "1px solid red" : "1px solid #ddd", 
            borderRadius: "4px" 
          }}
        />
        {errors.quantity && <span style={{ color: "red", fontSize: "12px" }}>{errors.quantity}</span>}
      </div>
      
      <div style={{ marginBottom: "15px" }}>
        <label style={{ display: "block", marginBottom: "5px" }}>Loại sản phẩm:</label>
        <select
          name="categoryId"
          value={formData.categoryId}
          onChange={handleChange}
          required
          style={{ 
            width: "100%", 
            padding: "8px", 
            border: "1px solid #ddd", 
            borderRadius: "4px" 
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
          <span style={{ color: "orange", fontSize: "12px" }}>
            Đang tải danh sách loại sản phẩm...
          </span>
        )}
      </div>
      
      <div style={{ marginTop: "20px" }}>
        <button 
          type="submit" 
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
          Lưu
        </button>
        <button 
          type="button" 
          onClick={onCancel}
          style={{ 
            padding: "10px 20px", 
            backgroundColor: "#6c757d", 
            color: "white", 
            border: "none", 
            borderRadius: "4px",
            cursor: "pointer"
          }}
        >
          Hủy
        </button>
      </div>
    </form>
  );
}
