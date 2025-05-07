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
const properties = require ('../Modules/HostList/propertiesRules/propertiesRoutes')
const idproff = require('../Modules/HostList/idproofs/idproofsroutes')
const guestprofilerules = require('../Modules/HostList/guest_profile_rules/routes')
const smokingalcoholrules = require('../Modules/HostList/smoking_alcohol_rules/routes')
const foodrules  = require('../Modules/HostList/food_rules/routes')

// API Routes
router.use('/auth', userRoutes)
router.use('/basicInfo', basicInfoRoutes)
router.use('/location', locationDetailsRoutes)
router.use('/roomSetup', roomSetupRoutes)
router.use('/getall', getall)   
router.use('/uploadImages', uploadImagesRoutes)
router.use('/properties', properties)
router.use('/idproff', idproff)
router.use('/guestprofilerules', guestprofilerules)
router.use('/smokingalcoholrules', smokingalcoholrules)
router.use('/foodrules ', foodrules )




  module.exports = router