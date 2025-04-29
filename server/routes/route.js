const express = require('express')
const router = express.Router()
const cors = require('cors')

// Enable CORS
router.use(cors())

// Routes
const userRoutes = require('../Modules/user/userRoutes');
const basicInfoRoutes = require('../Modules/HostList/basicInfo/basicInfoRoutes');
const locationDetailsRoutes = require('../Modules/HostList/locationDetails/locationDetailsRoutes');
const roomSetupRoutes = require('../Modules/HostList/roomSetup/roomSetupRoutes');
const getall = require('../Modules/HostList/getAll/getAllRoutes');
const uploadImagesRoutes = require('../Modules/HostList/UploadImages/UploadImagesRoutes');
// API Routes
router.use('/auth', userRoutes)
router.use('/basicInfo', basicInfoRoutes)
router.use('/location', locationDetailsRoutes)
router.use('/roomSetup', roomSetupRoutes)
router.use('/getall', getall)   
router.use('/uploadImages', uploadImagesRoutes)


  module.exports = router