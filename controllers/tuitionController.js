const Tuition = require("../models/Tuition");
const RegisteredSubject = require("../models/RegisteredSubject");
const Subject = require("../models/Subject");

exports.createTuition = async (req, res) => {
  try {
    const { studentId } = req.body;

    const registeredSubjects = await RegisteredSubject.find({
      student: studentId,
    });

    if (registeredSubjects.length === 0) {
      return res
        .status(400)
        .json({ message: "Student has no registered subjects" });
    }

    const totalCredit = registeredSubjects.reduce(
      (sum, rs) => sum + rs.credits,
      0
    );
    const totalAmount = totalCredit * 300000; // 300k / tín chỉ

    const tuition = new Tuition({
      student: studentId,
      registeredSubjects: registeredSubjects.map((rs) => rs._id),
      totalCredit,
      totalAmount,
    });

    await tuition.save();
    res.status(201).json(tuition);
  } catch (err) {
    console.error("Error creating tuition:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getAllTuitions = async (req, res) => {
  try {
    const tuitions = await Tuition.find()
      .populate({
        path: "student",
        select: "name email mssv studentId code classId",
        populate: {
          path: "classId",
          select: "name",
        },
      })
      .populate({
        path: "registeredSubjects",
        populate: {
          path: "subject",
          select: "code name credit",
        },
      });
    // Map lại dữ liệu cho FE dễ dùng
    const result = tuitions.map((tuition) => ({
      ...tuition.toObject(),
      registeredSubjects: tuition.registeredSubjects.map((rs) => ({
        code: rs.subject?.code,
        name: rs.subject?.name,
        credit: rs.subject?.credit,
        unitPrice: 300000, // hoặc lấy từ subject nếu có
      })),
    }));
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.payTuition = async (req, res) => {
  try {
    const updated = await Tuition.findByIdAndUpdate(
      req.params.id,
      { status: "paid" },
      { new: true }
    )
      .populate({
        path: "student",
        select: "name email mssv studentId code classId",
        populate: { path: "classId", select: "name" },
      })
      .populate({
        path: "registeredSubjects",
        populate: { path: "subject", select: "code name credit" },
      });

    // Gửi socket event nếu thành công
    const io = req.app.get("io");
    io.emit("tuition_paid", {
      tuitionId: updated._id,
      student: updated.student,
      totalAmount: updated.totalAmount,
      time: new Date(),
    });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.getMyTuition = async (req, res) => {
  try {
    const studentId = req.user.studentId; // Sửa lại dòng này
    if (!studentId)
      return res.status(400).json({ message: "Missing studentId in token" });

    const tuition = await Tuition.findOne({ student: studentId })
      .populate({
        path: "student",
        select: "name email mssv studentId code classId",
        populate: { path: "classId", select: "name" },
      })
      .populate({
        path: "registeredSubjects",
        populate: { path: "subject", select: "code name credit" },
      });

    if (!tuition) return res.status(404).json({ message: "No tuition found" });

    // Map lại dữ liệu cho FE dễ dùng (giống getAllTuitions)
    const result = {
      ...tuition.toObject(),
      registeredSubjects: tuition.registeredSubjects.map((rs) => ({
        code: rs.subject?.code,
        name: rs.subject?.name,
        credit: rs.subject?.credit,
        unitPrice: 300000,
      })),
    };

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
