const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/**
 * Xử lý đăng nhập người dùng
 * @param {string} username Tên đăng nhập
 * @param {string} password Mật khẩu
 * @returns {Promise<{token: string, user: {userId: string, username: string, role: string}}} Kết quả đăng nhập
 */
const loginUserService = async (username, password) => {
    const user = await User.findOne({ username });
    if (!user) {
        throw new Error('Tên đăng nhập hoặc mật khẩu không chính xác');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error('Tên đăng nhập hoặc mật khẩu không chính xác');
    }

    // Tạo JWT Token bao gồm userId và role như yêu cầu
    const token = jwt.sign(
        { userId: user._id, role: user.role }, // Payload: userId và role
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
    );

    return { 
        token, 
        user: { userId: user._id, username: user.username, role: user.role } 
    };
}

/**
 * Xử lý đăng ký người dùng mới
 * @param {string} username Tên đăng nhập
 * @param {string} password Mật khẩu (sẽ được băm)
 * @param {string} role Quyền người dùng (mặc định: librarian)
 * @returns {Promise<{message: string}>} Thông báo thành công
 */
const registerUserService = async (username, password, role = 'librarian') => {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
        throw new Error('Tên người dùng đã tồn tại');
    }

    // Băm mật khẩu để bảo mật
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ 
        username, 
        password: hashedPassword, 
        role: role || 'librarian' // Đảm bảo quyền mặc định là 'librarian'
    });

    await newUser.save();
    return { message: 'Đăng ký người dùng thành công' };
};

module.exports = { loginUserService, registerUserService };