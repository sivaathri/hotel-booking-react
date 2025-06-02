const express = require('express');
const router = express.Router();
const RoomBookingController = require('./Controller');

// GET all bookings
router.get('/', RoomBookingController.getAllBookings);

// GET single booking by ID
router.get('/:id', RoomBookingController.getBookingById);

// POST create booking
router.post('/', RoomBookingController.createBooking);

// PUT update booking
router.put('/:id', RoomBookingController.updateBooking);

// DELETE booking
router.delete('/:id', RoomBookingController.deleteBooking);

module.exports = router;
