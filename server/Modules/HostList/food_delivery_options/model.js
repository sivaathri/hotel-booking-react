const db = require("../../../config/db");

class Food_delivery_options {
  static async create(data) {
    const { user_id, service_name } = data;
    const [result] = await db.execute(
      "INSERT INTO food_delivery_options (user_id, service_name) VALUES (?, ?)",
      [user_id, service_name]
    );
    return result.insertId;
  }

  static async getAll() {
    const [rows] = await db.execute("SELECT * FROM food_delivery_options");
    return rows;
  }

  static async getById(id) {
    const [rows] = await db.execute("SELECT * FROM food_delivery_options WHERE id = ?", [id]);
    return rows[0]; // return single record or undefined
  }

  static async update(id, data) {
    const { user_id, service_name } = data;
    const [result] = await db.execute(
      "UPDATE food_delivery_options SET user_id = ?, service_name = ? WHERE id = ?",
      [user_id, service_name, id]
    );
    return result.affectedRows > 0;
  }

  static async remove(id) {
    const [result] = await db.execute("DELETE FROM food_delivery_options WHERE id = ?", [id]);
    return result.affectedRows > 0;
  }
}

module.exports = Food_delivery_options;
