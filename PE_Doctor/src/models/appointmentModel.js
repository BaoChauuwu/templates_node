const express = require("express");
const mongoose = require("mongoose")

const appoinmentSchema = new mongoose.Schema({
    patientId : {type: mongoose.Schema.Types.ObjectId, ref: 'User'  },
    // required: true,
    // default: new mongoose.Types.ObjectId() Tự sinh một ID ngẫu nhiên nếu không truyền vào
    doctorId: {type:  mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true},
    patientName: {type: String, required: true},
    appointmentTime :{type: Date, required: true},
    completedAt: {type: Date, default: null},
    totalFee:{type:Number, default: 0},
    note:{type: String}
})

module.exports= mongoose.model("Appointment",appoinmentSchema)