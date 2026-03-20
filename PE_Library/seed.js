const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

const User = require('./src/models/userModel');
const Book = require('./src/models/bookModel');
const BorrowRecord = require('./src/models/borrowRecordModel');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/pe_library';

const seed = async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Đã kết nối MongoDB');

        // Xoá dữ liệu cũ
        await User.deleteMany({});
        await Book.deleteMany({});
        await BorrowRecord.deleteMany({});
        console.log('🗑️  Đã xoá dữ liệu cũ');

        // ─── TẠO NGƯỜI DÙNG ───────────────────────────────────────────────
        const hashedPassword = await bcrypt.hash('123456', 10);

        const users = await User.insertMany([
            { username: 'admin1', password: hashedPassword, role: 'admin' },
            { username: 'librarian1', password: hashedPassword, role: 'librarian' },
            { username: 'librarian2', password: hashedPassword, role: 'librarian' },
        ]);
        console.log('👤 Đã tạo người dùng:', users.map(u => u.username));

        // ─── TẠO SÁCH ───────────────────────────────────────────────
        const books = await Book.insertMany([
            {
                isbn: '978-0-13-110362-7',
                title: 'The C Programming Language',
                author: 'Brian W. Kernighan',
                category: 'Programming',
                status: 'available',
                borrowFeePerDay: 5000,
            },
            {
                isbn: '978-0-13-468599-1',
                title: 'Clean Code',
                author: 'Robert C. Martin',
                category: 'Software Engineering',
                status: 'borrowed', // Đặt là borrowed để test logic
                borrowFeePerDay: 10000,
            },
            {
                isbn: '978-0-20-163361-0',
                title: 'Design Patterns',
                author: 'Erich Gamma',
                category: 'Design Patterns',
                status: 'available',
                borrowFeePerDay: 7000,
            },
            {
                isbn: '978-0-59-651798-1',
                title: 'JavaScript: The Definitive Guide',
                author: 'David Flanagan',
                category: 'Programming',
                status: 'available',
                borrowFeePerDay: 12000,
            },
            {
                isbn: '978-1-11-123456-7',
                title: 'Lost in History',
                author: 'Unknown',
                category: 'History',
                status: 'lost', // Test trường hợp sách bị mất
                borrowFeePerDay: 8000,
            }
        ]);
        console.log('📚 Đã tạo sách:', books.map(b => b.title));

        // ─── TẠO BẢN GHI MƯỢN SÁCH ───────────────────────
        const records = await BorrowRecord.insertMany([
            {
                userId: users[1]._id,           // librarian1
                bookId: books[1]._id,           // Clean Code
                memberName: 'Nguyen Van A',
                borrowDate: new Date('2025-03-10'),
                returnDate: null,               // Đang mượn (để test API trả sách)
                totalFee: 0,
                note: 'Sách mới mượn',
            },
            {
                userId: users[2]._id,           // librarian2
                bookId: books[0]._id,           // C Programming
                memberName: 'Tran Thi B',
                borrowDate: new Date('2025-03-12'),
                returnDate: new Date('2025-03-15'),
                totalFee: 15000,
                note: 'Đã trả xong',
            }
        ]);
        console.log('📋 Đã tạo bản ghi mượn:', records.length, 'records');

        console.log('\n✅ Hoàn tất Seed dữ liệu!');
        console.log('─────────────────────────────────────');
        console.log('Admin     → username: admin1     | password: 123456');
        console.log('Librarian → username: librarian1 | password: 123456');
        console.log('─────────────────────────────────────');

    } catch (error) {
        console.error('❌ Thất bại:', error);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
};

seed();
