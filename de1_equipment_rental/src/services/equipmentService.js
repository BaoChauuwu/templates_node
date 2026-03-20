const Equipment = require('../models/equipmentModel');

const createEquipmentService = async (equipmentData) => {
    const equipment = new Equipment(equipmentData);
    return await equipment.save();
};

const getAllEquipmentService = async () => {
    return await Equipment.find();
};

module.exports = {
    createEquipmentService,
    getAllEquipmentService
};
