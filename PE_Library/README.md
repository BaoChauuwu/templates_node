# Hệ thống Quản Lý Thư Viện FPT (FPT University) 📚

Chào mừng bạn đến với đồ án **Hệ thống Quản lý Thư viện**. Đây là một RESTful API hoàn chỉnh sử dụng Node.js, Express và MongoDB để quản lý sách, thành viên và các bản ghi mượn sách với phân quyền dựa trên vai trò (RBAC).

## 📌 Tính năng
- **Quản lý người dùng**: Đăng ký và Đăng nhập với JWT.
- **Quản lý Sách**: Theo dõi trạng thái sách (có sẵn, đang mượn, bị mất).
- **Quản lý Mượn sách**: 
  - Tạo bản ghi mượn sách.
  - Tính phí mượn tự động dựa trên số ngày mượn.
  - Tự động cập nhật trạng thái sách.
  - Ngăn chặn mượn sách đang được mượn hoặc bị mất.
- **Phân quyền (RBAC)**:
  - **Admin**: Có quyền xem tất cả bản ghi mượn sách toàn hệ thống.
  - **Librarian (Thủ thư)**: Có quyền thực hiện mượn/trả sách và chỉ xem được lịch sử mượn trả do chính mình thực hiện.

---

## 🛠️ Hướng dẫn cài đặt

1. **Clone project hoặc giải nén thư mục:**
   ```bash
   cd <yourname>_fptLibrary
   ```

2. **Cài đặt dependencies:**
   ```bash
   npm install
   ```

3. **Cấu hình biến môi trường (`.env`):**
   Tạo file `.env` ở thư mục gốc (nếu chưa có) và điền các giá trị sau:
   ```env
   PORT=8386
   MONGODB_URI=mongodb://127.0.0.1:27017/pe_library
   JWT_SECRET=fpt_secret_key_extremely_safe_123
   JWT_EXPIRES_IN=1d
   ```

4. **Seed dữ liệu mẫu (Sách + Tài khoản):**
   ```bash
   node seed.js
   ```

---

## 🚀 Cách chạy ứng dụng

Chạy bằng lệnh:
```bash
npm start
```
(Hoặc `npm run dev` nếu có cấu hình nodemon)

Server sẽ khởi chạy tại: `http://localhost:8386`

---

## 📝 Tài liệu kiểm thử API (Postman)

### 1. Authentication
- **Đăng ký**: `POST /auth/register` (body: `username`, `password`, `role`)
- **Đăng nhập**: `POST /auth/login` (body: `username`, `password`)

### 2. Quản lý Mượn trả (Cần Header: `Authorization: Bearer <TOKEN>`)
- **Lấy danh sách**: `GET /records`
- **Mượn sách**: `POST /records/borrow`
  - Body mẫu:
    ```json
    {
      "bookId": "ID_CUA_SACH",
      "memberName": "Nguyen Van A",
      "borrowDate": "2025-03-20",
      "note": "Mượn học tập"
    }
    ```
- **Trả sách**: `PUT /records/:id/return`

---

## 👥 Tài khoản kiểm thử mẫu

| Role | Username | Password | Mô tả |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin1` | `123456` | Quản lý toàn hệ thống |
| **Librarian** | `librarian1` | `123456` | Mượn và trả sách |
| **Librarian** | `librarian2` | `123456` | Chỉ xem được bản ghi của librarian2 |

---

## 📂 Cấu trúc thư mục
```
/src
  /controllers  - Xử lý logic API
  /models       - Mongoose Schemas (User, Book, BorrowRecord)
  /routes       - Định nghĩa các endpoint
  /services     - Tầng trung gian xử lý nghiệp vụ
  /middlewares  - Phân quyền (JWT, Admin check)
index.js        - Điểm khởi đầu của hệ thống
seed.js         - Khởi tạo dữ liệu mẫu
```

---
*Phát triển bởi [Tên Của Bạn]*
