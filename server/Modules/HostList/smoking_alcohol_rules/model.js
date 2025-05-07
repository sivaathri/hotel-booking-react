const db = require("../../../config/db");

class Smoking_alcohol_rules {
  // Create a new record
  static async create(data) {
    const { user_id, smoking_allowed, alcohol_allowed } = data;
    const [result] = await db.execute(
      'INSERT INTO smoking_alcohol_rules (user_id, smoking_allowed, alcohol_allowed) VALUES (?, ?, ?)',
      [user_id, smoking_allowed, alcohol_allowed]
    );
    return result.insertId;
  }

  // Get all records
  static async getAll() {
    const [rows] = await db.execute('SELECT * FROM smoking_alcohol_rules');
    return rows;
  }

  // Get a record by ID
  static async getById(id) {
    const [rows] = await db.execute('SELECT * FROM smoking_alcohol_rules WHERE id = ?', [id]);
    return rows[0];
  }

  // Update a record by ID
  static async update(id, data) {
    const { user_id, smoking_allowed, alcohol_allowed } = data;
    const [result] = await db.execute(
      'UPDATE smoking_alcohol_rules SET user_id = ?, smoking_allowed = ?, alcohol_allowed = ? WHERE id = ?',
      [user_id, smoking_allowed, alcohol_allowed, id]
    );
    return result.affectedRows;
  }

  // Remove a record by ID
  static async remove(id) {
    const [result] = await db.execute('DELETE FROM smoking_alcohol_rules WHERE id = ?', [id]);
    return result.affectedRows;
  }
}

module.exports = Smoking_alcohol_rules;
