const { getAllAppoinmentService, createAppoinmentService, updateAppoinmentService } = require('../services/appoinmentService');

const getAllAppointment = async (req, res) => {
    try {
        const result = await getAllAppoinmentService();
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const createAppoinment = async (req, res) => {
    try {
        const result = await createAppoinmentService(req.body);
        res.status(201).json(result);
    } catch (error) {
        res.status(error.status || 400).json({ message: error.message });
    }
}

const updateAppoinment = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await updateAppoinmentService(id);
        res.status(200).json(result);
    } catch (error) {
        res.status(error.status || 400).json({ message: error.message });
    }
}

module.exports = { getAllAppointment, createAppoinment, updateAppoinment };