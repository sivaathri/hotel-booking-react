const db = require('../../../config/db');

const LocationDetails = {
    createLocationDetails: (locationData) => {
        return new Promise((resolve, reject) => {
            const query = `
                INSERT INTO location_details 
                (user_id, address_line1, address_line2, city, state_province, country, postal_code)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `;
            
            db.query(
                query,
                [
                    locationData.userId,
                    locationData.addressLine1,
                    locationData.addressLine2,
                    locationData.city,
                    locationData.stateProvince,
                    locationData.country,
                    locationData.postalCode
                ],
                (error, results) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(results);
                    }
                }
            );
        });
    },

    getLocationDetailsById: (locationId) => {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM location_details WHERE id = ?';
            
            db.query(query, [locationId], (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results[0]);
                }
            });
        });
    },

    updateLocationDetails: (locationId, locationData) => {
        return new Promise((resolve, reject) => {
            const query = `
                UPDATE location_details 
                SET address_line1 = ?,
                    address_line2 = ?,
                    city = ?,
                    state_province = ?,
                    country = ?,
                    postal_code = ?
                WHERE id = ?
            `;
            
            db.query(
                query,
                [
                    locationData.addressLine1,
                    locationData.addressLine2,
                    locationData.city,
                    locationData.stateProvince,
                    locationData.country,
                    locationData.postalCode,
                    locationId
                ],
                (error, results) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(results);
                    }
                }
            );
        });
    }
};

module.exports = LocationDetails;
