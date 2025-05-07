const db = require("../../../config/db");

class Property {
    static async createProperty(data) {
        const {
            user_id,
            check_in_time,
            check_out_time,
            min_guest_age,
            id_proofs,
            guest_profile_rules,
            smoking_alcohol_rules,
            food_rules,
            food_delivery_options,
            accessibility_rules,
            pet_policy,
            extra_bed_policy,
            additional_rules
        } = data;

        // Start a transaction
        const connection = await db.getConnection();
        await connection.beginTransaction();

        try {
            // Insert basic property info
            const [propertyResult] = await connection.query(
                `INSERT INTO properties (user_id, check_in_time, check_out_time, min_guest_age)
                VALUES (?, ?, ?, ?)`,
                [user_id, check_in_time, check_out_time, min_guest_age]
            );

            // Insert ID proofs if provided
            if (id_proofs && id_proofs.length > 0) {
                for (const proof of id_proofs) {
                    await connection.query(
                        `INSERT INTO id_proofs (user_id, proof_type)
                        VALUES (?, ?)`,
                        [user_id, proof]
                    );
                }
            }

            // Insert guest profile rules if provided
            if (guest_profile_rules) {
                await connection.query(
                    `INSERT INTO guest_profile_rules (user_id, unmarried_couples_allowed, male_only_groups_allowed, scanty_baggage_allowed)
                    VALUES (?, ?, ?, ?)`,
                    [user_id, 
                     guest_profile_rules.unmarried_couples_allowed,
                     guest_profile_rules.male_only_groups_allowed,
                     guest_profile_rules.scanty_baggage_allowed]
                );
            }

            // Insert smoking and alcohol rules if provided
            if (smoking_alcohol_rules) {
                await connection.query(
                    `INSERT INTO smoking_alcohol_rules (user_id, smoking_allowed, alcohol_allowed)
                    VALUES (?, ?, ?)`,
                    [user_id,
                     smoking_alcohol_rules.smoking_allowed,
                     smoking_alcohol_rules.alcohol_allowed]
                );
            }

            // Insert food rules if provided
            if (food_rules) {
                await connection.query(
                    `INSERT INTO food_rules (user_id, non_veg_allowed, outside_food_allowed)
                    VALUES (?, ?, ?)`,
                    [user_id, 
                     food_rules.non_veg_allowed,
                     food_rules.outside_food_allowed]
                );
            }

            // Insert food delivery options if provided
            if (food_delivery_options && food_delivery_options.service_name) {
                await connection.query(
                    `INSERT INTO food_delivery_options (user_id, service_name)
                    VALUES (?, ?)`,
                    [user_id, food_delivery_options.service_name]
                );
            }

            // Insert accessibility rules if provided
            if (accessibility_rules) {
                await connection.query(
                    `INSERT INTO accessibility_rules (user_id, wheelchair_accessible, wheelchair_provided)
                    VALUES (?, ?, ?)`,
                    [user_id,
                     accessibility_rules.wheelchair_accessible,
                     accessibility_rules.wheelchair_provided]
                );
            }

            // Insert pet policy if provided
            if (pet_policy) {
                await connection.query(
                    `INSERT INTO pet_policy (user_id, pets_allowed, pets_on_property)
                    VALUES (?, ?, ?)`,
                    [user_id,
                     pet_policy.pets_allowed,
                     pet_policy.pets_on_property]
                );
            }

            // Insert extra bed policy if provided
            if (extra_bed_policy) {
                await connection.query(
                    `INSERT INTO extra_bed_policy (user_id, mattress_cost_child, mattress_cost_adult, cot_cost)
                    VALUES (?, ?, ?, ?)`,
                    [user_id,
                     extra_bed_policy.mattress_cost_child,
                     extra_bed_policy.mattress_cost_adult,
                     extra_bed_policy.cot_cost]
                );
            }

            // Insert additional rules if provided
            if (additional_rules) {
                await connection.query(
                    `INSERT INTO additional_rules (user_id, rule_description)
                    VALUES (?, ?)`,
                    [user_id, additional_rules.rule_description]
                );
            }

            // Commit the transaction
            await connection.commit();
            return propertyResult.insertId;

        } catch (error) {
            // Rollback the transaction in case of error
            await connection.rollback();
            throw error;
        } finally {
            // Release the connection
            connection.release();
        }
    }
}

module.exports = Property;