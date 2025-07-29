const express = require("express");
const router = express.Router();

const {
  createSubject,
  getAllSubjects,
  getSubjectById,
  updateSubject,
  deleteSubject,
} = require("../controllers/subjectController");

const authenticateToken = require("../middlewares/authMiddleware");
const authorize = require("../middlewares/authorize");

// Chỉ Admin và Teacher được tạo, cập nhật, xoá
router.post(
  "/",
  authenticateToken,
  authorize("admin", "teacher"),
  createSubject
);
router.put(
  "/:id",
  authenticateToken,
  authorize("admin", "teacher"),
  updateSubject
);
router.delete(
  "/:id",
  authenticateToken,
  authorize("admin", "teacher"),
  deleteSubject
);

// Ai cũng được xem
router.get("/", authenticateToken, getAllSubjects);
router.get("/:id", authenticateToken, getSubjectById);

module.exports = router;
