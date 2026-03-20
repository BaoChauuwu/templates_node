const mongoose = require('mongoose');

// Định nghĩa Schema cho Sách
const bookSchema = new mongoose.Schema({
    isbn : { type: String, required: true, unique: true }, // Mã số sách duy nhất
    title : { type: String, required: true }, // Tiêu đề sách
    author : { type: String, required: true }, // Tác giả
    category : { type: String, required: true }, // Thể loại
    status: { type: String, enum: ['available', 'borrowed', 'lost'], default: 'available' }, // Trạng thái sách
    borrowFeePerDay : { type: Number, required: true } // Phí mượn theo ngày
});

module.exports = mongoose.model('Book', bookSchema);