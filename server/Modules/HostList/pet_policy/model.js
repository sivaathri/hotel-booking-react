const db = require("../../../config/db");

class Pet_policy {
  static async create(data) {
    const { user_id, pets_allowed, pets_on_property } = data;
    const [result] = await db.query(
      `INSERT INTO pet_policy (user_id, pets_allowed, pets_on_property) VALUES (?, ?, ?)`,
      [user_id, pets_allowed, pets_on_property]
    );
    return result.insertId;
  }

  static async getAll() {
    const [rows] = await db.query(`SELECT * FROM pet_policy`);
    return rows;
  }

  static async getById(id) {
    const [rows] = await db.query(`SELECT * FROM pet_policy WHERE id = ?`, [id]);
    return rows[0];
  }

  static async update(id, data) {
    const { user_id, pets_allowed, pets_on_property } = data;
    const [result] = await db.query(
      `UPDATE pet_policy SET user_id = ?, pets_allowed = ?, pets_on_property = ? WHERE id = ?`,
      [user_id, pets_allowed, pets_on_property, id]
    );
    return result.affectedRows;
  }

  static async remove(id) {
    const [result] = await db.query(`DELETE FROM pet_policy WHERE id = ?`, [id]);
    return result.affectedRows;
  }
}

module.exports = Pet_policy;
