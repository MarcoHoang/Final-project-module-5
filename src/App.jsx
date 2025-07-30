import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProductList from "./compoments/ProductList";
import SearchBar from "./compoments/SearchBar";
import CreateProduct from "./pages/CreateProduct";
import EditProduct from "./pages/EditProduct";
import ProductDetail from "./pages/ProductDetail";

export default function App() {
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchCategory, setSearchCategory] = useState("");

  const handleSearch = ({ name, categoryId }) => {
    setSearchKeyword(name);
    setSearchCategory(categoryId);
  };

  return (
    <Router>
      <div style={{ padding: "20px" }}>
        <h1>Quản lý bán quần áo</h1>
        <nav style={{ marginBottom: "20px" }}>
          <Link to="/" style={{ marginRight: "10px" }}>Danh sách</Link>
          <Link to="/create">Thêm sản phẩm</Link>
        </nav>

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
    </Router>
  );
}
