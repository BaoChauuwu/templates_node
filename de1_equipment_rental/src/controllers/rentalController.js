const {
    createRentalService,
    returnRentalService,
    getAllRentalsService,
    getRentalsByDateService
} = require('../services/rentalService');

// 4.2. Create Rental Order
const createRental = async (req, res) => {
    try {
        const rental = await createRentalService(req.body, req.user.id);
        return res.status(201).json(rental);
    } catch (error) {
        if (error.message === 'Not enough stock available.') {
            return res.status(400).json({ message: error.message });
        }
        return res.status(500).json({ message: error.message });
    }
};

// 4.3. Return Equipment
const returnRental = async (req, res) => {
    try {
        const rental = await returnRentalService(req.params.id);
        return res.status(200).json(rental);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// 4.4. Get All Rentals
const getAllRentals = async (req, res) => {
    try {
        const rentals = await getAllRentalsService(req.user);
        return res.status(200).json(rentals);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// 4.5. Search Rentals by Date Range
const getRentalsByDate = async (req, res) => {
    try {
        const { start, end } = req.query;
        if (!start || !end) {
            return res.status(400).json({ message: 'Invalid date range.' });
        }
        const rentals = await getRentalsByDateService(start, end, req.user);
        return res.status(200).json(rentals);
    } catch (error) {
        if (error.message === 'Invalid date range.') {
            return res.status(400).json({ message: error.message });
        }
        return res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createRental,
    returnRental,
    getAllRentals,
    getRentalsByDate
};
