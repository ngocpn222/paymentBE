// controllers/studentController.js
const Student = require("../models/Student");
const User = require("../models/User");

exports.createStudent = async (req, res) => {
  try {
    // Lấy thông tin từ request
    let { mssv, name, dob, gender, phone, classId } = req.body;

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

    // Tạo user: username, email, password đều là mssv, role là student
    const user = await User.create({
      username: mssv,
      email: mssv,
      password: mssv,
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
    });
    await student.save();

    res.status(201).json({ student, user });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getAllStudents = async (req, res) => {
  try {
    const students = await Student.find().populate("userId", "email role");
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: err.message });
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
