const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const Doctor = require('./src/models/doctorModel');
const Appointment = require('./src/models/appointmentModel');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/pe_doctor';

const seed = async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Xoá dữ liệu cũ
        await Doctor.deleteMany({});
        await Appointment.deleteMany({});
        console.log('🗑️  Cleared old data');

        // ─── DOCTORS ───────────────────────────────────────────────
        const doctors = await Doctor.insertMany([
            {
                doctorCode: 'DOC001',
                fullName: 'Dr. Nguyen Van An',
                specialty: 'Cardiology',
                status: 'available',
                consultationFee: 500000
            },
            {
                doctorCode: 'DOC002',
                fullName: 'Dr. Tran Thi Binh',
                specialty: 'Pediatrics',
                status: 'available',
                consultationFee: 300000
            },
            {
                doctorCode: 'DOC003',
                fullName: 'Dr. Le Van Cuong',
                specialty: 'Dermatology',
                status: 'on_leave',
                consultationFee: 400000
            }
        ]);
        console.log('👨‍⚕️ Doctors inserted:', doctors.map(d => d.fullName));

        // ─── APPOINTMENTS ──────────────────────────────────────────
        const appointments = await Appointment.insertMany([
            {
                doctorId: doctors[0]._id,
                patientName: 'Pham Minh Hoang',
                appointmentTime: new Date('2025-03-20T08:00:00Z'),
                completedAt: null,
                totalFee: 500000,
                note: 'Regular heart checkup'
            },
            {
                doctorId: doctors[1]._id,
                patientName: 'Le Thu Thao',
                appointmentTime: new Date('2025-03-20T10:30:00Z'),
                completedAt: new Date('2025-03-20T11:00:00Z'),
                totalFee: 300000,
                note: 'Fever and cough'
            },
            {
                doctorId: doctors[0]._id,
                patientName: 'Hoang Van Nam',
                appointmentTime: new Date('2025-03-21T14:00:00Z'),
                completedAt: null,
                totalFee: 500000,
                note: 'Follow-up visit'
            }
        ]);
        console.log('📋 Appointments inserted:', appointments.length, 'records');

        console.log('\n✅ Seed completed!');
        console.log('─────────────────────────────────────');
        console.log('Total Doctors     : ', doctors.length);
        console.log('Total Appointments: ', appointments.length);
        console.log('─────────────────────────────────────');

    } catch (error) {
        console.error('❌ Seed failed:', error);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
};

seed();
