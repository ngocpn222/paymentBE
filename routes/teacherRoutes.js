const express = require("express");
const router = express.Router();
const teacherController = require("../controllers/teacherController");
const authenticateToken = require("../middlewares/authMiddleware");
const authorize = require("../middlewares/authorize");

// CRUD với phân quyền
router.post(
  "/",
  authenticateToken,
  authorize("admin", "staff"),
  teacherController.createTeacher
);
router.get(
  "/",
  authenticateToken,
  authorize("admin", "staff"),
  teacherController.getAllTeachers
);
router.get("/:id", authenticateToken, teacherController.getTeacherById);
router.put(
  "/:id",
  authenticateToken,
  authorize("admin", "staff"),
  teacherController.updateTeacher
);
router.delete(
  "/:id",
  authenticateToken,
  authorize("admin"),
  teacherController.deleteTeacher
);

module.exports = router;
