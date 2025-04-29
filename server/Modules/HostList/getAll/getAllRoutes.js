const express = require('express');
const router = express.Router();
const getAllcontroller = require('./getAllcontroller');

router.get('/all', getAllcontroller.getallinfo);
router.get('/:id', getAllcontroller.getHostById);

module.exports = router;   