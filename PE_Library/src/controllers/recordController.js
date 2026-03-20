const { 
    getAllRecordsService, 
    borrowBookService, 
    returnBookService 
} = require("../services/recordService");

/**
 * Lấy danh sách bản ghi mượn sách
 */
const getAllRecords = async (req, res) => {
    try {
        const { user } = req;
        const result = await getAllRecordsService(user);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

/**
 * Xử lý mượn sách mới
 */
const borrowBook = async (req, res) => {
    try {
        const { userId } = req.user; // Lấy userId từ JWT thông qua middleware
        const result = await borrowBookService(req.body, userId);
        res.status(201).json({
            message: "Mượn sách thành công",
            data: result
        });
    } catch (error) {
        const status = error.status || 500;
        res.status(status).json({ message: error.message });
    }
}

/**
 * Xử lý trả sách
 */
const returnBook = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await returnBookService(id);
        res.status(200).json({
            message: "Trả sách thành công",
            data: result
        });
    } catch (error) {
        const status = error.status || 500;
        res.status(status).json({ message: error.message });
    }
}

module.exports = { 
    getAllRecords, 
    borrowBook, 
    returnBook 
};