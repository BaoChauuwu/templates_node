const express = require('express');
const { verifyToken, verifyAdminOrCustomer } = require('../middlewares/authMiddleware');
const { getAllReservations, createReservation, deleteReservation, updateReservation, getReservationById } = require('../controllers/reservationController');
const router = express.Router();

router.get('/',    verifyToken, verifyAdminOrCustomer, getAllReservations);
router.post('/',   verifyToken, verifyAdminOrCustomer, createReservation);
router.get('/:id', verifyToken, verifyAdminOrCustomer, getReservationById);
router.put('/:id', verifyToken, verifyAdminOrCustomer, updateReservation);
router.delete('/:id', verifyToken, verifyAdminOrCustomer, deleteReservation);

module.exports = router;