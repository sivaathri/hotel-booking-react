const express = require('express');
const router = express.Router();
const PropertyController = require('./propertiesController');
router.post('/', PropertyController.createProperty);

module.exports = router;
