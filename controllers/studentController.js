// Lấy studentId theo userId
exports.getStudentIdByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const student = await Student.findOne({ userId });
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.json({ studentId: student._id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// controllers/studentController.js
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Student = require("../models/Student");

const User = require("../models/User");

exports.createStudent = async (req, res) => {
  try {
    // Lấy thông tin từ request
    let { mssv, name, dob, gender, phone, classId, email } = req.body;

    // Nếu không truyền mssv thì tự sinh
    if (!mssv) {
      let isUnique = false;
      let randomMssv;
      while (!isUnique) {
        randomMssv = Math.floor(
          1000000000 + Math.random() * 9000000000
        ).toString();
        const existedUser = await User.findOne({ username: randomMssv });
        if (!existedUser) isUnique = true;
      }
      mssv = randomMssv;
    } else {
      // Kiểm tra trùng user nếu truyền mssv
      const existedUser = await User.findOne({ username: mssv });
      if (existedUser) {
        return res
          .status(400)
          .json({ message: "Tài khoản với mssv này đã tồn tại" });
      }
    }

    // Kiểm tra trùng email
    if (!email) {
      return res.status(400).json({ message: "Thiếu email" });
    }
    const existedEmail = await User.findOne({ email });
    if (existedEmail) {
      return res.status(400).json({ message: "Email đã tồn tại" });
    }

    // Tạo user: username là mssv, email lấy từ frontend, password là mssv, role là student
    const user = await User.create({
      username: mssv,
      email: email,
      password: "Hutech@123",
      role: "student",
    });

    // Tạo student, liên kết userId
    const student = new Student({
      name,
      dob,
      gender,
      phone,
      classId,
      userId: user._id,
      email: email,
    });
    await student.save();

    res.status(201).json({ student, user });
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
  const { name, classId, gender, phone, dob, email, password } = req.body;

  if (!name || !classId || !gender || !dob || !email || !password) {
    return res
      .status(400)
      .json({ message: "Vui lòng cung cấp đầy đủ thông tin" });
  }

  try {
    // Kiểm tra trùng email
    const existedEmail = await User.findOne({ email });
    if (existedEmail) {
      return res.status(400).json({ message: "Email đã tồn tại" });
    }

    // Tạo sinh viên mới
    const newStudent = await Student.create({
      name,
      classId,
      gender,
      phone,
      dob,
      email,
    });

    // Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      username: email,
      email,
      password: hashedPassword,
      role: "student", // Vai trò là sinh viên
    });

    res.status(201).json({
      message: "Học sinh và tài khoản đã được tạo thành công!",
      student: newStudent,
      account: { email }, // Trả về tài khoản
    });
  } catch (error) {
    console.error("Error adding student:", error);
    res.status(500).json({ message: "Đã xảy ra lỗi", error: error.message });
  }
};

const authenticateToken = (req, res, next) => {
  const token = req.headers["authorization"];
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
