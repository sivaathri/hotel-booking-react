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
      property_id,
      checkInDate,
      checkOutDate,
      totalPrice,
      userDetails,
      roomsBooked
    } = req.body;

    const requiredFields = {
      property_id,
      checkInDate,
      checkOutDate,
      totalPrice,
      first_name: userDetails?.firstName,
      last_name: userDetails?.lastName,
      email: userDetails?.email,
      phone_number: userDetails?.phone,
      country: userDetails?.country
    };

    const missingFields = Object.entries(requiredFields)
      .filter(([_, value]) => !value)
      .map(([key]) => key);

    if (missingFields.length > 0) {
      return res.status(400).json({ message: `Required fields missing: ${missingFields.join(', ')}` });
    }

    const insertIds = [];

    for (const room of roomsBooked) {
      const bookingData = {
        user_id: req.user?.id || null,
        property_id,
        room_type: room.room_type,
        room_number: room.roomId,
        number_of_rooms_Book: room.count,
        adults: req.body.guests?.adults || 0,
        children: req.body.guests?.children || 0,
        check_in_date: checkInDate,
        check_out_date: checkOutDate,
        total_price: room.count * room.pricePerNight * req.body.numberOfNights,
        payment_status: "pending",
        payment_method: "online",
        instant_payment: 0,
        free_cancellation: 0,
        first_name: userDetails.firstName,
        last_name: userDetails.lastName,
        email: userDetails.email,
        phone_number: userDetails.phone,
        country: userDetails.country,
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
