const Rental = require('../models/rentalModel');
const Equipment = require('../models/equipmentModel');

const createRentalService = async (rentalData, userId) => {
    const { equipmentId, startDate, endDate, quantity } = rentalData;

    const equipment = await Equipment.findById(equipmentId);
    if (!equipment) {
        throw new Error('Equipment not found');
    }

    if (equipment.stockQuantity < quantity) {
        throw new Error('Not enough stock available.');
    }

    const deposit = equipment.depositFee * quantity;
    const rental = new Rental({
        userId,
        equipmentId,
        startDate,
        endDate,
        quantity,
        deposit,
        status: 'active'
    });

    // Deduct stock
    equipment.stockQuantity -= quantity;
    await equipment.save();
    return await rental.save();
};

const returnRentalService = async (rentalId) => {
    const rental = await Rental.findById(rentalId).populate('equipmentId');

    if (!rental) {
        throw new Error('Rental record not found');
    }

    if (rental.status === 'returned') {
        throw new Error('Equipment already returned');
    }

    const actualReturnDate = new Date();
    const endDate = new Date(rental.endDate);
    let fineAmount = 0;

    if (actualReturnDate > endDate) {
        const diffTime = Math.abs(actualReturnDate - endDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        fineAmount = 0.1 * rental.equipmentId.pricePerDay * diffDays * rental.quantity;
    }

    rental.status = 'returned';
    rental.fineAmount = fineAmount;
    await rental.save();

    // Restore stock
    const equipment = await Equipment.findById(rental.equipmentId._id);
    equipment.stockQuantity += rental.quantity;
    await equipment.save();

    return rental;
};

const getAllRentalsService = async (user) => {
    let query = {};
    if (user.role === 'customer') {
        query.userId = user.id;
    }
    return await Rental.find(query).populate('equipmentId').populate('userId', 'username');
};

const getRentalsByDateService = async (start, end, user) => {
    const startDate = new Date(start);
    const endDate = new Date(end);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        throw new Error('Invalid date range.');
    }

    let query = {
        rentalDate: {
            $gte: startDate,
            $lte: endDate
        }
    };

    if (user.role === 'customer') {
        query.userId = user.id;
    }

    return await Rental.find(query).populate('equipmentId').populate('userId', 'username');
};

module.exports = {
    createRentalService,
    returnRentalService,
    getAllRentalsService,
    getRentalsByDateService
};
