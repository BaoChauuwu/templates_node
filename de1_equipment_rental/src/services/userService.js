const User = require('../models/userModel');
const Rental = require('../models/rentalModel');

const getAllUsersService = async () => {
    return await User.find();
};

const deleteUserService = async (userId) => {
    const activeRentals = await Rental.findOne({ userId, status: 'active' });
    if (activeRentals) {
        throw new Error('Cannot delete users with active rentals.');
    }
    return await User.findByIdAndDelete(userId);
};

module.exports = {
    getAllUsersService,
    deleteUserService
};
