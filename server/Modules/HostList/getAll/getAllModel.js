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
            const query = `
                SELECT 
                    bi.*,
                    fa.*,
                    ld.*,
                    pd.*,
                    pr.*,
                    ri.*,
                    rpa.*,
                    rs.*
                FROM basic_info bi
                LEFT JOIN facilities_amenities fa ON bi.property_id = fa.property_id
                LEFT JOIN location_details ld ON bi.property_id = ld.property_id AND bi.user_id = ld.user_id
                LEFT JOIN property_details pd ON bi.property_id = pd.property_id
                LEFT JOIN property_rules pr ON bi.property_id = pr.property_id AND bi.user_id = pr.user_id
                LEFT JOIN room_images ri ON bi.property_id = ri.property_id
                LEFT JOIN room_pricing_availability rpa ON bi.property_id = rpa.property_id
                LEFT JOIN room_setup rs ON bi.property_id = rs.property_id AND bi.user_id = rs.user_id
                WHERE bi.user_id = ?
            `;
            
            const [results] = await db.query(query, [id]);
            
            if (!results || results.length === 0) {
                return null;
            }
            
            return results[0];
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

    static async deleteHostInfo(id) {
        try {
            // Get the current host info to ensure it exists
            const currentHost = await this.getCombinedInfoById(id);
            
            if (!currentHost) {
                return null;
            }

            // Delete rooms first (due to foreign key constraints)
            if (currentHost.rooms && currentHost.rooms.length > 0) {
                await Room.deleteRoomsByUserId(currentHost.user_id);
            }

            // Delete location details
            if (currentHost.location) {
                await LocationDetails.deleteLocationDetails(currentHost.location.id);
            }

            // Finally delete the basic info
            const deletedBasicInfo = await BasicInfo.deletePropertyById(id);

            return deletedBasicInfo;
        } catch (error) {
            console.error('Error deleting host info:', error);
            throw error;
        }
    }
}

module.exports = GetAllInfo;