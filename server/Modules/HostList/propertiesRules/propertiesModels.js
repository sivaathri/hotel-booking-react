const db = require('../../../config/db');

class PropertyRules {
    static async create(propertyData) {
        const query = `
            INSERT INTO property_rules (
                user_id, check_in_time, check_out_time, min_guest_age,
                proof_type, unmarried_couples_allowed, male_only_groups_allowed,
                scanty_baggage_allowed, smoking_allowed, alcohol_allowed,
                non_veg_allowed, outside_food_allowed, food_delivery_service,
                wheelchair_accessible, wheelchair_provided, pets_allowed,
                pets_on_property, mattress_cost_child, mattress_cost_adult,
                cot_cost, rule_description
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const values = [
            propertyData.user_id,
            propertyData.check_in_time,
            propertyData.check_out_time,
            propertyData.min_guest_age,
            propertyData.proof_type,
            propertyData.unmarried_couples_allowed,
            propertyData.male_only_groups_allowed,
            propertyData.scanty_baggage_allowed,
            propertyData.smoking_allowed,
            propertyData.alcohol_allowed,
            propertyData.non_veg_allowed,
            propertyData.outside_food_allowed,
            propertyData.food_delivery_service,
            propertyData.wheelchair_accessible,
            propertyData.wheelchair_provided,
            propertyData.pets_allowed,
            propertyData.pets_on_property,
            propertyData.mattress_cost_child,
            propertyData.mattress_cost_adult,
            propertyData.cot_cost,
            propertyData.rule_description
        ];

        try {
            const [result] = await db.query(query, values);
            return result.insertId;
        } catch (error) {
            throw error;
        }
    }

    static async findById(id) {
        const query = 'SELECT * FROM property_rules WHERE id = ?';
        try {
            const [rows] = await db.query(query, [id]);
            return rows[0];
        } catch (error) {
            throw error;
        }
    }

    static async update(id, propertyData) {
        const query = `
            UPDATE property_rules SET
                check_in_time = ?,
                check_out_time = ?,
                min_guest_age = ?,
                proof_type = ?,
                unmarried_couples_allowed = ?,
                male_only_groups_allowed = ?,
                scanty_baggage_allowed = ?,
                smoking_allowed = ?,
                alcohol_allowed = ?,
                non_veg_allowed = ?,
                outside_food_allowed = ?,
                food_delivery_service = ?,
                wheelchair_accessible = ?,
                wheelchair_provided = ?,
                pets_allowed = ?,
                pets_on_property = ?,
                mattress_cost_child = ?,
                mattress_cost_adult = ?,
                cot_cost = ?,
                rule_description = ?
            WHERE id = ?
        `;

        const values = [
            propertyData.check_in_time,
            propertyData.check_out_time,
            propertyData.min_guest_age,
            propertyData.proof_type,
            propertyData.unmarried_couples_allowed,
            propertyData.male_only_groups_allowed,
            propertyData.scanty_baggage_allowed,
            propertyData.smoking_allowed,
            propertyData.alcohol_allowed,
            propertyData.non_veg_allowed,
            propertyData.outside_food_allowed,
            propertyData.food_delivery_service,
            propertyData.wheelchair_accessible,
            propertyData.wheelchair_provided,
            propertyData.pets_allowed,
            propertyData.pets_on_property,
            propertyData.mattress_cost_child,
            propertyData.mattress_cost_adult,
            propertyData.cot_cost,
            propertyData.rule_description,
            id
        ];

        try {
            const [result] = await db.query(query, values);
            return result.affectedRows > 0;
        } catch (error) {
            throw error;
        }
    }

    static async delete(id) {
        const query = 'DELETE FROM property_rules WHERE id = ?';
        try {
            const [result] = await db.query(query, [id]);
            return result.affectedRows > 0;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = PropertyRules;
