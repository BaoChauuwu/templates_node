const Registration = require("../models/registrationModel");

const registerEventService = async () => {
    try {
        const result = await Registration.find();
        if (result.length === 0) {
            return { message: "Result has not been found!" };
        }
        return result;
    } catch (error) {
        throw new Error(error.message);
    }
}

const deleteRegisterService = async (id) => {
    try {
        const result = await Registration.findByIdAndDelete(id);
        if (!result) {
            return null;
        }       
        return result;
    } catch (error) {
        throw new Error(error.message);
    }
}

const getRegistrationsByDateService = async (startDate, endDate) => {
    try {
        if (new Date(startDate) >= new Date(endDate)) {
            throw new Error("Registration date start must be earlier than registrationDate end.");
        }
        const result = await Registration.find({
            registrationDate: {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            }
        });
        return result;
    } catch (error) {
        throw new Error(error.message);
    }
}

module.exports = { 
    registerEventService, 
    deleteRegisterService, 
    getRegistrationsByDateService 
};
