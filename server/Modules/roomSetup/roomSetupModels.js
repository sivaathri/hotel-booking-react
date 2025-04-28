const db = require('../../config/db');

class RoomSetup {
  static async createRoom(roomData) {
    // Convert undefined values to null and ensure proper data types
    const sanitizedData = {
      user_id: roomData.user_id || null,
      floor: roomData.floor || null,
      bhk_type: roomData.bhk_type || null,
      room_name: roomData.room_name || null,
      capacity: roomData.capacity || null,
      bed_type: roomData.bed_type || null,
      has_attached_bathroom: roomData.has_attached_bathroom ? 1 : 0,
      has_balcony: roomData.has_balcony ? 1 : 0,
      facilities: Array.isArray(roomData.facilities) ? roomData.facilities : []
    };

    const [result] = await db.execute(
      `INSERT INTO rooms (
        user_id,
        floor,
        bhk_type,
        room_name,
        capacity,
        bed_type,
        has_attached_bathroom,
        has_balcony,
        facilities,
        created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [
        sanitizedData.user_id,
        sanitizedData.floor,
        sanitizedData.bhk_type,
        sanitizedData.room_name,
        sanitizedData.capacity,
        sanitizedData.bed_type,
        sanitizedData.has_attached_bathroom,
        sanitizedData.has_balcony,
        JSON.stringify(sanitizedData.facilities)
      ]
    );
    return result.insertId;
  }

  static async getRoomsByUserId(userId) {
    const [rows] = await db.execute(
      'SELECT * FROM rooms WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    );
    return rows.map(row => ({
      ...row,
      facilities: JSON.parse(row.facilities),
      has_attached_bathroom: !!row.has_attached_bathroom,
      has_balcony: !!row.has_balcony
    }));
  }

  static async updateRoom(roomId, roomData) {
    const [result] = await db.execute(
      `UPDATE rooms SET
        floor = ?,
        bhk_type = ?,
        room_name = ?,
        capacity = ?,
        bed_type = ?,
        has_attached_bathroom = ?,
        has_balcony = ?,
        facilities = ?,
        updated_at = NOW()
      WHERE id = ?`,
      [
        roomData.floor,
        roomData.bhk_type,
        roomData.room_name,
        roomData.capacity,
        roomData.bed_type,
        roomData.has_attached_bathroom ? 1 : 0,
        roomData.has_balcony ? 1 : 0,
        JSON.stringify(roomData.facilities),
        roomId
      ]
    );
    return result.affectedRows;
  }

  static async deleteRoom(roomId) {
    const [result] = await db.execute(
      'DELETE FROM rooms WHERE id = ?',
      [roomId]
    );
    return result.affectedRows;
  }

  static async getRoomById(roomId) {
    const [rows] = await db.execute('SELECT * FROM rooms WHERE id = ?', [roomId]);
    if (rows.length === 0) return null;
    
    const room = rows[0];
    return {
      ...room,
      facilities: JSON.parse(room.facilities),
      has_attached_bathroom: !!room.has_attached_bathroom,
      has_balcony: !!room.has_balcony
    };
  }
}

module.exports = RoomSetup;
