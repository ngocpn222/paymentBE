const express = require("express");
const router = express.Router();
const tuitionController = require("../controllers/tuitionController");
const authenticateToken = require("../middlewares/authMiddleware");
const authorize = require("../middlewares/authorize");

// POST: Tạo học phí cho sinh viên
router.post(
  "/",
  authenticateToken,
  authorize("admin", "staff"),
  tuitionController.createTuition
);

// GET: Admin/staff xem toàn bộ học phí
router.get(
  "/",
  authenticateToken,
  authorize("admin", "staff"),
  tuitionController.getAllTuitions
);

// GET: Sinh viên xem học phí của chính mình
router.get(
  "/my",
  authenticateToken,
  authorize("student"),
  tuitionController.getMyTuition
);

// PUT: Sinh viên thanh toán học phí của chính mình
router.put(
  "/:id/pay",
  authenticateToken,
  authorize("student"),
  tuitionController.payTuition
);

module.exports = router;
