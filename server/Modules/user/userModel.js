const db = require('../../config/db');

class User {
  static async create(userData) {
    const [result] = await db.execute(
      'INSERT INTO users (username, email, password, mobile) VALUES (?, ?, ?, ?)',
      [userData.username, userData.email, userData.password, userData.mobile]
    );
    return result.insertId;
  }

  static async findByEmail(email) {
    const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0];
  }

  static async findById(id) {
    const [rows] = await db.execute('SELECT * FROM users WHERE id = ?', [id]);
    return rows[0];
  }

  static async update(id, userData) {
    const [result] = await db.execute(
      'UPDATE users SET username = ?, email = ?, mobile = ? WHERE id = ?',
      [userData.username, userData.email, userData.mobile, id]
    );
    return result.affectedRows;
  }

  static async delete(id) {
    const [result] = await db.execute('DELETE FROM users WHERE id = ?', [id]);
    return result.affectedRows;
  }
}

module.exports = User; 