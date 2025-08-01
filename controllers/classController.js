const Class = require("../models/class");
const Student = require("../models/Student");

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
    const classesWithStudentCount = await Promise.all(
      classes.map(async (cls) => {
        const studentCount = await Student.countDocuments({ classId: cls._id });
        return { ...cls.toObject(), studentCount };
      })
    );
    res.json(classesWithStudentCount);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
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

exports.getClassDetails = async (req, res) => {
  try {
    const classId = req.params.id;
    const classData = await Class.findById(classId);
    if (!classData) {
      return res.status(404).json({ message: "Lớp học không tồn tại" });
    }

    // Lấy danh sách học sinh liên kết với lớp
    const students = await Student.find({ classId });
    res.json({ ...classData.toObject(), students });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
