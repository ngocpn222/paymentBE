const Tuition = require("../models/Tuition");
const RegisteredSubject = require("../models/RegisteredSubject");

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
      .populate("student", "name email")
      .populate("registeredSubjects");
    res.json(tuitions);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.payTuition = async (req, res) => {
  try {
    const updated = await Tuition.findByIdAndUpdate(
      req.params.id,
      { status: "paid" },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.getMyTuition = async (req, res) => {
  try {
    const studentId = req.user.id; // hoặc req.user._id tùy JWT
    const tuition = await Tuition.findOne({ student: studentId }).populate(
      "registeredSubjects"
    );
    if (!tuition) return res.status(404).json({ message: "No tuition found" });
    res.json(tuition);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
