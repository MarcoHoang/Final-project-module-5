import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProductList from "./compoments/ProductList";
import SearchBar from "./compoments/SearchBar";
import CreateProduct from "./pages/CreateProduct";
import EditProduct from "./pages/EditProduct";
import ProductDetail from "./pages/ProductDetail";

// Component Navigation riêng để sử dụng useLocation
function Navigation() {
  const location = useLocation();
  
  return (
    <nav style={{ 
      marginBottom: "30px", 
      padding: "20px 0",
      borderBottom: "2px solid #e9ecef"
    }}>
      <div style={{
        display: "flex",
        gap: "20px",
        justifyContent: "center"
      }}>
        <Link 
          to="/" 
          style={{ 
            padding: "12px 24px",
            textDecoration: "none",
            borderRadius: "8px",
            fontWeight: "600",
            fontSize: "16px",
            transition: "all 0.3s ease",
            backgroundColor: location.pathname === "/" ? "#007bff" : "#f8f9fa",
            color: location.pathname === "/" ? "white" : "#007bff",
            border: "2px solid #007bff",
            boxShadow: location.pathname === "/" ? "0 4px 8px rgba(0,123,255,0.3)" : "none"
          }}
          onMouseEnter={(e) => {
            if (location.pathname !== "/") {
              e.target.style.backgroundColor = "#e3f2fd";
              e.target.style.transform = "translateY(-2px)";
            }
          }}
          onMouseLeave={(e) => {
            if (location.pathname !== "/") {
              e.target.style.backgroundColor = "#f8f9fa";
              e.target.style.transform = "translateY(0)";
            }
          }}
        >
          Danh sách
        </Link>
        <Link 
          to="/create" 
          style={{ 
            padding: "12px 24px",
            textDecoration: "none",
            borderRadius: "8px",
            fontWeight: "600",
            fontSize: "16px",
            transition: "all 0.3s ease",
            backgroundColor: location.pathname === "/create" ? "#28a745" : "#f8f9fa",
            color: location.pathname === "/create" ? "white" : "#28a745",
            border: "2px solid #28a745",
            boxShadow: location.pathname === "/create" ? "0 4px 8px rgba(40,167,69,0.3)" : "none"
          }}
          onMouseEnter={(e) => {
            if (location.pathname !== "/create") {
              e.target.style.backgroundColor = "#e8f5e8";
              e.target.style.transform = "translateY(-2px)";
            }
          }}
          onMouseLeave={(e) => {
            if (location.pathname !== "/create") {
              e.target.style.backgroundColor = "#f8f9fa";
              e.target.style.transform = "translateY(0)";
            }
          }}
        >
          Thêm sản phẩm
        </Link>
      </div>
    </nav>
  );
}

export default function App() {
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchCategory, setSearchCategory] = useState("");

  const handleSearch = ({ name, categoryId }) => {
    setSearchKeyword(name);
    setSearchCategory(categoryId);
  };

  return (
    <Router>
      <div style={{ 
        minHeight: "100vh",
        backgroundColor: "#f8f9fa",
        padding: "20px"
      }}>
        <div style={{
          maxWidth: "1200px",
          margin: "0 auto",
          backgroundColor: "white",
          borderRadius: "12px",
          boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
          padding: "30px",
          minHeight: "calc(100vh - 40px)"
        }}>
          <h1 style={{ 
            textAlign: "center", 
            marginBottom: "30px",
            color: "#2c3e50",
            fontSize: "2.5rem",
            fontWeight: "700",
            textShadow: "0 2px 4px rgba(0,0,0,0.1)"
          }}>
            Quản lý bán quần áo
          </h1>
          
          <Navigation />

          <Routes>
            <Route path="/" element={
              <div>
                <SearchBar onSearch={handleSearch} />
                <ProductList searchKeyword={searchKeyword} searchCategory={searchCategory} />
              </div>
            } />
            <Route path="/create" element={<CreateProduct />} />
            <Route path="/edit/:id" element={<EditProduct />} />
            <Route path="/detail/:id" element={<ProductDetail />} />
          </Routes>

          {/* Toast Container cho thông báo */}
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </div>
      </div>
    </Router>
  );
}
