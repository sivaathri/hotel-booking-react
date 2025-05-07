const db = require("../../../config/db");

class Property {
    static async createProperty(data) {
        const {
            user_id,
            // Basic property info
            check_in_time,
            check_out_time,
            min_guest_age,
            // ID proof rules
            id_proofs,
            // Guest profile rules
            guest_profile_rules,
            // Smoking and alcohol rules
            smoking_alcohol_rules,
            // Food rules
            food_rules,
            // Food delivery options
            food_delivery_options,
            // Accessibility rules
            accessibility_rules,
            // Pet policy
            pet_policy,
            // Extra bed policy
            extra_bed_policy,
            // Additional rules
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
            const propertyId = propertyResult.insertId;

            // Insert ID proofs if provided
            if (id_proofs && id_proofs.length > 0) {
                for (const proof of id_proofs) {
                    await connection.query(
                        `INSERT INTO id_proofs (user_id, property_id, proof_type)
                        VALUES (?, ?, ?)`,
                        [user_id, propertyId, proof]
                    );
                }
            }

            // Insert guest profile rules if provided
            if (guest_profile_rules) {
                await connection.query(
                    `INSERT INTO guest_profile_rules (user_id, property_id, unmarried_couples_allowed, male_only_groups_allowed, scanty_baggage_allowed)
                    VALUES (?, ?, ?, ?, ?)`,
                    [user_id, propertyId, 
                     guest_profile_rules.unmarried_couples_allowed,
                     guest_profile_rules.male_only_groups_allowed,
                     guest_profile_rules.scanty_baggage_allowed]
                );
            }

            // Insert smoking and alcohol rules if provided
            if (smoking_alcohol_rules) {
                await connection.query(
                    `INSERT INTO smoking_alcohol_rules (user_id, property_id, smoking_allowed, alcohol_allowed)
                    VALUES (?, ?, ?, ?)`,
                    [user_id, propertyId,
                     smoking_alcohol_rules.smoking_allowed,
                     smoking_alcohol_rules.alcohol_allowed]
                );
            }

            // Insert food rules if provided
            if (food_rules) {
                await connection.query(
                    `INSERT INTO food_rules (user_id, property_id, rules)
                    VALUES (?, ?, ?)`,
                    [user_id, propertyId, JSON.stringify(food_rules)]
                );
            }

            // Insert food delivery options if provided
            if (food_delivery_options) {
                await connection.query(
                    `INSERT INTO food_delivery_options (user_id, property_id, options)
                    VALUES (?, ?, ?)`,
                    [user_id, propertyId, JSON.stringify(food_delivery_options)]
                );
            }

            // Insert accessibility rules if provided
            if (accessibility_rules) {
                await connection.query(
                    `INSERT INTO accessibility_rules (user_id, property_id, rules)
                    VALUES (?, ?, ?)`,
                    [user_id, propertyId, JSON.stringify(accessibility_rules)]
                );
            }

            // Insert pet policy if provided
            if (pet_policy) {
                await connection.query(
                    `INSERT INTO pet_policy (user_id, property_id, pets_allowed, pets_on_property)
                    VALUES (?, ?, ?, ?)`,
                    [user_id, propertyId,
                     pet_policy.pets_allowed,
                     pet_policy.pets_on_property]
                );
            }

            // Insert extra bed policy if provided
            if (extra_bed_policy) {
                await connection.query(
                    `INSERT INTO extra_bed_policy (user_id, property_id, policy)
                    VALUES (?, ?, ?)`,
                    [user_id, propertyId, JSON.stringify(extra_bed_policy)]
                );
            }

            // Insert additional rules if provided
            if (additional_rules) {
                await connection.query(
                    `INSERT INTO additional_rules (user_id, property_id, rule_description)
                    VALUES (?, ?, ?)`,
                    [user_id, propertyId, JSON.stringify(additional_rules)]
                );
            }

            // Commit the transaction
            await connection.commit();
            return propertyId;

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