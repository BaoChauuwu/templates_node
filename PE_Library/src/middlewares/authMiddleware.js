const jwt = require('jsonwebtoken');

/**
 * Middleware xác thực JWT Token
 */
const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'] || req.headers['Authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Định dạng: Bearer <token>

    if (!token) {
        return res.status(401).json({ message: 'Bạn chưa đăng nhập (Thiếu Access Token)' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Lưu thông tin giải mã (userId, role) vào request
        next();
    } catch (error) {
        return res.status(403).json({ message: 'Token không hợp lệ hoặc đã hết hạn' });
    }
};

/**
 * Middleware kiểm tra quyền Admin
 */
const verifyAdmin = (req, res, next) => {
    if (req.user?.role !== 'admin') {
        return res.status(403).json({ message: 'Quyền truy cập bị từ chối: Chỉ dành cho Quản trị viên' });
    }
    next();
};

/**
 * Middleware kiểm tra quyền Librarian (Thủ thư)
 */
const verifyLibrarian = (req, res, next) => {
    if (req.user?.role !== 'librarian') {
        return res.status(403).json({ message: 'Quyền truy cập bị từ chối: Chỉ dành cho Thủ thư' });
    }
    next();
};

/**
 * Middleware cho phép cả Admin và Librarian
 */
const verifyAdminOrLibrarian = (req, res, next) => {
    const role = req.user?.role;
    if (role !== 'admin' && role !== 'librarian') {
        return res.status(403).json({ message: 'Quyền truy cập bị từ chối' });
    }
    next();
};

module.exports = { 
    verifyToken, 
    verifyAdmin, 
    verifyLibrarian, 
    verifyAdminOrLibrarian 
};
