const { getAllUsersService, deleteUserService } = require('../services/userService');

const getAllUsers = async (req, res) => {
    try {
        const users = await getAllUsersService();
        return res.status(200).json(users);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        await deleteUserService(id);
        return res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        if (error.message === 'Cannot delete users with active rentals.') {
            return res.status(400).json({ message: error.message });
        }
        return res.status(500).json({ message: error.message });
    }
}

module.exports = { getAllUsers, deleteUser };