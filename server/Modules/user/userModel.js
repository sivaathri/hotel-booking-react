const db = require('../../config/db');

class User {
  static async create(userData) {
    const [result] = await db.execute(
      `INSERT INTO users (
        username, 
        email, 
        password, 
        role,
        mobile,
        date_of_birth,
        gender,
        marital_status,
        address,
        pincode,
        state
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userData.username,
        userData.email,
        userData.password,
        userData.role || 'user',
        userData.mobile || null,
        userData.date_of_birth || null,
        userData.gender || null,
        userData.marital_status || null,
        userData.address || null,
        userData.pincode || null,
        userData.state || null
      ]
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
    const validFields = [
      'username',
      'email',
      'mobile',
      'date_of_birth',
      'gender',
      'marital_status',
      'address',
      'pincode',
      'state'
    ];

    // Filter out undefined values and build the query dynamically
    const updates = [];
    const values = [];
    
    validFields.forEach(field => {
      if (userData[field] !== undefined) {
        updates.push(`${field} = ?`);
        values.push(userData[field]);
      }
    });

    if (updates.length === 0) return 0;

    // Add id to values array
    values.push(id);

    const [result] = await db.execute(
      `UPDATE users SET ${updates.join(', ')} WHERE id = ?`,
      values
    );
    return result.affectedRows;
  }

  static async delete(id) {
    const [result] = await db.execute('DELETE FROM users WHERE id = ?', [id]);
    return result.affectedRows;
  }

  static async getAll() {
    const [rows] = await db.execute('SELECT * FROM users');
    return rows;
  }

}

module.exports = User; 