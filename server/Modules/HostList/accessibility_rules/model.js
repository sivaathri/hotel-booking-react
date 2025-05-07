const db = require("../../../config/db");

class Accessibility_rules {
  static async create(data) {
    const { user_id, wheelchair_accessible, wheelchair_provided } = data;
    const [result] = await db.query(
      `INSERT INTO accessibility_rules (user_id, wheelchair_accessible, wheelchair_provided) VALUES (?, ?, ?)`,
      [user_id, wheelchair_accessible, wheelchair_provided]
    );
    return result.insertId;
  }

  static async getAll() {
    const [rows] = await db.query(`SELECT * FROM accessibility_rules`);
    return rows;
  }

  static async getById(id) {
    const [rows] = await db.query(
      `SELECT * FROM accessibility_rules WHERE id = ?`,
      [id]
    );
    return rows[0];
  }

  static async update(id, data) {
    const { user_id, wheelchair_accessible, wheelchair_provided } = data;
    const [result] = await db.query(
      `UPDATE accessibility_rules SET user_id = ?, wheelchair_accessible = ?, wheelchair_provided = ? WHERE id = ?`,
      [user_id, wheelchair_accessible, wheelchair_provided, id]
    );
    return result.affectedRows;
  }

  static async remove(id) {
    const [result] = await db.query(
      `DELETE FROM accessibility_rules WHERE id = ?`,
      [id]
    );
    return result.affectedRows;
  }
}

module.exports = Accessibility_rules;
