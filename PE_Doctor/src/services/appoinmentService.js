const mongoose = require('mongoose');
const Appointment = require("../models/appointmentModel");
const Doctor = require("../models/doctorModel");
//populate doctorId để lấy thông tin bác sĩ khi truy vấn appointment phải import model bác sĩ vào để mongoose biết cách populate
const getAllAppoinmentService = async () => {
    try {
        const appointments = await Appointment.find()
            .populate("doctorId", "fullName specialty consultationFee");
        return appointments;
    } catch (error) {
        throw new Error('Error fetching appointments: ' + error.message);
    }
}

const createAppoinmentService = async (data) => {
    try {
        const { doctorId, appointmentTime } = data;

        // 1. Validate appointmentTime must not be in the past
        if (new Date(appointmentTime) < new Date()) {
            throw new Error('Appointment time must not be in the past');
        }

        // 2. Check Doctor existence and status
        const doctor = await Doctor.findById(doctorId);
        if (!doctor) {
            throw new Error('Doctor not found');
        }
        if (doctor.status === "on_leave" || doctor.status === "retired") {
            const error = new Error('This doctor is currently unavailable.');
            error.status = 400; // or 403 as per prompt
            throw error;
        }

        // 3. Duplicate Appointment Check (Same doctor, same time, not completed)
        const existingAppointment = await Appointment.findOne({
            doctorId,
            appointmentTime: new Date(appointmentTime),
            completedAt: null
        });
        if (existingAppointment) {
            const error = new Error('This doctor already has an appointment at the requested time.');
            error.status = 409;
            throw error;
        }

        // 4. Save appointment (patientId hardcoded server-side as per prompt)
        const newAppointment = new Appointment({
            ...data,
            patientId: new mongoose.Types.ObjectId(), // Hardcoded/Derive server-side
            completedAt: null,
            totalFee: 0
        });

        await newAppointment.save();
        return await Appointment.findById(newAppointment._id).populate("doctorId", "fullName specialty consultationFee");
    } catch (error) {
        throw error;
    }
}

const updateAppoinmentService = async (id) => {
    try {
        const appointment = await Appointment.findById(id).populate("doctorId");

        if (!appointment) {
            const error = new Error('Appointment not found');
            error.status = 404;
            throw error;
        }

        if (appointment.completedAt) {
            const error = new Error('This appointment has already been completed.');
            error.status = 400;
            throw error;
        }

        // Calculate fee from doctor's consultationFee
        appointment.completedAt = new Date();
        appointment.totalFee = appointment.doctorId.consultationFee;

        await appointment.save();

        // Return with populated doctor again (to match format)
        return await Appointment.findById(id).populate("doctorId", "fullName specialty consultationFee");
    } catch (error) {
        throw error;
    }
}

module.exports = { getAllAppoinmentService, createAppoinmentService, updateAppoinmentService };