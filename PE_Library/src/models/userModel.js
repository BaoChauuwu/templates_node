const mongoose = require('mongoose');

// Định nghĩa Schema cho Người dùng
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true }, // Tên đăng nhập duy nhất
    password: { type: String, required: true }, // Mật khẩu (đã băm bcrypt)
    role: { type: String, enum: ['admin', 'librarian'], default: 'librarian' }, // Quyền: Admin hoặc Librarian (thủ thư)
    createdAt: { type: Date, default: Date.now } // Thời điểm tạo tài khoản
});

module.exports = mongoose.model('User', userSchema);