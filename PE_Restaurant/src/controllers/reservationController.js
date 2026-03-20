const { getAllReservationsService, createReservationService, deleteReservationService, updateReservationService, getReservationByIdService } = require("../services/reservationsService");

const getAllReservations = async (req, res) => {
    try {
        const { id: userId, role } = req.user;
        const { tableStatus } = req.query; // ?tableStatus=available | maintenance
        const result = await getAllReservationsService(role, userId, tableStatus);
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const createReservation = async (req, res) => {
    try {
        const userId = req.user.id;
        const { tableId, startTime, endTime, note } = req.body;
        if (!tableId || !startTime || !endTime) {
            return res.status(400).json({ message: 'tableId, startTime and endTime are required' });
        }
        const result = await createReservationService(userId, tableId, startTime, endTime, note);
        return res.status(201).json(result);
    } catch (error) {
        return res.status(error.status || 500).json({ message: error.message });
    }
}

const deleteReservation = async (req, res) => {
    try {
        const { id } = req.params;
        const { id: userId, role } = req.user;
        const result = await deleteReservationService(id, role, userId);
        return res.status(200).json(result);
    } catch (error) {
        return res.status(error.status || 500).json({ message: error.message });
    }
}

const updateReservation = async (req, res) => {
    try {
        const { id } = req.params;
        const { id: userId, role } = req.user;
        const result = await updateReservationService(id, role, userId, req.body);
        return res.status(200).json(result);
    } catch (error) {
        return res.status(error.status || 500).json({ message: error.message });
    }
}

const getReservationById = async (req, res) => {
    try {
        const { id } = req.params;
        const { id: userId, role } = req.user;
        const result = await getReservationByIdService(id, role, userId);
        return res.status(200).json(result);
    } catch (error) {
        return res.status(error.status || 500).json({ message: error.message });
    }
}

module.exports = { getAllReservations, createReservation, deleteReservation, updateReservation, getReservationById };
