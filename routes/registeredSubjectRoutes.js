const express = require("express");
const router = express.Router();
const registeredSubjectController = require("../controllers/registeredSubjectController");
const authenticateToken = require("../middlewares/authMiddleware");
const authorize = require("../middlewares/authorize");

// POST: Sinh viên đăng ký một môn học
router.post(
  "/",
  authenticateToken,
  authorize("student"),
  registeredSubjectController.create
);

// POST: Sinh viên đăng ký nhiều môn học
router.post(
  "/many",
  authenticateToken,
  authorize("student"),
  registeredSubjectController.createMany
);

// GET: Admin/staff xem tất cả đăng ký môn học
router.get(
  "/",
  authenticateToken,
  authorize("admin", "staff"),
  registeredSubjectController.getAll
);

// GET: Xem chi tiết đăng ký môn học theo ID
// - Student: chỉ được xem của chính họ
// - Admin/Staff: xem tất cả
router.get(
  "/:id",
  authenticateToken,
  authorize("admin", "staff", "student"),
  registeredSubjectController.getById
);

// PUT: Chỉ admin/staff được chỉnh sửa đăng ký môn học
router.put(
  "/:id",
  authenticateToken,
  authorize("admin", "staff"),
  registeredSubjectController.update
);

// DELETE:
// - Student được huỷ môn của chính mình
// - Admin được huỷ bất kỳ đăng ký nào
router.delete(
  "/:id",
  authenticateToken,
  authorize("admin", "student"),
  registeredSubjectController.delete
);

module.exports = router;
