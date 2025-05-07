const express = require('express');
const router = express.Router();
const PropertyController = require('./propertiesController');
// CRUD for Properties
router.post('/properties', PropertyController.createProperty);
router.get('/properties/:id', PropertyController.getProperty);
router.put('/properties/:id', PropertyController.updateProperty);
router.delete('/properties/:id', PropertyController.deleteProperty);

module.exports = router;
