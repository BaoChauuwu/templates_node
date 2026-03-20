const express = require('express')
const { getAllAppointment, createAppoinment, updateAppoinment } = require('../controllers/appoinmentController');
const router = express.Router()


router.get('/' , getAllAppointment);
router.post('/book', createAppoinment);
router.put('/:id/complete', updateAppoinment);

module.exports = router