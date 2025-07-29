// controllers/subjectController.js
const Subject = require("../models/Subject");

// [POST] /api/subjects
const createSubject = async (req, res) => {
  try {
    const subject = new Subject(req.body);
    const savedSubject = await subject.save();
    res.status(201).json(savedSubject);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// [GET] /api/subjects
const getAllSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find();
    res.json(subjects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// [GET] /api/subjects/:id
const getSubjectById = async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id);
    if (!subject) return res.status(404).json({ message: "Subject not found" });
    res.json(subject);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// [PUT] /api/subjects/:id
const updateSubject = async (req, res) => {
  try {
    const updatedSubject = await Subject.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedSubject);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// [DELETE] /api/subjects/:id
const deleteSubject = async (req, res) => {
  try {
    await Subject.findByIdAndDelete(req.params.id);
    res.json({ message: "Subject deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createSubject,
  getAllSubjects,
  getSubjectById,
  updateSubject,
  deleteSubject,
};
