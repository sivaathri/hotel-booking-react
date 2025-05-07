const db = require("../../../config/db");

class Extra_bed_policy {
  static async create(data) {
    const { user_id, mattress_cost_child, mattress_cost_adult, cot_cost } = data;
    const [result] = await db.query(
      `INSERT INTO extra_bed_policy (user_id, mattress_cost_child, mattress_cost_adult, cot_cost) 
       VALUES (?, ?, ?, ?)`,
      [user_id, mattress_cost_child, mattress_cost_adult, cot_cost]
    );
    return result.insertId;
  }

  static async getAll() {
    const [rows] = await db.query(`SELECT * FROM extra_bed_policy`);
    return rows;
  }

  static async getById(id) {
    const [rows] = await db.query(`SELECT * FROM extra_bed_policy WHERE id = ?`, [id]);
    return rows[0];
  }

  static async update(id, data) {
    const { user_id, mattress_cost_child, mattress_cost_adult, cot_cost } = data;
    const [result] = await db.query(
      `UPDATE extra_bed_policy SET user_id = ?, mattress_cost_child = ?, mattress_cost_adult = ?, cot_cost = ? WHERE id = ?`,
      [user_id, mattress_cost_child, mattress_cost_adult, cot_cost, id]
    );
    return result.affectedRows;
  }

  static async remove(id) {
    const [result] = await db.query(`DELETE FROM extra_bed_policy WHERE id = ?`, [id]);
    return result.affectedRows;
  }
}

module.exports = Extra_bed_policy;
