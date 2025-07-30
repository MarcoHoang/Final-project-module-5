import React, { useState, useEffect } from "react";
import { toast } from 'react-toastify';
import { getAllCategories } from "../services/categoryService";

export default function SearchBar({ onSearch }) {
  const [nameKeyword, setNameKeyword] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await getAllCategories();
        setCategories(response.data);
      } catch (error) {
        console.error("Lỗi khi tải danh sách loại sản phẩm", error);
        toast.error("Không thể tải danh sách loại sản phẩm", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    }
    fetchCategories();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch({
      name: nameKeyword.trim().toLowerCase(),
      categoryId: selectedCategoryId,
    });
  };

  return (
    <form onSubmit={handleSearch} style={{ marginBottom: "1rem", padding: "15px", backgroundColor: "#f8f9fa", borderRadius: "8px" }}>
      <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
        <input
          type="text"
          placeholder="Tìm theo tên sản phẩm..."
          value={nameKeyword}
          onChange={(e) => setNameKeyword(e.target.value)}
          style={{ 
            padding: "8px 12px", 
            border: "1px solid #ddd", 
            borderRadius: "4px",
            flex: "1",
            minWidth: "200px"
          }}
        />

        <select
          value={selectedCategoryId}
          onChange={(e) => setSelectedCategoryId(e.target.value)}
          style={{ 
            padding: "8px 12px", 
            border: "1px solid #ddd", 
            borderRadius: "4px",
            minWidth: "200px"
          }}
        >
          <option value="">-- Tất cả loại sản phẩm --</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        <button 
          type="submit" 
          style={{ 
            padding: "8px 16px", 
            backgroundColor: "#007bff", 
            color: "white", 
            border: "none", 
            borderRadius: "4px",
            cursor: "pointer"
          }}
        >
          Tìm kiếm
        </button>
      </div>
    </form>
  );
}
