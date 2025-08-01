// models/Teacher.js
const mongoose = require("mongoose");

const teacherSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    classIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Class" }],
    phone: String,
    email: String,
    gender: String,
    dob: Date,
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Teacher", teacherSchema);
