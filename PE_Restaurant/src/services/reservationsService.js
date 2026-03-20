const Reservation = require('../models/reservationModel');
const Table = require('../models/tableModel');

const getAllReservationsService = async (role, userId, tableStatus) => {
    const filter = role === 'admin' ? {} : { userId };

    // Nếu có query ?tableStatus= thì lọc theo status của bàn
    if (tableStatus) {
        const matchingTables = await Table.find({ status: tableStatus }).select('_id');
        const tableIds = matchingTables.map(t => t._id);
        filter.tableId = { $in: tableIds };
    }

    const reservations = await Reservation.find(filter)
        .populate('userId', 'username')
        .populate('tableId', 'tableCode type pricePerHour status');
    return reservations;
}

const createReservationService = async (userId, tableId, startTime, endTime, note) => {
    const start = new Date(startTime);
    const end = new Date(endTime);
    const now = new Date();

    // 1. Validate startTime < endTime
    if (start >= end) {
        throw { status: 400, message: 'startTime must be strictly earlier than endTime' };
    }

    // 2. Validate startTime not in the past
    if (start < now) {
        throw { status: 400, message: 'startTime cannot be in the past' };
    }

    // 3. Check table exists & status
    const table = await Table.findById(tableId);
    if (!table) {
        throw { status: 404, message: 'Table not found' };
    }
    if (table.status === 'maintenance') {
        throw { status: 403, message: 'This table is currently unavailable due to maintenance' };
    }

    // 4. Check overlap conflict: (S_new < E_old) AND (E_new > S_old)
    const conflict = await Reservation.findOne({
        tableId,
        startTime: { $lt: end },
        endTime:   { $gt: start }
    });
    if (conflict) {
        throw { status: 409, message: 'The selected table is already reserved for the requested time period.' };
    }

    // 5. Auto-calculate totalAmount (supports partial hours)
    const hours = (end - start) / (1000 * 60 * 60);
    const totalAmount = hours * table.pricePerHour;

    // 6. Create reservation
    const reservation = new Reservation({
        userId,
        tableId,
        startTime: start,
        endTime: end,
        totalAmount,
        note
    });
    await reservation.save();
    return reservation;
}

const deleteReservationService = async (id, role, userId) => {
    const reservation = await Reservation.findById(id);
    if (!reservation) {
        throw { status: 404, message: 'Reservation not found' };
    }
    // Chỉ admin hoặc chủ reservation mới được xóa
    if (role !== 'admin' && reservation.userId.toString() !== userId) {
        throw { status: 403, message: 'Access denied: you can only delete your own reservation' };
    }
    await reservation.deleteOne();
    return { message: 'Reservation deleted successfully' };
}

const updateReservationService = async (id, role, userId, data) => {
    const reservation = await Reservation.findById(id);
    if (!reservation) {
        throw { status: 404, message: 'Reservation not found' };
    }
    // Chỉ admin hoặc chủ reservation mới được sửa
    if (role !== 'admin' && reservation.userId.toString() !== userId) {
        throw { status: 403, message: 'Access denied: you can only update your own reservation' };
    }

    const start = new Date(data.startTime || reservation.startTime);
    const end   = new Date(data.endTime   || reservation.endTime);
    const now   = new Date();

    // Validate thời gian
    if (start >= end) {
        throw { status: 400, message: 'startTime must be strictly earlier than endTime' };
    }
    if (start < now) {
        throw { status: 400, message: 'startTime cannot be in the past' };
    }

    // Kiểm tra bàn (dùng tableId mới nếu có, không thì giữ cũ)
    const tableId = data.tableId || reservation.tableId;
    const table = await Table.findById(tableId);
    if (!table) throw { status: 404, message: 'Table not found' };
    if (table.status === 'maintenance') {
        throw { status: 403, message: 'This table is currently unavailable due to maintenance' };
    }

    // Kiểm tra conflict (loại trừ chính reservation đang sửa)
    const conflict = await Reservation.findOne({
        _id: { $ne: id },
        tableId,
        startTime: { $lt: end },
        endTime:   { $gt: start }
    });
    if (conflict) {
        throw { status: 409, message: 'The selected table is already reserved for the requested time period.' };
    }

    // Tính lại totalAmount
    const hours = (end - start) / (1000 * 60 * 60);
    const totalAmount = hours * table.pricePerHour;

    const updated = await Reservation.findByIdAndUpdate(
        id,
        { ...data, startTime: start, endTime: end, totalAmount },
        { new: true }
    );
    return updated;
}

const getReservationByIdService = async (id, role, userId) => {
    const reservation = await Reservation.findById(id)
        .populate('userId', 'username')
        .populate('tableId', 'tableCode type capacity pricePerHour features');
    if (!reservation) {
        throw { status: 404, message: 'Reservation not found' };
    }
    // Customer chỉ xem được của mình
    if (role !== 'admin' && reservation.userId._id.toString() !== userId) {
        throw { status: 403, message: 'Access denied: you can only view your own reservation' };
    }
    return reservation;
}

module.exports = { getAllReservationsService, createReservationService, deleteReservationService, updateReservationService, getReservationByIdService };