const express = require("express");
const router = express.Router();
const RegisteredSubject = require("../models/RegisteredSubject");
const registeredSubjectController = require("../controllers/registeredSubjectController");
const authenticateToken = require("../middlewares/authMiddleware");
const authorize = require("../middlewares/authorize");

// POST: Sinh viên đăng ký nhiều môn học
router.post(
  "/many",
  authenticateToken,
  authorize("student"),
  registeredSubjectController.createMany
);

// POST: Sinh viên đăng ký một môn học
router.post(
  "/",
  authenticateToken,
  authorize("student"),
  registeredSubjectController.create
);

// PUT: Chỉ admin/staff được chỉnh sửa đăng ký môn học
router.put(
  "/:id",
  authenticateToken,
  authorize("admin", "staff", "student"),
  registeredSubjectController.update
);

// DELETE:
// - Student được huỷ môn của chính mình
// - Admin được huỷ bất kỳ đăng ký nào
router.delete(
  "/:id",
  authenticateToken,
  authorize("admin", "student", "staff"),
  registeredSubjectController.delete
);

// Lấy tất cả môn đã đăng ký
router.get("/", async (req, res) => {
  try {
    const subjects = await RegisteredSubject.find()
      .populate("student", "name")
      .populate("subject", "name code");
    res.json(subjects);
  } catch (err) {
    res.status(500).json({ message: "Lỗi server khi lấy danh sách môn đã đăng ký" });
  }
});

module.exports = router;
