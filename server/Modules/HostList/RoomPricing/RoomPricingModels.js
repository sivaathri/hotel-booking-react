const db = require('../../../config/db') // assuming db is already configured

class RoomPricing {
  static async createRoomPricing(data) {
    const { property_id, floor, room_type, number_of_rooms, total_capacity, base_price, occupancy_price_adjustments, instant_payment_enabled, free_cancellation_enabled, refundable1, days_before1, refund_percent1, refundable2, days_before2, refund_percent2, refundable3, days_before3, refund_percent3 } = data;

    const query = `
      INSERT INTO room_pricing_availability (
        property_id, floor, room_type, number_of_rooms, total_capacity, base_price, occupancy_price_adjustments,
        instant_payment_enabled, free_cancellation_enabled, refundable1, days_before1, refund_percent1,
        refundable2, days_before2, refund_percent2, refundable3, days_before3, refund_percent3
      ) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const [result] = await db.query(query, [
      property_id, floor, room_type, number_of_rooms, total_capacity, base_price, JSON.stringify(occupancy_price_adjustments),
      instant_payment_enabled, free_cancellation_enabled, refundable1, days_before1, refund_percent1,
      refundable2, days_before2, refund_percent2, refundable3, days_before3, refund_percent3
    ]);

    return { id: result.insertId, ...data };
  }

  // Additional methods for fetching or updating can be added
}

module.exports = RoomPricing;
