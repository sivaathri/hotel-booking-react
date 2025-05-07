const db = require("../../../config/db");

class Id_proofs {
  // Create a new ID proof
  static async create(data) {
    const { user_id, proof_type } = data;

    const query = `INSERT INTO id_proofs (user_id, proof_type)
                   VALUES ( ?, ?)`;

    const [result] = await db.query(query, [ user_id, proof_type]);
    return result.insertId; // Return the ID of the inserted record
  }

  // Get all ID proofs
  static async getAll() {
    const query = `SELECT * FROM id_proofs`;
    const [rows] = await db.query(query);
    return rows;
  }

  // Get a specific ID proof by ID
  static async getById(id) {
    const query = `SELECT * FROM id_proofs WHERE id = ?`;
    const [rows] = await db.query(query, [id]);
    return rows[0]; // Return the first row, or null if not found
  }

  // Update an ID proof by ID
  static async update(id, data) {
    const { property_id, user_id, proof_type } = data;

    const query = `UPDATE id_proofs 
                   SET property_id = ?, user_id = ?, proof_type = ?
                   WHERE id = ?`;

    const [result] = await db.query(query, [property_id, user_id, proof_type, id]);
    return result.affectedRows > 0; // Return true if the update was successful
  }

  // Delete an ID proof by ID
  static async remove(id) {
    const query = `DELETE FROM id_proofs WHERE id = ?`;
    const [result] = await db.query(query, [id]);
    return result.affectedRows > 0; // Return true if the deletion was successful
  }
}

module.exports = Id_proofs;
