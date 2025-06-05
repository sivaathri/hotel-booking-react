const db = require('../../../config/db') // assuming db is already configured

class RoomPricing {
  static async createRoomPricing(data) {
    const {
      id,
      property_id, floor, room_type, number_of_rooms, room_capacity_adults, room_capacity_children,
      total_capacity, base_price, occupancy_price_adjustments, child_pricing, instant_payment_enabled, 
      free_cancellation_enabled, refundable1, days_before1, refund_percent1, refundable2, days_before2, 
      refund_percent2, refundable3, days_before3, refund_percent3, individual_room_capacities
    } = data;

    // Helper functions to sanitize numbers
    const sanitizeInt = (val) => {
      const num = parseInt(val);
      return isNaN(num) ? null : num;
    };

    const sanitizeFloat = (val) => {
      const num = parseFloat(val);
      return isNaN(num) ? null : num;
    };

    try {
      // Parse individual_room_capacities if needed
      let parsedRoomCapacities;
      try {
        parsedRoomCapacities = typeof individual_room_capacities === 'string'
          ? individual_room_capacities
          : JSON.stringify(individual_room_capacities || []);
      } catch (e) {
        console.error('Error parsing individual_room_capacities:', e);
        parsedRoomCapacities = '[]';
      }

      const formattedData = {
        id: (id), // if id is provided, else null if auto-incremented
        property_id: sanitizeInt(property_id),
        floor: (floor),
        room_type: String(room_type || ''),
        number_of_rooms: sanitizeInt(number_of_rooms),
        room_capacity_adults: sanitizeInt(room_capacity_adults || 0),
        room_capacity_children: sanitizeInt(room_capacity_children || 0),
        total_capacity: sanitizeInt(total_capacity || 0),
        base_price: sanitizeFloat(base_price || 0),
        occupancy_price_adjustments: typeof occupancy_price_adjustments === 'string' 
          ? occupancy_price_adjustments 
          : JSON.stringify(occupancy_price_adjustments || []),
        child_pricing: typeof child_pricing === 'string' 
          ? child_pricing 
          : JSON.stringify(child_pricing || []),
        instant_payment_enabled: instant_payment_enabled ? 1 : 0,
        free_cancellation_enabled: free_cancellation_enabled ? 1 : 0,
        refundable1: refundable1 ? 1 : 0,
        days_before1: sanitizeInt(days_before1),
        refund_percent1: sanitizeFloat(refund_percent1),
        refundable2: refundable2 ? 1 : 0,
        days_before2: sanitizeInt(days_before2),
        refund_percent2: sanitizeFloat(refund_percent2),
        refundable3: refundable3 ? 1 : 0,
        days_before3: sanitizeInt(days_before3),
        refund_percent3: sanitizeFloat(refund_percent3),
        individual_room_capacities: parsedRoomCapacities
      };

      // Your insert query remains unchanged
      const query = `
        INSERT INTO room_pricing_availability (
          id, property_id, floor, room_type, number_of_rooms, room_capacity_adults, room_capacity_children,
          total_capacity, base_price, occupancy_price_adjustments, child_pricing, instant_payment_enabled,
          free_cancellation_enabled, refundable1, days_before1, refund_percent1, refundable2, days_before2,
          refund_percent2, refundable3, days_before3, refund_percent3, individual_room_capacities
        ) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
      
      const [result] = await db.query(query, [
        formattedData.id,
        formattedData.property_id,
        formattedData.floor,
        formattedData.room_type,
        formattedData.number_of_rooms,
        formattedData.room_capacity_adults,
        formattedData.room_capacity_children,
        formattedData.total_capacity,
        formattedData.base_price,
        formattedData.occupancy_price_adjustments,
        formattedData.child_pricing,
        formattedData.instant_payment_enabled,
        formattedData.free_cancellation_enabled,
        formattedData.refundable1,
        formattedData.days_before1,
        formattedData.refund_percent1,
        formattedData.refundable2,
        formattedData.days_before2,
        formattedData.refund_percent2,
        formattedData.refundable3,
        formattedData.days_before3,
        formattedData.refund_percent3,
        formattedData.individual_room_capacities
      ]);

      // Optional: fetch inserted record and return it
      const selectQuery = `SELECT * FROM room_pricing_availability WHERE id = ?`;
      const [insertedRecords] = await db.query(selectQuery, [result.insertId]);
      return insertedRecords[0];

    } catch (error) {
      console.error('Error in createRoomPricing:', error);
      throw error;
    }
  }
}


module.exports = RoomPricing;
