const express = require('express');
const { 
    verifyToken, 
    verifyAdmin, 
    verifyCustomer, 
    verifyAdminOrCustomer 
} = require('../middlewares/authMiddleware');
const { 
    createRental, 
    returnRental, 
    getAllRentals, 
    getRentalsByDate 
} = require('../controllers/rentalController');
const router = express.Router();

// 4.4. Get All Rentals (Admin sees all, Customer sees their own)
router.get('/', verifyToken, verifyAdminOrCustomer, (req, res, next) => {
    if (req.originalUrl.startsWith('/rentalsByDate')) {
        return getRentalsByDate(req, res);
    }
    return getAllRentals(req, res);
});

// 4.2. Create Rental Order
router.post('/', verifyToken, verifyAdminOrCustomer, createRental);

// 4.3. Return Equipment
router.patch('/:id/return', verifyToken, verifyAdmin, returnRental);

module.exports = router;
