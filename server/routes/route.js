const express = require('express')
const router = express.Router()
const cors = require('cors')

// Enable CORS
router.use(cors())

// Body parser middleware
router.use(express.json())
router.use(express.urlencoded({ extended: true }))

// Routes
const userRoutes = require('../Modules/user/userRoutes');
const basicInfoRoutes = require('../Modules/HostList/basicInfo/basicInfoRoutes');
const locationDetailsRoutes = require('../Modules/HostList/locationDetails/locationDetailsRoutes');

// API Routes
router.use('/auth', userRoutes)
router.use('/basicInfo', basicInfoRoutes)
router.use('/location', locationDetailsRoutes)

// Error handling middleware
router.use((err, req, res, next) => {
    console.error('Route error:', err);
    res.status(500).json({
        success: false,
        message: 'Something went wrong!',
        error: err.message
    });
});

module.exports = router