const mongoose = require("mongoose");

const classSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: String,
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student" }], // optional
  },
  { timestamps: true }
);

module.exports = mongoose.model("Class", classSchema);
