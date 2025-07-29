// models/Subject.js
const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  code: { type: String, required: true, unique: true }, // VD: MATH101
  description: { type: String },
  credit: { type: Number, default: 3 }, // Số tín chỉ
});

module.exports = mongoose.model("Subject", subjectSchema);
