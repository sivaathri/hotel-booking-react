const CalenderModel = require('./CalenderModel');

// Create pricing
// Create new pricing
const createPricing = async (req, res) => {
    try {
        const { room_id, room_type, pricing_date, adults, price, currency, child_age_from, child_age_to, child_price } = req.body;

        // Basic validation
        if (!room_id || !room_type || !pricing_date || !adults || !price || !currency) {
            return res.status(400).json({
                success: false,
                message: "room_id, room_type, pricing_date, adults, price, and currency are required"
            });
        }

        const newPricing = await CalenderModel.createPricing({
            room_id,
            room_type,
            pricing_date,
            adults,
            price,
            currency,
            child_age_from,
            child_age_to,
            child_price
        });

        res.status(201).json({
            success: true,
            message: "Pricing created successfully",
            data: newPricing
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};



module.exports = {
    createPricing
 
};
