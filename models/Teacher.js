// models/Teacher.js
const mongoose = require("mongoose");

const teacherSchema = new mongoose.Schema({
  name: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  classIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Class" }],
  phone: String,
  email: String,
  gender: String,
  dob: Date
}, { timestamps: true });

module.exports = mongoose.model("Teacher", teacherSchema);
