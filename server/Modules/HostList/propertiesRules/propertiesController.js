const PropertyRules = require('./propertiesModels');

class PropertyController {
    static async createProperty(req, res) {
        try {
            const propertyData = {
                user_id: req.body.user_id,
                check_in_time: req.body.check_in_time,
                check_out_time: req.body.check_out_time,
                min_guest_age: req.body.min_guest_age,
                proof_type: req.body.proof_type,
                unmarried_couples_allowed: req.body.unmarried_couples_allowed,
                male_only_groups_allowed: req.body.male_only_groups_allowed,
                scanty_baggage_allowed: req.body.scanty_baggage_allowed,
                smoking_allowed: req.body.smoking_allowed,
                alcohol_allowed: req.body.alcohol_allowed,
                non_veg_allowed: req.body.non_veg_allowed,
                outside_food_allowed: req.body.outside_food_allowed,
                food_delivery_service: req.body.food_delivery_service,
                wheelchair_accessible: req.body.wheelchair_accessible,
                wheelchair_provided: req.body.wheelchair_provided,
                pets_allowed: req.body.pets_allowed,
                pets_on_property: req.body.pets_on_property,
                mattress_cost_child: req.body.mattress_cost_child,
                mattress_cost_adult: req.body.mattress_cost_adult,
                cot_cost: req.body.cot_cost,
                rule_description: req.body.rule_description
            };

            const propertyId = await PropertyRules.create(propertyData);
            res.status(201).json({
                success: true,
                message: 'Property rules created successfully',
                data: { id: propertyId }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error creating property rules',
                error: error.message
            });
        }
    }

    static async getProperty(req, res) {
        try {
            const property = await PropertyRules.findById(req.params.id);
            if (!property) {
                return res.status(404).json({
                    success: false,
                    message: 'Property rules not found'
                });
            }
            res.status(200).json({
                success: true,
                data: property
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error fetching property rules',
                error: error.message
            });
        }
    }

    static async updateProperty(req, res) {
        try {
            const propertyData = {
                check_in_time: req.body.check_in_time,
                check_out_time: req.body.check_out_time,
                min_guest_age: req.body.min_guest_age,
                proof_type: req.body.proof_type,
                unmarried_couples_allowed: req.body.unmarried_couples_allowed,
                male_only_groups_allowed: req.body.male_only_groups_allowed,
                scanty_baggage_allowed: req.body.scanty_baggage_allowed,
                smoking_allowed: req.body.smoking_allowed,
                alcohol_allowed: req.body.alcohol_allowed,
                non_veg_allowed: req.body.non_veg_allowed,
                outside_food_allowed: req.body.outside_food_allowed,
                food_delivery_service: req.body.food_delivery_service,
                wheelchair_accessible: req.body.wheelchair_accessible,
                wheelchair_provided: req.body.wheelchair_provided,
                pets_allowed: req.body.pets_allowed,
                pets_on_property: req.body.pets_on_property,
                mattress_cost_child: req.body.mattress_cost_child,
                mattress_cost_adult: req.body.mattress_cost_adult,
                cot_cost: req.body.cot_cost,
                rule_description: req.body.rule_description
            };

            const updated = await PropertyRules.update(req.params.id, propertyData);
            if (!updated) {
                return res.status(404).json({
                    success: false,
                    message: 'Property rules not found'
                });
            }
            res.status(200).json({
                success: true,
                message: 'Property rules updated successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error updating property rules',
                error: error.message
            });
        }
    }

    static async deleteProperty(req, res) {
        try {
            const deleted = await PropertyRules.delete(req.params.id);
            if (!deleted) {
                return res.status(404).json({
                    success: false,
                    message: 'Property rules not found'
                });
            }
            res.status(200).json({
                success: true,
                message: 'Property rules deleted successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error deleting property rules',
                error: error.message
            });
        }
    }
}

module.exports = PropertyController;
