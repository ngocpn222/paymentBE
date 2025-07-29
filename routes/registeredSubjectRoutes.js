const express = require("express");
const router = express.Router();
const registeredSubjectController = require("../controllers/registeredSubjectController");

// POST: Đăng ký một môn học
router.post("/", registeredSubjectController.create);

// POST: Đăng ký nhiều môn học
router.post("/many", registeredSubjectController.createMany);

// GET: Lấy tất cả đăng ký môn học
router.get("/", registeredSubjectController.getAll);

// GET: Lấy đăng ký môn học theo id
router.get("/:id", registeredSubjectController.getById);

// PUT: Cập nhật đăng ký môn học
router.put("/:id", registeredSubjectController.update);

// DELETE: Hủy đăng ký một môn
router.delete("/:id", registeredSubjectController.delete);

module.exports = router;
