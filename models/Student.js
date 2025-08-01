// models/Student.js
const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    classId: { type: mongoose.Schema.Types.ObjectId, ref: "Class" },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    dob: Date,
    gender: String,
    phone: String,
    email: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Student", studentSchema);
