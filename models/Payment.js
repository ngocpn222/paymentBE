const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  amount: { type: Number, required: true },
  method: { type: String, enum: ["Banking", "Cash", "Momo"], required: true },
  status: { type: String, enum: ["Success", "Failed"], default: "Success" },
  paidAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Payment", paymentSchema);
