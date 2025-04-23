const express = require('express')
const router = express.Router()
const cors = require('cors')
router.use(cors())
// Routes
const userRoutes = require('../Modules/user/userRoutes');
const hostListRoutes = require('../Modules/HostList/hostListRoutes');

// API Routes
router.use('/auth', userRoutes)
router.use('/host', hostListRoutes)




  module.exports = router