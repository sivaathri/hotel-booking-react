const express = require('express');
const router = express.Router();
const CalenderController = require('./CalenderController');

// POST route to create a new room pricing entry
router.post('/pricing', CalenderController.createPricing);

module.exports = router;
