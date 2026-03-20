const express = require('express');
const router = express.Router();
const { 
    getAllRecords, 
    borrowBook, 
    returnBook 
} = require('../controllers/recordController');
const { verifyToken } = require('../middlewares/authMiddleware');

/**
 * Route lấy danh sách bản ghi mượn sách
 * Admin: Lấy tất cả
 * Librarian: Chỉ lấy bản ghi do mình tạo
 */
router.get('/', verifyToken, getAllRecords);

/**
 * Route thực hiện mượn sách mới
 * Yêu cầu: Đã đăng nhập (Librarian hoặc Admin)
 */
router.post('/borrow', verifyToken, borrowBook);

/**
 * Route thực hiện trả sách
 * id: ID của bản ghi mượn sách
 */
router.put('/:id/return', verifyToken, returnBook);

module.exports = router;