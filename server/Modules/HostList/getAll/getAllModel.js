const db = require('../../../config/db');
const BasicInfo = require('../basicInfo/basicInfoModels');
const LocationDetails = require('../locationDetails/locationDetailsModels');
const Room = require('../roomSetup/roomSetupModels');

class GetAllInfo {
    static async getAllCombinedInfo() {
        try {
            // Get all basic info
            const basicInfo = await BasicInfo.getAllProperties();
            
            // Get all location details
            const locationDetails = await LocationDetails.getAllLocationDetails();
            
            // Get all rooms
            const rooms = await Room.getAllRooms();
            
            // Combine the data
            const combinedData = basicInfo.map(property => {
                const location = locationDetails.find(loc => loc.user_id === property.user_id);
                const propertyRooms = rooms.filter(room => room.user_id === property.user_id);
                
                return {
                    ...property,
                    location: location || null,
                    rooms: propertyRooms || []
                };
            });
            
            return combinedData;
        } catch (error) {
            console.error('Error getting combined info:', error);
            throw error;
        }
    }

    static async getCombinedInfoById(id) {
        try {
            // Get basic info
            const basicInfo = await BasicInfo.getPropertyById(id);
            
            if (!basicInfo) {
                return null;
            }
            
            // Get location details using user_id instead of id
            const locationDetails = await LocationDetails.getLocationDetailsByUserId(basicInfo.user_id);
            
            // Get rooms
            const rooms = await Room.getRoomsByUserId(basicInfo.user_id);
            
            // Combine the data
            return {
                ...basicInfo,
                location: locationDetails || null,
                rooms: rooms || []
            };
        } catch (error) {
            console.error('Error getting combined info by ID:', error);
            throw error;
        }
    }

    static async updateHostInfo(id, updateData) {
        try {
            // Get the current host info to ensure it exists
            const currentHost = await this.getCombinedInfoById(id);
            
            if (!currentHost) {
                return null;
            }

            // Update basic info if provided
            if (updateData.property_name) {
                await BasicInfo.updatePropertyById(id, { property_name: updateData.property_name });
            }

            // Only update location if location data is provided and has changed
            if (updateData.location && Object.keys(updateData.location).length > 0) {
                const locationId = currentHost.location?.id;
                if (locationId) {
                    await LocationDetails.updateLocationDetails(locationId, updateData.location);
                }
            }

            // Only update rooms if rooms data is provided and has changed
            if (updateData.rooms && Array.isArray(updateData.rooms) && updateData.rooms.length > 0) {
                // First delete existing rooms
                await Room.deleteRoomsByUserId(currentHost.user_id);
                // Then insert new rooms
                for (const room of updateData.rooms) {
                    await Room.createRoom({ ...room, user_id: currentHost.user_id });
                }
            }

            // Return the updated combined info
            return await this.getCombinedInfoById(id);
        } catch (error) {
            console.error('Error updating host info:', error);
            throw error;
        }
    }
}

module.exports = GetAllInfo;