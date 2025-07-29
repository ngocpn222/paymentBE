const express = require("express");
const router = express.Router();
const studentController = require("../controllers/studentController");
const authenticateToken = require("../middlewares/authMiddleware");
const authorize = require("../middlewares/authorize");

// CRUD Student với phân quyền
router.post(
  "/",
  authenticateToken,
  authorize("admin", "staff"),
  studentController.createStudent
);
router.get(
  "/",
  authenticateToken,
  authorize("admin", "staff", "teacher"),
  studentController.getAllStudents
);
router.get("/:id", authenticateToken, studentController.getStudentById);
router.put(
  "/:id",
  authenticateToken,
  authorize("admin", "staff"),
  studentController.updateStudent
);
router.delete(
  "/:id",
  authenticateToken,
  authorize("admin"),
  studentController.deleteStudent
);

module.exports = router;
