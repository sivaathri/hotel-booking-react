const express = require('express')
const router = express.Router()
const cors = require('cors')

// Enable CORS
router.use(cors())

// Routes
const userRoutes = require('../Modules/user/userRoutes');
const basicInfoRoutes = require('../Modules/HostList/basicInfo/basicInfoRoutes');
const locationDetailsRoutes = require('../Modules/HostList/locationDetails/locationDetailsRoutes');

// API Routes
router.use('/auth', userRoutes)
router.use('/basicInfo', basicInfoRoutes)
router.use('/location', locationDetailsRoutes)
      



  module.exports = router