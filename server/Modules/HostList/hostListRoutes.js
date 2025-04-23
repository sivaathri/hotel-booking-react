const express = require('express');
const router = express.Router();

const hostListController = require('./hostListController');

// Get all properties
router.get('/properties', hostListController.getAllProperties);

// Get property by ID (support both formats)
router.get('/property/:id', hostListController.getPropertyById);
router.get('/properties/:id', hostListController.getPropertyById);

// Create a new listing with user_id in URL
router.post('/create/:user_id', hostListController.createBasicInfo);

// Update property by ID
router.put('/property/:id', hostListController.updatePropertyById);
router.put('/properties/:id', hostListController.updatePropertyById);

// Delete property by ID
router.delete('/property/:id', hostListController.deletePropertyById);
router.delete('/properties/:id', hostListController.deletePropertyById);

// Get properties by user ID
router.get('/user/:user_id/properties', hostListController.getUserProperties);

module.exports = router; 