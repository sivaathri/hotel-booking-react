const RoomSetup = require('./roomSetupModels');

class RoomSetupController {
  static async createRoom(req, res) {
    try {
      const userId = req.params.userId;
      const { rooms } = req.body;

      if (!Array.isArray(rooms)) {
        return res.status(400).json({
          success: false,
          message: 'Rooms data must be an array'
        });
      }

      const createdRooms = [];

      for (const room of rooms) {
        const roomData = {
          user_id: userId,
          floor: room.floor,
          bhk_type: room.bhk_type,
          room_name: room.room_name,
          capacity: room.capacity,
          bed_type: room.bed_type,
          has_attached_bathroom: room.has_attached_bathroom,
          has_balcony: room.has_balcony,
          facilities: room.facilities || []
        };

        const roomId = await RoomSetup.createRoom(roomData);
        const createdRoom = await RoomSetup.getRoomById(roomId);
        createdRooms.push(createdRoom);
      }

      res.status(201).json({
        success: true,
        message: 'Rooms created successfully',
        data: createdRooms
      });
    } catch (error) {
      console.error('Error creating rooms:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create room',
        error: error.message
      });
    }
  }

  static async getRooms(req, res) {
    try {
      const userId = req.params.userId;
      const rooms = await RoomSetup.getRoomsByUserId(userId);

      res.status(200).json({
        success: true,
        data: rooms
      });
    } catch (error) {
      console.error('Error fetching rooms:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch rooms',
        error: error.message
      });
    }
  }

  static async updateRoom(req, res) {
    try {
      const roomId = req.params.roomId;
      const roomData = {
        floor: req.body.floor,
        bhk_type: req.body.bhk_type,
        room_name: req.body.room_name,
        capacity: req.body.capacity,
        bed_type: req.body.bed_type,
        has_attached_bathroom: req.body.has_attached_bathroom,
        has_balcony: req.body.has_balcony,
        facilities: req.body.facilities || []
      };

      const result = await RoomSetup.updateRoom(roomId, roomData);
      
      if (result === 0) {
        return res.status(404).json({
          success: false,
          message: 'Room not found'
        });
      }

      const updatedRoom = await RoomSetup.getRoomById(roomId);

      res.status(200).json({
        success: true,
        message: 'Room updated successfully',
        data: updatedRoom
      });
    } catch (error) {
      console.error('Error updating room:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update room',
        error: error.message
      });
    }
  }

  static async deleteRoom(req, res) {
    try {
      const roomId = req.params.roomId;

      const result = await RoomSetup.deleteRoom(roomId);

      if (result === 0) {
        return res.status(404).json({
          success: false,
          message: 'Room not found'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Room deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting room:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete room',
        error: error.message
      });
    }
  }

  static async getRoomById(req, res) {
    try {
      const roomId = req.params.roomId;
      const room = await RoomSetup.getRoomById(roomId);

      if (!room) {
        return res.status(404).json({
          success: false,
          message: 'Room not found'
        });
      }

      res.status(200).json({
        success: true,
        data: room
      });
    } catch (error) {
      console.error('Error fetching room:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch room',
        error: error.message
      });
    }
  }
}

module.exports = RoomSetupController;
