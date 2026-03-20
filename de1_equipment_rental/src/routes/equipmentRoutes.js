const express = require('express');
const { verifyToken, verifyAdmin } = require('../middlewares/authMiddleware');
const { createEquipment, getAllEquipment } = require('../controllers/equipmentController');
const router = express.Router();

router.post('/', verifyToken, verifyAdmin, createEquipment);
router.get('/', getAllEquipment);

module.exports = router;
