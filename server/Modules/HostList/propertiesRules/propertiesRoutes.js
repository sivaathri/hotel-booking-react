const express = require('express');
const router = express.Router();
const PropertyController = require('./propertiesController');
router.post('/:user_id', PropertyController.createProperty);

module.exports = router;
