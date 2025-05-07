const db = require("../../../config/db");

class Guest_profile_rules {
  static async create(data) {
    const { user_id, unmarried_couples_allowed, male_only_groups_allowed, scanty_baggage_allowed } = data;
    const [result] = await db.execute(
      `INSERT INTO guest_profile_rules (user_id, unmarried_couples_allowed, male_only_groups_allowed, scanty_baggage_allowed)
       VALUES (?, ?, ?, ?)`,
      [user_id, unmarried_couples_allowed, male_only_groups_allowed, scanty_baggage_allowed]
    );
    return result.insertId;
  }

  static async getAll() {
    const [rows] = await db.execute('SELECT * FROM guest_profile_rules');
    return rows;
  }

  static async getById(id) {
    const [rows] = await db.execute('SELECT * FROM guest_profile_rules WHERE id = ?', [id]);
    return rows[0];
  }

  static async update(id, data) {
    const { user_id, unmarried_couples_allowed, male_only_groups_allowed, scanty_baggage_allowed } = data;
    const [result] = await db.execute(
      `UPDATE guest_profile_rules SET user_id = ?, unmarried_couples_allowed = ?, male_only_groups_allowed = ?, scanty_baggage_allowed = ?
       WHERE id = ?`,
      [user_id, unmarried_couples_allowed, male_only_groups_allowed, scanty_baggage_allowed, id]
    );
    return result.affectedRows;
  }

  static async remove(id) {
    const [result] = await db.execute('DELETE FROM guest_profile_rules WHERE id = ?', [id]);
    return result.affectedRows;
  }
}

module.exports = Guest_profile_rules;
