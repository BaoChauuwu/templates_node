const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

    if (!token) {
        return res.status(401).json({ message: 'Access token is missing' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(403).json({ message: 'Invalid or expired token' });
    }
};

const verifyAdmin = (req, res, next) => {
    if (req.user?.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied: Admins only' });
    }
    next();
};

const verifyCustomer = (req, res, next) => {
    if (req.user?.role !== 'customer') {
        return res.status(403).json({ message: 'Access denied: Customers only' });
    }
    next();
};

const verifyAdminOrCustomer = (req, res, next) => {
    if (req.user?.role !== 'admin' && req.user?.role !== 'customer') {
        return res.status(403).json({ message: 'Access denied' });
    }
    next();
};

module.exports = { verifyToken, verifyAdmin, verifyCustomer, verifyAdminOrCustomer };
