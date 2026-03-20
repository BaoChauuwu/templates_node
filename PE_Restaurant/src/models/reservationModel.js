const mongoose = require('mongoose')

const reservationSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    tableId: { type: mongoose.Schema.Types.ObjectId, ref: 'Table', required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    totalAmount: { type: Number, required: true },
    note: { type: String }
})

module.exports = mongoose.model('Reservation', reservationSchema)