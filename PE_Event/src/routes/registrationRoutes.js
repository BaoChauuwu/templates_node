const express = require('express');
const { verifyToken, verifyAdmin } = require('../middlewares/authMiddleware');
const { getAllRegister, getRegistrationsByDate, deleteRegister } = require('../controllers/registrationController');
const router = express.Router();

router.get('/', verifyToken, verifyAdmin, getAllRegister)
router.get('/getRegistrationsByDate', verifyToken, verifyAdmin, getRegistrationsByDate)
router.delete('/:id', verifyToken, verifyAdmin, deleteRegister)
module.exports = router;