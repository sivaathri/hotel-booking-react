const express = require('express');
const router = express.Router();
const locationDetailsController = require('./locationDetailsController');

// Middleware to log requests
router.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
    console.log('Request Body:', req.body);
    next();
});

// Create location details
router.post('/create/:userId', (req, res, next) => {
    console.log('Create location route hit');
    locationDetailsController.createLocation(req, res).catch(next);
});

// Get location details by ID
router.get('/:id', (req, res, next) => {
    console.log('Get location route hit');
    locationDetailsController.getLocation(req, res).catch(next);
});

// Update location details
router.put('/:id', (req, res, next) => {
    console.log('Update location route hit');
    locationDetailsController.updateLocation(req, res).catch(next);
});

// Error handling middleware
router.use((err, req, res, next) => {
    console.error('Location route error:', err);
    res.status(500).json({
        success: false,
        message: 'Error in location details route',
        error: err.message
    });
});

module.exports = router;
