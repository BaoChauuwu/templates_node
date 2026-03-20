const Record = require("../models/borrowRecordModel");
const Book = require("../models/bookModel");

/**
 * Lấy tất cả bản ghi mượn sách
 * Admin: Lấy hết
 * Librarian: Chỉ lấy bản ghi do mình tạo
 */
const getAllRecordsService = async (user) => {
    if (user.role === 'admin') {
        return await Record.find().populate('bookId').populate('userId');
    } else {
        return await Record.find({ userId: user.userId }).populate('bookId');
    }
}

/**
 * Xử lý mượn sách
 */
const borrowBookService = async (borrowData, userId) => {
    const { bookId, memberName, borrowDate, note } = borrowData;

    // 1. Kiểm tra ngày mượn không được ở quá khứ
    const inputDate = new Date(borrowDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (inputDate < today) {
        throw { status: 400, message: "Ngày mượn không được ở trong quá khứ." };
    }

    // 2. Kiểm tra trạng thái sách
    const book = await Book.findById(bookId);
    if (!book) {
        throw { status: 404, message: "Không tìm thấy sách." };
    }

    if (book.status === 'lost') {
        throw { status: 403, message: "Sách này đã bị mất, không thể mượn." };
    }

    if (book.status === 'borrowed') {
        throw { status: 409, message: "This book is currently borrowed." };
    }

    // 3. Kiểm tra mượn trùng lặp (nấc cao)
    // "Một thành viên không thể mượn nhiều hơn một bản sao của cùng một cuốn sách cùng lúc."
    // Theo đề bài: Tìm bản ghi có bookId và returnDate = null
    const existingBorrow = await Record.findOne({ bookId: bookId, returnDate: null });
    if (existingBorrow) {
        throw { status: 409, message: "This book is already borrowed." };
    }

    // 4. Tạo bản ghi mượn mới
    const newRecord = new Record({
        userId, // Lấy từ JWT
        bookId,
        memberName,
        borrowDate: inputDate,
        note
    });

    await newRecord.save();

    // 5. Cập nhật trạng thái sách
    book.status = 'borrowed';
    await book.save();

    return newRecord;
}

/**
 * Xử lý trả sách
 */
const returnBookService = async (recordId) => {
    const record = await Record.findById(recordId);
    if (!record) {
        throw { status: 404, message: "Không tìm thấy bản ghi mượn sách." };
    }

    // Kiểm tra nếu đã trả rồi
    if (record.returnDate) {
        throw { status: 400, message: "Sách này đã được trả trước đó." };
    }

    const book = await Book.findById(record.bookId);
    if (!book) {
        throw { status: 404, message: "Không tìm thấy thông tin sách liên quan." };
    }

    // 1. Thiết lập ngày trả là hiện tại
    const returnDate = new Date();
    record.returnDate = returnDate;

    // 2. Tính toán thời gian mượn (số ngày)
    const diffTime = Math.abs(returnDate - record.borrowDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    // Đề bài yêu cầu: Phải xử lý đúng các ngày lẻ (ví dụ: 1.5 ngày -> làm tròn lên 2)
    // Math.ceil đã xử lý việc này.

    // 3. Tính tổng phí
    record.totalFee = diffDays * book.borrowFeePerDay;

    await record.save();

    // 4. Cập nhật trạng thái sách thành 'available'
    book.status = 'available';
    await book.save();

    return record;
}

module.exports = { 
    getAllRecordsService, 
    borrowBookService, 
    returnBookService 
};