# Hệ thống Quản lý Sản phẩm Clothing

Hệ thống quản lý sản phẩm cho đại lý phân phối bán sỉ quần áo Clothing.

## Tính năng

### Yêu cầu 1: Hiển thị thông tin sản phẩm (35 điểm)
- ✅ Ngày nhập đúng định dạng dd/MM/yyyy
- ✅ Danh sách sản phẩm sắp xếp tăng dần theo số lượng

### Yêu cầu 2: Cập nhật thông tin sản phẩm (30 điểm)
- ✅ Hiển thị giá trị ban đầu khi vào trang cập nhật
- ✅ Tên sản phẩm không dài quá 100 ký tự
- ✅ Thể loại được chọn từ dropdown list
- ✅ Ngày nhập không được lớn hơn ngày hiện tại
- ✅ Số lượng phải là số nguyên lớn hơn 0
- ✅ Thông báo thành công và quay về danh sách

### Yêu cầu 3: Tìm kiếm sản phẩm (25 điểm)
- ✅ Tìm kiếm gần đúng theo tên sản phẩm
- ✅ Tìm kiếm theo thể loại
- ✅ Tìm kiếm kết hợp cả 2 thông tin
- ✅ Hiển thị thông báo "Không tìm thấy sản phẩm"

## Cấu trúc dữ liệu

### Sản phẩm (products)
- `id`: ID sản phẩm
- `code`: Mã sản phẩm (duy nhất)
- `name`: Tên sản phẩm
- `importDate`: Ngày nhập (YYYY-MM-DD)
- `quantity`: Số lượng
- `categoryId`: ID loại sản phẩm
- `description`: Mô tả (tùy chọn)

### Loại sản phẩm (categories)
- `id`: ID loại sản phẩm
- `name`: Tên loại sản phẩm

## Cài đặt và chạy

1. **Cài đặt dependencies:**
```bash
npm install
```

2. **Chạy json-server (API server):**
```bash
npm run server
```

3. **Chạy ứng dụng React (trong terminal khác):**
```bash
npm run dev
```

4. **Truy cập ứng dụng:**
- Frontend: http://localhost:5173
- API: http://localhost:3001

## Công nghệ sử dụng

- **Frontend:** React 19, Vite
- **Routing:** React Router DOM
- **HTTP Client:** Axios
- **Date formatting:** date-fns
- **API Server:** json-server
- **Styling:** CSS inline
- **Notifications:** React Toastify

## Cấu trúc thư mục

```
src/
├── compoments/          # Components chính
│   ├── ProductList.jsx  # Danh sách sản phẩm
│   ├── ProductForm.jsx  # Form thêm/sửa sản phẩm
│   ├── SearchBar.jsx    # Thanh tìm kiếm
│   └── ProductDetail.jsx # Chi tiết sản phẩm
├── pages/               # Pages
│   ├── CreateProduct.jsx # Trang thêm sản phẩm
│   ├── EditProduct.jsx   # Trang sửa sản phẩm
│   └── ProductDetail.jsx # Trang chi tiết
├── services/            # API services
│   ├── productService.js # API sản phẩm
│   └── categoryService.js # API loại sản phẩm
└── utils/               # Utilities
    └── formatDate.js    # Format ngày tháng
```

## Validation

- **Mã sản phẩm:** Duy nhất, không được trùng với sản phẩm khác
- **Tên sản phẩm:** Tối đa 100 ký tự
- **Ngày nhập:** Không được lớn hơn ngày hiện tại
- **Số lượng:** Phải là số nguyên lớn hơn 0
- **Tất cả trường:** Bắt buộc nhập

## Thông báo (Notifications)

Dự án sử dụng **React Toastify** để hiển thị thông báo:

- **✅ Success:** Thông báo thành công (màu xanh)
- **❌ Error:** Thông báo lỗi (màu đỏ)
- **⚠️ Warning:** Thông báo cảnh báo (màu vàng)
- **ℹ️ Info:** Thông báo thông tin (màu xanh dương)

### Cấu hình Toast:
- **Vị trí:** Góc trên bên phải
- **Tự động đóng:** 3-4 giây
- **Có thể click để đóng**
- **Có thể kéo thả**
- **Tạm dừng khi hover**

## Phân trang (Pagination)

- **Số sản phẩm mỗi trang:** 5 sản phẩm
- **Điều hướng:** Nút "Trước" và "Sau"
- **Hiển thị số trang:** Tối đa 5 số trang, có dấu "..." cho trang bị ẩn
- **Thông tin:** Hiển thị vị trí hiện tại và tổng số sản phẩm
- **Reset trang:** Tự động về trang 1 khi thay đổi tìm kiếm

### Tính năng phân trang:
- ✅ Hiển thị 5 sản phẩm mỗi trang
- ✅ Nút điều hướng Trước/Sau
- ✅ Hiển thị số trang với ellipsis (...)
- ✅ Thông tin vị trí hiện tại
- ✅ Tự động reset về trang 1 khi tìm kiếm
- ✅ Disable nút khi ở trang đầu/cuối

## Tính năng bổ sung

- ✅ UI/UX đẹp và responsive
- ✅ Loading states
- ✅ Error handling với toast notifications
- ✅ Validation real-time
- ✅ Responsive design
- ✅ Toast notifications thay thế alert
- ✅ Phân trang chuyên nghiệp
- ✅ Validation mã sản phẩm duy nhất
- ✅ Debug logs cho troubleshooting
