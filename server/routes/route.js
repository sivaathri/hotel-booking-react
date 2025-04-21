const express = require('express')
const router = express.Router()
const cors = require('cors')
router.use(cors())
// Routes
const userRoutes = require('../Modules/user/userRoutes');
// API Routes
router.use('/auth', userRoutes)


  module.exports = router