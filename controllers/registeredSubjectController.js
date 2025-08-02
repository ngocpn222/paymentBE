const Tuition = require("../models/Tuition");
const RegisteredSubject = require("../models/RegisteredSubject");
const Subject = require("../models/Subject");

// Cập nhật học phí cho sinh viên
async function updateTuitionForStudent(studentId) {
  const registeredSubjects = await RegisteredSubject.find({ student: studentId });
  if (registeredSubjects.length === 0) return;

  const totalCredit = registeredSubjects.reduce((sum, rs) => sum + rs.credits, 0);
  const totalAmount = totalCredit * 300000;

  let tuition = await Tuition.findOne({ student: studentId });
  if (!tuition) {
    tuition = new Tuition({
      student: studentId,
      registeredSubjects: registeredSubjects.map(rs => rs._id),
      totalCredit,
      totalAmount,
    });
  } else {
    tuition.registeredSubjects = registeredSubjects.map(rs => rs._id);
    tuition.totalCredit = totalCredit;
    tuition.totalAmount = totalAmount;
  }
  await tuition.save();
}

// Tạo đăng ký môn học
exports.create = async (req, res) => {
  try {
    const { student, subject } = req.body;

    // Nếu là student, chỉ cho đăng ký cho chính mình
    if (req.user.role === "student" && req.user.studentId !== student) {
      return res.status(403).json({ message: "Bạn không được phép đăng ký cho mã học sinh khác!" });
    }

    // Kiểm tra đã đăng ký môn này chưa
    const existed = await RegisteredSubject.findOne({ student, subject });
    if (existed) {
      return res.status(400).json({ message: "Bạn đã đăng ký môn này rồi!" });
    }

    const subjectObj = await Subject.findById(subject);
    if (!subjectObj)
      return res.status(404).json({ message: "Subject not found" });

    const registeredSubject = new RegisteredSubject({
      student,
      subject,
      credits: subjectObj.credit, // Lấy số tín chỉ từ Subject
    });
    await registeredSubject.save();
    // Cập nhật học phí cho sinh viên
    await updateTuitionForStudent(student);
    res.status(201).json(registeredSubject);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Tạo nhiều đăng ký môn học
exports.createMany = async (req, res) => {
  try {
    const { student, subjectIds } = req.body;

    // Nếu là student, chỉ cho đăng ký cho chính mình
    if (req.user.role === "student" && req.user.studentId !== student) {
      return res.status(403).json({ message: "Bạn không được phép đăng ký cho mã học sinh khác!" });
    }

    if (!Array.isArray(subjectIds) || subjectIds.length === 0)
      return res
        .status(400)
        .json({ message: "subjectIds must be a non-empty array" });

    const subjects = await Subject.find({ _id: { $in: subjectIds } });
    if (subjects.length !== subjectIds.length)
      return res.status(404).json({ message: "Some subjects not found" });

    const registeredSubjects = await Promise.all(
      subjects.map((subjectObj) => {
        return RegisteredSubject.create({
          student,
          subject: subjectObj._id,
          credits: subjectObj.credit,
        });
      })
    );
    // Cập nhật học phí cho sinh viên
    await updateTuitionForStudent(student);
    res.status(201).json(registeredSubjects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Lấy tất cả đăng ký môn học
exports.getAll = async (req, res) => {
  try {
    const list = await RegisteredSubject.find()
      .populate("student")
      .populate("subject");
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Lấy đăng ký môn học theo id
exports.getById = async (req, res) => {
  try {
    const item = await RegisteredSubject.findById(req.params.id)
      .populate("student", "name email")
      .populate("subject", "name code credit");
    if (!item) return res.status(404).json({ message: "Not found" });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Cập nhật đăng ký môn học
exports.update = async (req, res) => {
  try {
    const { student, subject, status } = req.body;
    const item = await RegisteredSubject.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Not found" });

    if (student) item.student = student;
    if (subject) {
      const subjectObj = await Subject.findById(subject);
      if (!subjectObj)
        return res.status(404).json({ message: "Subject not found" });
      item.subject = subject;
      item.credits = subjectObj.credit; // Cập nhật số tín chỉ nếu đổi môn
    }
    if (status) item.status = status;

    await item.save();
    // Cập nhật học phí cho sinh viên
    await updateTuitionForStudent(item.student);
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Xóa đăng ký môn học
exports.delete = async (req, res) => {
  try {
    const item = await RegisteredSubject.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Not found" });

    // Nếu là student, chỉ cho xoá nếu là chính chủ
    if (
      req.user.role === "student" &&
      item.student.toString() !== req.user.studentId
    ) {
      return res.status(403).json({ message: "Forbidden: You are not authorized" });
    }

    await RegisteredSubject.findByIdAndDelete(req.params.id);
    // Cập nhật học phí cho sinh viên
    await updateTuitionForStudent(item.student);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
