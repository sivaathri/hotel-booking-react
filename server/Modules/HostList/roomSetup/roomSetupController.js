const Room = require('./roomSetupModels');
// GET all rooms
const getAllRooms = async (req, res) => {
  try {
    const rooms = await Room.getAllRooms();
    res.status(200).json({ success: true, data: rooms });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET single room
const getRoomById = async (req, res) => {
  try {
    const room = await Room.getRoomById(req.params.id);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    res.status(200).json({ success: true, data: room });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST create room
const createRoom = async (req, res) => {
  try {
    const insertId = await Room.createRoom(req.body);
    res.status(201).json({ success: true, insertId });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT update room
const updateRoom = async (req, res) => {
  try {
    await Room.updateRoom(req.params.id, req.body);
    res.status(200).json({ success: true, message: 'Room updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE room
const deleteRoom = async (req, res) => {
  try {
    await Room.deleteRoom(req.params.id);
    res.status(200).json({ success: true, message: 'Room deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllRooms,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom
};
