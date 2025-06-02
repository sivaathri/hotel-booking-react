const RoomBooking = require('./Models');

// GET all bookings
const getAllBookings = async (req, res) => {
  try {
    const bookings = await RoomBooking.getAllBookings();
    res.status(200).json({ success: true, data: bookings });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET booking by ID
const getBookingById = async (req, res) => {
  try {
    const booking = await RoomBooking.getBookingById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.status(200).json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST create booking
const createBooking = async (req, res) => {
  try {
    const {
      user_id, property_id, rooms,
      first_name, last_name, email, phone_number, country
    } = req.body;

    if (!property_id || !rooms || rooms.length === 0 || !first_name || !last_name || !email || !phone_number || !country) {
      return res.status(400).json({ message: 'Required fields missing' });
    }

    const insertIds = [];

    for (const room of rooms) {
      const bookingData = {
        user_id,
        property_id,
        ...room,
        first_name,
        last_name,
        email,
        phone_number,
        country
      };

      const insertId = await RoomBooking.createBooking(bookingData);
      insertIds.push(insertId);
    }

    res.status(201).json({ success: true, insertIds });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// PUT update booking
const updateBooking = async (req, res) => {
  try {
    await RoomBooking.updateBooking(req.params.id, req.body);
    res.status(200).json({ success: true, message: 'Booking updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE booking
const deleteBooking = async (req, res) => {
  try {
    await RoomBooking.deleteBooking(req.params.id);
    res.status(200).json({ success: true, message: 'Booking deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllBookings,
  getBookingById,
  createBooking,
  updateBooking,
  deleteBooking
};
