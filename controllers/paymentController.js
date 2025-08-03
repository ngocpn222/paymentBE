const Payment = require("../models/Payment");

const handlePayment = async (req, res) => {
  try {
    const { studentId, amount, method } = req.body;

    // 👉 1. Tạo biên lai (lưu vào DB)
    const newReceipt = new Payment({
      studentId,
      amount,
      method,
      status: "Success",
      paidAt: new Date(),
    });

    await newReceipt.save();

    // 👉 2. Emit socket thông báo đến student và admin
    const io = req.app.get("io"); // Lấy socket.io instance từ Express

    io.to(`user:${studentId}`).emit("payment-receipt", {
      message: "💸 Bạn đã thanh toán thành công",
      receipt: newReceipt,
    });

    io.to("admins").emit("new-receipt", {
      message: `📢 Sinh viên ${studentId} vừa thanh toán`,
      receipt: newReceipt,
    });

    // 👉 3. Phản hồi HTTP
    return res.status(201).json({
      message: "Thanh toán thành công",
      receipt: newReceipt,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Thanh toán thất bại" });
  }
};

module.exports = { handlePayment };
