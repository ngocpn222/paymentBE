const express = require("express");
const router = express.Router();
const studentController = require("../controllers/studentController");
const { addStudent } = require("../controllers/studentController");
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

// Thêm middleware authenticateToken vào route thêm học sinh
router.post("/students", authenticateToken, addStudent);
studentController.addStudent;
router.get("/student-id/:userId", studentController.getStudentIdByUserId);
module.exports = router;
