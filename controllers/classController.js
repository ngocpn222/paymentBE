const Class = require("../models/class");

exports.createClass = async (req, res) => {
  try {
    const { name, description } = req.body;
    const newClass = new Class({ name, description });
    await newClass.save();
    res.status(201).json(newClass);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error creating class", error: err.message });
  }
};

exports.getAllClasses = async (req, res) => {
  try {
    const classes = await Class.find();
    res.json(classes);
  } catch (err) {
    res.status(500).json({ message: "Error fetching classes" });
  }
};

exports.updateClass = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Class.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Class not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Error updating class" });
  }
};

exports.deleteClass = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Class.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "Class not found" });
    res.json({ message: "Class deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting class" });
  }
};
