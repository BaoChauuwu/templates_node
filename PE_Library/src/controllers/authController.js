const { loginUserService, registerUserService } = require('../services/authService');

/**
 * Controller xử lý đăng nhập
 */
const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ message: 'Người dùng và mật khẩu là bắt buộc' });
        }
        const result = await loginUserService(username, password);
        return res.status(200).json(result);
    } catch (error) {
        return res.status(401).json({ message: error.message });
    }
};

/**
 * Controller xử lý đăng ký tài khoản mới
 */
const registerUser = async (req, res) => {
    try {
        const { username, password, role } = req.body;
        if (!username || !password) {
            return res.status(400).json({ message: 'Tên đăng nhập và mật khẩu là bắt buộc' });
        }
        const result = await registerUserService(username, password, role);
        return res.status(201).json(result);
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

module.exports = { loginUser, registerUser };