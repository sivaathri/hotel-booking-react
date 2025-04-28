const express = require('express');
const router = express.Router();
const RoomSetupController = require('./roomSetupController');

// Create a new room
router.post('/create/:userId', RoomSetupController.createRoom);

// Get all rooms for a user
router.get('/user/:userId', RoomSetupController.getRooms);

// Get a specific room by ID
router.get('/:roomId', RoomSetupController.getRoomById);

// Update a room
router.put('/:roomId', RoomSetupController.updateRoom);

// Delete a room
router.delete('/:roomId', RoomSetupController.deleteRoom);

module.exports = router;
