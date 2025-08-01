const express = require("express");
const router = express.Router();
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

// ...existing code...

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

module.exports = router;
