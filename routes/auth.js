// routes/auth.js
const User = require("../models/User");
const Student = require("../models/Student"); // import model Student
const jwt = require("jsonwebtoken");

const express = require("express");
const router = express.Router();
const { register, login } = require("../controllers/authController");

router.post("/register", register); // Có thể cho admin dùng
// router.post("/login", login);
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(401).json({ message: "Invalid email or password" });

    const isMatch = await user.comparePassword(password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid email or password" });

    const student = await Student.findOne({ userId: user._id });
    const studentId = student ? student._id.toString() : null;
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role, studentId },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        studentId, // trả về cho FE nếu cần
      },
    });
  } catch (err) {
    console.error("❌ Lỗi login:", err); // ← in lỗi ra console
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
