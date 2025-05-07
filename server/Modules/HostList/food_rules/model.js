const db = require("../../../config/db");

class Food_rules {
  // Create a new record
  static async create(data) {
    const { user_id, non_veg_allowed, outside_food_allowed } = data;
    const [result] = await db.execute(
      'INSERT INTO food_rules (user_id, non_veg_allowed, outside_food_allowed) VALUES (?, ?, ?)',
      [user_id, non_veg_allowed, outside_food_allowed]
    );
    return result.insertId;
  }

  // Get all records
  static async getAll() {
    const [rows] = await db.execute('SELECT * FROM food_rules');
    return rows;
  }

  // Get a record by ID
  static async getById(id) {
    const [rows] = await db.execute('SELECT * FROM food_rules WHERE id = ?', [id]);
    return rows[0];
  }

  // Update a record by ID
  static async update(id, data) {
    const { user_id, non_veg_allowed, outside_food_allowed } = data;
    const [result] = await db.execute(
      'UPDATE food_rules SET user_id = ?, non_veg_allowed = ?, outside_food_allowed = ? WHERE id = ?',
      [user_id, non_veg_allowed, outside_food_allowed, id]
    );
    return result.affectedRows;
  }

  // Remove a record by ID
  static async remove(id) {
    const [result] = await db.execute('DELETE FROM food_rules WHERE id = ?', [id]);
    return result.affectedRows;
  }
}

module.exports = Food_rules;
