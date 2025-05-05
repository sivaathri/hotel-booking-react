const Model = require('./idproofsmodel');

const create = async (req, res) => {
  try {
    const insertId = await Model.create(req.body);
    res.status(201).json({ success: true, insertId });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAll = async (req, res) => {
  try {
    const records = await Model.getAll();
    res.status(200).json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getById = async (req, res) => {
  try {
    const record = await Model.getById(req.params.id);
    if (!record) return res.status(404).json({ message: 'Not found' });
    res.status(200).json(record);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const update = async (req, res) => {
  try {
    const updated = await Model.update(req.params.id, req.body);
    res.status(200).json({ success: true, updated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const remove = async (req, res) => {
  try {
    const deleted = await Model.remove(req.params.id);
    res.status(200).json({ success: true, deleted });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { create, getAll, getById, update, remove };
