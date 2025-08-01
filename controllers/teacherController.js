// controllers/teacherController.js
const Teacher = require("../models/Teacher");

const User = require("../models/User");

exports.createTeacher = async (req, res) => {
  try {
    const { name, email, phone, gender, dob, classIds, password } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Thiếu email" });
    }
    const existedEmail = await User.findOne({ email });
    if (existedEmail) {
      return res.status(400).json({ message: "Email đã tồn tại" });
    }

    // Tạo user cho giáo viên
    const user = await User.create({
      username: email,
      email,
      password: password || "Hutech@123", // Nếu không truyền thì dùng mặc định
      role: "staff",
    });

    // Tạo giáo viên, liên kết userId
    const teacher = new Teacher({
      name,
      email,
      phone,
      gender,
      dob,
      classIds,
      userId: user._id,
    });
    await teacher.save();

    res.status(201).json({ teacher, user });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getAllTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find()
      .populate("userId", "email role")
      .populate("classIds", "name");
    res.json(teachers);
  } catch (err) {
    console.error("Error fetching teachers:", err);
    res.status(500).json({ message: err.message });
  }
};

exports.getTeacherById = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id)
      .populate("userId")
      .populate("classIds", "name");
    if (!teacher) return res.status(404).json({ message: "Teacher not found" });
    res.json(teacher);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!teacher) return res.status(404).json({ message: "Teacher not found" });
    res.json(teacher);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.findByIdAndDelete(req.params.id);
    if (!teacher) return res.status(404).json({ message: "Teacher not found" });
    res.json({ message: "Teacher deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
