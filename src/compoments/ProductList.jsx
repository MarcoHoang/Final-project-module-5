import { useEffect, useState } from "react";
import { toast } from 'react-toastify';
import { getAllProducts } from "../services/productService";
import { getAllCategories } from "../services/categoryService";
import { formatDate } from "../../utils/formatDate";
import { useNavigate } from "react-router-dom";

export default function ProductList({ searchKeyword, searchCategory }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(5);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setCurrentPage(1); // Reset về trang 1 khi thay đổi tìm kiếm
  }, [searchKeyword, searchCategory]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [productRes, categoryRes] = await Promise.all([
        getAllProducts(),
        getAllCategories(),
      ]);
      setProducts(productRes.data);
      setCategories(categoryRes.data);
    } catch (error) {
      console.error("Lỗi khi load dữ liệu:", error);
      toast.error("Không thể tải danh sách sản phẩm. Vui lòng thử lại!", {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find((c) => c.id === categoryId);
    return category ? category.name : "";
  };

  const filteredProducts = products
    .filter((p) =>
      searchKeyword
        ? p.name.toLowerCase().includes(searchKeyword.toLowerCase())
        : true
    )
    .filter((p) =>
      searchCategory ? p.categoryId === parseInt(searchCategory) : true
    )
    .sort((a, b) => a.quantity - b.quantity); // Sắp xếp tăng dần theo số lượng

  // Tính toán phân trang
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  // Thay đổi trang
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Tạo mảng số trang để hiển thị
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      }
    }
    
    return pageNumbers;
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "20px" }}>
        <p>Đang tải dữ liệu...</p>
      </div>
    );
  }

  if (filteredProducts.length === 0) {
    return (
      <div style={{ 
        textAlign: "center", 
        padding: "40px", 
        backgroundColor: "#f8f9fa", 
        borderRadius: "8px",
        margin: "20px 0"
      }}>
        <p style={{ fontSize: "18px", color: "#6c757d" }}>Không tìm thấy sản phẩm</p>
      </div>
    );
  }

  return (
    <div>
      <div style={{ overflowX: "auto" }}>
        <table style={{
          width: "100%",
          borderCollapse: "collapse",
          backgroundColor: "white",
          borderRadius: "8px",
          overflow: "hidden",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
        }}>
          <thead>
            <tr style={{ backgroundColor: "#007bff", color: "white" }}>
              <th style={{ padding: "12px", textAlign: "left", borderBottom: "1px solid #dee2e6" }}>Mã</th>
              <th style={{ padding: "12px", textAlign: "left", borderBottom: "1px solid #dee2e6" }}>Tên</th>
              <th style={{ padding: "12px", textAlign: "left", borderBottom: "1px solid #dee2e6" }}>Ngày nhập</th>
              <th style={{ padding: "12px", textAlign: "left", borderBottom: "1px solid #dee2e6" }}>Số lượng</th>
              <th style={{ padding: "12px", textAlign: "left", borderBottom: "1px solid #dee2e6" }}>Loại sản phẩm</th>
              <th style={{ padding: "12px", textAlign: "center", borderBottom: "1px solid #dee2e6" }}>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {currentProducts.map((product, index) => (
              <tr key={product.id} style={{ 
                backgroundColor: index % 2 === 0 ? "#f8f9fa" : "white",
                borderBottom: "1px solid #dee2e6"
              }}>
                <td style={{ padding: "12px", fontWeight: "bold" }}>{product.code}</td>
                <td style={{ padding: "12px" }}>{product.name}</td>
                <td style={{ padding: "12px" }}>{formatDate(product.importDate)}</td>
                <td style={{ padding: "12px", textAlign: "center" }}>
                  {product.quantity}
                </td>
                <td style={{ padding: "12px" }}>{getCategoryName(product.categoryId)}</td>
                <td style={{ padding: "12px", textAlign: "center" }}>
                  <button 
                    onClick={() => navigate(`/edit/${product.id}`)}
                    style={{ 
                      padding: "8px 16px", 
                      backgroundColor: "#17a2b8", 
                      color: "white", 
                      border: "none", 
                      borderRadius: "6px",
                      cursor: "pointer",
                      fontSize: "12px",
                      fontWeight: "600",
                      transition: "all 0.3s ease",
                      boxShadow: "0 2px 4px rgba(23,162,184,0.2)"
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = "#138496";
                      e.target.style.transform = "translateY(-1px)";
                      e.target.style.boxShadow = "0 4px 8px rgba(23,162,184,0.3)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = "#17a2b8";
                      e.target.style.transform = "translateY(0)";
                      e.target.style.boxShadow = "0 2px 4px rgba(23,162,184,0.2)";
                    }}
                  >
                    Cập nhật
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Phân trang */}
      {totalPages > 1 && (
        <div style={{ 
          display: "flex", 
          justifyContent: "center", 
          alignItems: "center", 
          marginTop: "20px",
          gap: "10px"
        }}>
          {/* Nút Previous */}
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            style={{
              padding: "10px 16px",
              backgroundColor: currentPage === 1 ? "#6c757d" : "#007bff",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: currentPage === 1 ? "not-allowed" : "pointer",
              fontSize: "14px",
              fontWeight: "600",
              transition: "all 0.3s ease",
              boxShadow: currentPage === 1 ? "none" : "0 2px 4px rgba(0,123,255,0.2)"
            }}
            onMouseEnter={(e) => {
              if (currentPage !== 1) {
                e.target.style.backgroundColor = "#0056b3";
                e.target.style.transform = "translateY(-1px)";
                e.target.style.boxShadow = "0 4px 8px rgba(0,123,255,0.3)";
              }
            }}
            onMouseLeave={(e) => {
              if (currentPage !== 1) {
                e.target.style.backgroundColor = "#007bff";
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "0 2px 4px rgba(0,123,255,0.2)";
              }
            }}
          >
            Trước
          </button>

          {/* Số trang */}
          {getPageNumbers().map((number, index) => (
            <button
              key={index}
              onClick={() => typeof number === 'number' ? paginate(number) : null}
              disabled={number === '...'}
              style={{
                padding: "10px 16px",
                backgroundColor: number === currentPage ? "#007bff" : "#f8f9fa",
                color: number === currentPage ? "white" : "#007bff",
                border: "2px solid #dee2e6",
                borderRadius: "6px",
                cursor: number === '...' ? "default" : "pointer",
                fontSize: "14px",
                fontWeight: "600",
                minWidth: "45px",
                transition: "all 0.3s ease",
                boxShadow: number === currentPage ? "0 2px 4px rgba(0,123,255,0.3)" : "none"
              }}
              onMouseEnter={(e) => {
                if (number !== '...' && number !== currentPage) {
                  e.target.style.backgroundColor = "#e3f2fd";
                  e.target.style.transform = "translateY(-1px)";
                  e.target.style.boxShadow = "0 2px 4px rgba(0,123,255,0.2)";
                }
              }}
              onMouseLeave={(e) => {
                if (number !== '...' && number !== currentPage) {
                  e.target.style.backgroundColor = "#f8f9fa";
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow = "none";
                }
              }}
            >
              {number}
            </button>
          ))}

          {/* Nút Next */}
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
            style={{
              padding: "10px 16px",
              backgroundColor: currentPage === totalPages ? "#6c757d" : "#007bff",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: currentPage === totalPages ? "not-allowed" : "pointer",
              fontSize: "14px",
              fontWeight: "600",
              transition: "all 0.3s ease",
              boxShadow: currentPage === totalPages ? "none" : "0 2px 4px rgba(0,123,255,0.2)"
            }}
            onMouseEnter={(e) => {
              if (currentPage !== totalPages) {
                e.target.style.backgroundColor = "#0056b3";
                e.target.style.transform = "translateY(-1px)";
                e.target.style.boxShadow = "0 4px 8px rgba(0,123,255,0.3)";
              }
            }}
            onMouseLeave={(e) => {
              if (currentPage !== totalPages) {
                e.target.style.backgroundColor = "#007bff";
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "0 2px 4px rgba(0,123,255,0.2)";
              }
            }}
          >
            Sau
          </button>
        </div>
      )}

      {/* Thông tin phân trang */}
      <div style={{ 
        textAlign: "center", 
        marginTop: "15px", 
        padding: "12px 20px",
        backgroundColor: "#e3f2fd",
        borderRadius: "8px",
        border: "1px solid #bbdefb",
        color: "#1976d2",
        fontSize: "14px",
        fontWeight: "600",
        boxShadow: "0 2px 4px rgba(25,118,210,0.1)"
      }}>
        Hiển thị sản phẩm <strong>{indexOfFirstProduct + 1}-{Math.min(indexOfLastProduct, filteredProducts.length)} </strong> 
        trong tổng số <strong>{filteredProducts.length}</strong> sản phẩm 
        {totalPages > 1 && ` (Trang ${currentPage}/${totalPages})`}
      </div>
    </div>
  );
}
