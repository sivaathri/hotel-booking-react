const Property = require('./propertiesModels');

const createProperty = async (req, res) => {
    try {
        const user_id = req.params.user_id;
        const {
            check_in_time,
            check_out_time,
            checkInTime,
            checkOutTime,
            min_guest_age,
            minAge,
            id_proofs,
            guest_profile_rules,
            smoking_alcohol_rules,
            food_rules,
            food_delivery_options,
            accessibility_rules,
            pet_policy,
            extra_bed_policy,
            additional_rules
        } = req.body;

        // Validate required fields
        if (!user_id) {
            return res.status(400).json({
                success: false,
                message: "User ID is required"
            });
        }

        // Handle both camelCase and snake_case formats
        const checkInTimeValue = check_in_time || checkInTime;
        const checkOutTimeValue = check_out_time || checkOutTime;
        const minGuestAgeValue = min_guest_age || minAge;

        if (!checkInTimeValue || !checkOutTimeValue) {
            return res.status(400).json({
                success: false,
                message: "Check-in and check-out times are required"
            });
        }

        // Validate ID proofs if provided
        if (id_proofs && !Array.isArray(id_proofs)) {
            return res.status(400).json({
                success: false,
                message: "ID proofs must be an array"
            });
        }

        // Validate guest profile rules if provided
        if (guest_profile_rules) {
            if (typeof guest_profile_rules !== 'object') {
                return res.status(400).json({
                    success: false,
                    message: "Guest profile rules must be an object"
                });
            }
        }

        // Validate smoking and alcohol rules if provided
        if (smoking_alcohol_rules) {
            if (typeof smoking_alcohol_rules !== 'object') {
                return res.status(400).json({
                    success: false,
                    message: "Smoking and alcohol rules must be an object"
                });
            }
        }

        // Validate food rules if provided
        if (food_rules && typeof food_rules !== 'object') {
            return res.status(400).json({
                success: false,
                message: "Food rules must be an object"
            });
        }

        // Validate food delivery options if provided
        if (food_delivery_options && typeof food_delivery_options !== 'object') {
            return res.status(400).json({
                success: false,
                message: "Food delivery options must be an object"
            });
        }

        // Validate accessibility rules if provided
        if (accessibility_rules && typeof accessibility_rules !== 'object') {
            return res.status(400).json({
                success: false,
                message: "Accessibility rules must be an object"
            });
        }

        // Validate pet policy if provided
        if (pet_policy) {
            if (typeof pet_policy !== 'object') {
                return res.status(400).json({
                    success: false,
                    message: "Pet policy must be an object"
                });
            }
        }

        // Validate extra bed policy if provided
        if (extra_bed_policy && typeof extra_bed_policy !== 'object') {
            return res.status(400).json({
                success: false,
                message: "Extra bed policy must be an object"
            });
        }

        // Validate additional rules if provided
        if (additional_rules && typeof additional_rules !== 'object') {
            return res.status(400).json({
                success: false,
                message: "Additional rules must be an object"
            });
        }

        // Create a standardized object with snake_case keys
        const propertyData = {
            user_id,
            check_in_time: checkInTimeValue,
            check_out_time: checkOutTimeValue,
            min_guest_age: minGuestAgeValue,
            ...req.body
        };

        const insertId = await Property.createProperty(propertyData);
        res.status(201).json({ 
            success: true, 
            message: "Property and all associated rules created successfully",
            insertId 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: error.message 
        });
    }
};

module.exports = { createProperty };