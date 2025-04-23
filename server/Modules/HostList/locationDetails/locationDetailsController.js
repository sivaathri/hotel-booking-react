const LocationDetails = require('./locationDetailsModels');

const locationDetailsController = {
    createLocation: async (req, res) => {
        console.log('Creating location - Request received:', {
            params: req.params,
            body: req.body
        });
        
        try {
            const userId = req.params.userId;
            const locationData = {
                userId: userId,
                addressLine1: req.body.addressLine1,
                addressLine2: req.body.addressLine2 || null,
                city: req.body.city,
                stateProvince: req.body.stateProvince,
                country: req.body.country,
                postalCode: req.body.postalCode
            };

            console.log('Location data prepared:', locationData);

            // Validate required fields
            if (!locationData.addressLine1 || !locationData.city || 
                !locationData.stateProvince || !locationData.country || 
                !locationData.postalCode) {
                console.log('Validation failed - Missing required fields');
                return res.status(400).json({
                    success: false,
                    message: 'Missing required fields',
                    requiredFields: ['addressLine1', 'city', 'stateProvince', 'country', 'postalCode']
                });
            }

            console.log('Creating location in database...');
            const result = await LocationDetails.createLocationDetails(locationData);
            console.log('Database insert result:', result);
            
            if (!result || !result.insertId) {
                console.log('Failed to create location - No insert ID returned');
                return res.status(500).json({
                    success: false,
                    message: 'Failed to create location details'
                });
            }
            
            // Get the created record to return in response
            console.log('Fetching created location details...');
            const createdLocation = await LocationDetails.getLocationDetailsById(result.insertId);
            
            if (!createdLocation) {
                console.log('Failed to fetch created location details');
                return res.status(500).json({
                    success: false,
                    message: 'Location created but failed to fetch details'
                });
            }
            
            console.log('Sending success response...');
            return res.status(201).json({
                success: true,
                message: 'Location details created successfully',
                data: createdLocation
            });
        } catch (error) {
            console.error('Error in createLocation:', error);
            return res.status(500).json({
                success: false,
                message: 'Error creating location details',
                error: error.message
            });
        }
    },

    getLocation: async (req, res) => {
        console.log('Getting location - Request received:', {
            params: req.params
        });
        
        try {
            const locationId = req.params.id;
            console.log('Fetching location with ID:', locationId);
            
            const location = await LocationDetails.getLocationDetailsById(locationId);
            console.log('Location details retrieved:', location);
            
            if (!location) {
                console.log('Location not found');
                return res.status(404).json({
                    success: false,
                    message: 'Location details not found'
                });
            }

            console.log('Sending success response...');
            return res.status(200).json({
                success: true,
                data: location
            });
        } catch (error) {
            console.error('Error in getLocation:', error);
            return res.status(500).json({
                success: false,
                message: 'Error retrieving location details',
                error: error.message
            });
        }
    },

    updateLocation: async (req, res) => {
        console.log('Updating location - Request received:', {
            params: req.params,
            body: req.body
        });
        
        try {
            const locationId = req.params.id;
            
            // Check if location exists
            const existingLocation = await LocationDetails.getLocationDetailsById(locationId);
            
            if (!existingLocation) {
                console.log('Location not found for update');
                return res.status(404).json({
                    success: false,
                    message: 'Location details not found'
                });
            }

            const locationData = {
                addressLine1: req.body.addressLine1,
                addressLine2: req.body.addressLine2 || null,
                city: req.body.city,
                stateProvince: req.body.stateProvince,
                country: req.body.country,
                postalCode: req.body.postalCode
            };

            console.log('Location data prepared:', locationData);

            // Validate required fields
            if (!locationData.addressLine1 || !locationData.city || 
                !locationData.stateProvince || !locationData.country || 
                !locationData.postalCode) {
                console.log('Validation failed - Missing required fields');
                return res.status(400).json({
                    success: false,
                    message: 'Missing required fields',
                    requiredFields: ['addressLine1', 'city', 'stateProvince', 'country', 'postalCode']
                });
            }

            console.log('Updating location in database...');
            const result = await LocationDetails.updateLocationDetails(locationId, locationData);
            console.log('Database update result:', result);

            // Get the updated record to return in response
            console.log('Fetching updated location details...');
            const updatedLocation = await LocationDetails.getLocationDetailsById(locationId);
            
            if (!updatedLocation) {
                console.log('Failed to fetch updated location details');
                return res.status(500).json({
                    success: false,
                    message: 'Location updated but failed to fetch details'
                });
            }

            console.log('Sending success response...');
            return res.status(200).json({
                success: true,
                message: 'Location details updated successfully',
                data: updatedLocation
            });
        } catch (error) {
            console.error('Error in updateLocation:', error);
            return res.status(500).json({
                success: false,
                message: 'Error updating location details',
                error: error.message
            });
        }
    }
};

module.exports = locationDetailsController;
