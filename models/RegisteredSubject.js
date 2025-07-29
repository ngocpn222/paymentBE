// models/RegisteredSubject.js
const mongoose = require("mongoose");

const registeredSubjectSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true,
  },
  subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subject",
    required: true,
  },
  credits: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["registered", "cancelled"],
    default: "registered",
  },
  registerDate: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("RegisteredSubject", registeredSubjectSchema);
