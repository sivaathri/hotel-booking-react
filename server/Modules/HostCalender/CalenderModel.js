const db = require('../../config/db'); // adjust path as needed

class CalenderModel {
  static async createPricing(data) {
    try {
      const [result] = await db.query(
        `INSERT INTO room_guest_pricing_dates 
        (room_id, room_type, pricing_date, adults, price, currency, child_age_from, child_age_to, child_price, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        [
          data.room_id,
          data.room_type,
          data.pricing_date,
          data.adults,
          data.price,
          data.currency,
          data.child_age_from,
          data.child_age_to,
          data.child_price
        ]
      );

      return { id: result.insertId, ...data };
    } catch (error) {
      console.error('Error creating pricing:', error);
      throw error;
    }
  }

  
  
  
}

module.exports = CalenderModel;
