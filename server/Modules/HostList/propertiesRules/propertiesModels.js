const db = require("../../../config/db");


class Property {
    static async createProperty(data) {
      const {
        user_id,
        check_in_time,
        check_out_time,
        min_guest_age
      } = data;
  
      const [result] = await db.query(
        `INSERT INTO properties (user_id, check_in_time, check_out_time, min_guest_age)
         VALUES (?, ?, ?, ?)`,
        [user_id, check_in_time, check_out_time, min_guest_age]
      );
  
      return result.insertId;
    }
  }
  
  module.exports = Property;