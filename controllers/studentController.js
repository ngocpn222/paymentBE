// controllers/studentController.js
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Student = require("../models/Student");
const User = require("../models/User"); // Model User để lưu tài khoản

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

  if (!name || !classId || !gender || !dob) {
    return res.status(400).json({ message: "Vui lòng cung cấp đầy đủ thông tin" });
  }

  try {
    // Tạo sinh viên mới
    const newStudent = await Student.create({ name, classId, gender, phone, dob });

    // Tạo tài khoản Gmail và mật khẩu cho sinh viên
    const email = `${name.toLowerCase().replace(/\s+/g, "")}${newStudent._id}@example.com`; // Tạo email dựa trên tên và ID
    const password = Math.random().toString(36).slice(-8); // Tạo mật khẩu ngẫu nhiên
    const hashedPassword = await bcrypt.hash(password, 10); // Mã hóa mật khẩu

    await User.create({
      username: email,
      email,
      password: hashedPassword,
      role: "student", // Vai trò là sinh viên
    });

    res.status(201).json({
      message: "Học sinh và tài khoản đã được tạo thành công!",
      student: newStudent,
      account: { email, password }, // Trả về tài khoản và mật khẩu
    });
  } catch (error) {
    console.error("Error adding student:", error);
    res.status(500).json({ message: "Đã xảy ra lỗi", error: error.message });
  }
};

const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(400).json({ message: "Access token is missing" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(403).json({ message: "Invalid token" });
  }
};
