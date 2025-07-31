// controllers/studentController.js
const Student = require("../models/Student");

exports.createStudent = async (req, res) => {
  try {
    const student = new Student(req.body);
    await student.save();
    res.status(201).json(student);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getAllStudents = async (req, res) => {
  try {
    const students = await Student.find().populate("classId", "name"); 
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).populate("userId");
    if (!student) return res.status(404).json({ message: "Student not found" });
    res.json(student);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!student) return res.status(404).json({ message: "Student not found" });
    res.json(student);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) return res.status(404).json({ message: "Student not found" });
    res.json({ message: "Student deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.addStudent = async (req, res) => {
  const { name, classId, gender, phone, dob } = req.body;

  // Kiểm tra dữ liệu đầu vào
  if (!name || !classId || !gender || !dob) {
    return res.status(400).json({ message: "Vui lòng cung cấp đầy đủ thông tin" });
  }

  try {
    const newStudent = await Student.create({ name, classId, gender, phone, dob });
    res.status(201).json(newStudent);
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ message: "Dữ liệu bị trùng lặp" });
    } else {
      res.status(500).json({ message: "Đã xảy ra lỗi", error: error.message });
    }
  }
};
