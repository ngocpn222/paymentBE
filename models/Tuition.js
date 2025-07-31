const mongoose = require("mongoose");

const tuitionSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    registeredSubjects: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "RegisteredSubject",
      },
    ],
    totalCredit: {
      type: Number,
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["unpaid", "paid"],
      default: "unpaid",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Tuition", tuitionSchema);
