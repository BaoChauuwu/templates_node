const express = require('express');
const { verifyToken, verifyAdmin } = require('../middlewares/authMiddleware');
const { getAllUsers, deleteUser } = require('../controllers/userController');
const router = express.Router();

router.get('/', verifyToken, verifyAdmin, getAllUsers);
router.delete('/:id', verifyToken, verifyAdmin, deleteUser);

module.exports = router;