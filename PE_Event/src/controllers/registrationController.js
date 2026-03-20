const { registerEventService, deleteRegisterService, getRegistrationsByDateService } = require('../services/registrationService')

const getAllRegister = async(req, res) => {
    try{
    const result = await registerEventService(req.body);
    if(!result){
        return res.status(404).json({ message: 'No registrations found' });
    }
    res.status(200).json(result);
    }
    catch(error){
        return res.status(500).json({ message: error.message });
    }
}
const deleteRegister = async(req, res) => {
    try{
        const {id} = req.params;
        const result = await deleteRegisterService(id);
        if(!result){
            return res.status(404).json({ message: 'Registration not found' });
        }
        res.status(200).json({ message: 'Registration deleted successfully' });
    }
    catch(error){
        return res.status(500).json({ message: error.message });
    }
}

const getRegistrationsByDate = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        if (!startDate || !endDate) {
            return res.status(400).json({ message: "startDate and endDate are required as query parameters." });
        }
        const result = await getRegistrationsByDateService(startDate, endDate);
        res.status(200).json(result);
    } catch (error) {
        return res.status(error.message === "Registration date start must be earlier than registrationDate end." ? 400 : 500).json({ message: error.message });
    }
}

module.exports={getAllRegister, deleteRegister, getRegistrationsByDate}