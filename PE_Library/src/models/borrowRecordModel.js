const mongoose = require('mongoose');

// Định nghĩa Schema cho Bản ghi mượn sách
const borrowRecordSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Người chịu trách nhiệm (thủ thư)
    bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true }, // ID của sách được mượn
    memberName : { type: String, required: true }, // Tên thành viên mượn sách
    borrowDate : { type: Date, required: true }, // Ngày mượn
    returnDate : { type: Date }, // Ngày trả (không bắt buộc lúc ban đầu)
    totalFee : { type: Number, default: 0 }, // Tổng phí (được tính khi trả)
    note : { type: String } // Ghi chú thêm
});

module.exports = mongoose.model('BorrowRecord', borrowRecordSchema);