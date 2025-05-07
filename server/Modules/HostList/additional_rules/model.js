const db = require("../../../config/db");

class Additional_rules {
  static async create(data) {
    const { user_id, rule_description } = data;
    const [result] = await db.query(
      `INSERT INTO additional_rules (user_id, rule_description) 
       VALUES (?, ?)`,
      [user_id, rule_description]
    );
    return result.insertId;
  }

  static async getAll() {
    const [rows] = await db.query(`SELECT * FROM additional_rules`);
    return rows;
  }

  static async getById(id) {
    const [rows] = await db.query(`SELECT * FROM additional_rules WHERE id = ?`, [id]);
    return rows[0];
  }

  static async update(id, data) {
    const { user_id, rule_description } = data;
    const [result] = await db.query(
      `UPDATE additional_rules SET user_id = ?, rule_description = ? WHERE id = ?`,
      [user_id, rule_description, id]
    );
    return result.affectedRows;
  }

  static async remove(id) {
    const [result] = await db.query(`DELETE FROM additional_rules WHERE id = ?`, [id]);
    return result.affectedRows;
  }
}

module.exports = Additional_rules;
