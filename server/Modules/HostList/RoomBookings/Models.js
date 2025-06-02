const db = require('../../../config/db'); // Adjust path as needed

class RoomBooking {
  static async getAllBookings() {
    const [rows] = await db.query('SELECT * FROM room_bookings');
    return rows;
  }

  static async getBookingById(id) {
    const [rows] = await db.query('SELECT * FROM room_bookings WHERE booking_id = ?', [id]);
    return rows[0];
  }

  static async createBooking(data) {
    const {
      user_id, property_id, room_type, room_number,
      number_of_rooms_Book, adults, children,
      check_in_date, check_out_date, total_price,
      payment_status, payment_method, instant_payment,
      free_cancellation, first_name, last_name,
      email, phone_number, country
    } = data;

    const [result] = await db.query(
      `INSERT INTO room_bookings (
        user_id, property_id, room_type, room_number,
        number_of_rooms_Book, adults, children,
        check_in_date, check_out_date, total_price,
        payment_status, payment_method, instant_payment,
        free_cancellation, first_name, last_name,
        email, phone_number, country
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        user_id, property_id, room_type, room_number,
        number_of_rooms_Book, adults, children,
        check_in_date, check_out_date, total_price,
        payment_status, payment_method, instant_payment,
        free_cancellation, first_name, last_name,
        email, phone_number, country
      ]
    );

    return result.insertId;
  }

  static async updateBooking(id, data) {
    const {
      user_id, property_id, room_type, room_number,
      number_of_rooms_Book, adults, children,
      check_in_date, check_out_date, total_price,
      payment_status, payment_method, instant_payment,
      free_cancellation, first_name, last_name,
      email, phone_number, country
    } = data;

    const [result] = await db.query(
      `UPDATE room_bookings SET
        user_id = ?, property_id = ?, room_type = ?, room_number = ?,
        number_of_rooms_Book = ?, adults = ?, children = ?,
        check_in_date = ?, check_out_date = ?, total_price = ?,
        payment_status = ?, payment_method = ?, instant_payment = ?,
        free_cancellation = ?, first_name = ?, last_name = ?,
        email = ?, phone_number = ?, country = ?
      WHERE booking_id = ?`,
      [
        user_id, property_id, room_type, room_number,
        number_of_rooms_Book, adults, children,
        check_in_date, check_out_date, total_price,
        payment_status, payment_method, instant_payment,
        free_cancellation, first_name, last_name,
        email, phone_number, country,
        id
      ]
    );

    return result;
  }

  static async deleteBooking(id) {
    const [result] = await db.query('DELETE FROM room_bookings WHERE booking_id = ?', [id]);
    return result;
  }
}

module.exports = RoomBooking;
