const Property = require('./propertiesModels');

const createProperty = async (req, res) => {
    try {
      const insertId = await Property.createProperty(req.body);
      res.status(201).json({ success: true, insertId });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  module.exports = { createProperty };