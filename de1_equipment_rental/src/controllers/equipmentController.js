const { createEquipmentService, getAllEquipmentService } = require('../services/equipmentService');

const createEquipment = async (req, res) => {
    try {
        const equipment = await createEquipmentService(req.body);
        return res.status(201).json(equipment);
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

const getAllEquipment = async (req, res) => {
    try {
        const equipment = await getAllEquipmentService();
        return res.status(200).json(equipment);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

module.exports = { createEquipment, getAllEquipment };
