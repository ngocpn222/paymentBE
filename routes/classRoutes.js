const express = require("express");
const router = express.Router();
const classCtrl = require("../controllers/classController");
const authenticateToken = require("../middlewares/authMiddleware");
const authorize = require("../middlewares/authorize");

router.post(
  "/",
  authenticateToken,
  authorize("admin", "staff"),
  classCtrl.createClass
);
router.get(
  "/",
  authenticateToken,
  authorize("admin", "staff"),
  classCtrl.getAllClasses
);
router.put(
  "/:id",
  authenticateToken,
  authorize("admin", "staff"),
  classCtrl.updateClass
);
router.delete(
  "/:id",
  authenticateToken,
  authorize("admin"),
  classCtrl.deleteClass
); // chỉ admin được xoá
router.get("/:id", classCtrl.getClassDetails);

module.exports = router;
