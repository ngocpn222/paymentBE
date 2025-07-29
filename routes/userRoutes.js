const express = require("express");
const router = express.Router();

const authenticateToken = require("../middlewares/authMiddleware");
const authorize = require("../middlewares/authorize");

// ⛔ Route chỉ cho "admin"
router.get("/all-users", authenticateToken, authorize("admin"), (req, res) => {
  res.json({ message: "Chào admin! Đây là danh sách tất cả người dùng." });
});

// ✅ Route cho cả "admin" và "teacher"
router.get(
  "/teacher-dashboard",
  authenticateToken,
  authorize(["admin", "teacher"]),
  (req, res) => {
    res.json({ message: "Chào admin hoặc giáo viên!" });
  }
);

// ✅ Route ai đăng nhập cũng truy cập được
router.get("/profile", authenticateToken, (req, res) => {
  res.json({ message: `Hello ${req.user.email}`, user: req.user });
});

module.exports = router;
