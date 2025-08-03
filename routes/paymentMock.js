const Tuition = require("../models/Tuition");

router.post("/mock-momo", async (req, res) => {
  const { tuitionId } = req.body;
  const io = req.app.get("io");

  try {
    // Cập nhật trạng thái hóa đơn
    const updated = await Tuition.findByIdAndUpdate(
      tuitionId,
      { status: "paid" },
      { new: true }
    )
      .populate({
        path: "student",
        select: "name email mssv studentId code classId",
        populate: { path: "classId", select: "name" },
      })
      .populate({
        path: "registeredSubjects",
        populate: { path: "subject", select: "code name credit" },
      });

    console.log("💰 Đã thanh toán Momo thành công:", tuitionId);

    // Emit event với dữ liệu hóa đơn đã cập nhật
    io.emit("tuition_paid", {
      tuitionId: updated._id,
      student: updated.student,
      totalCredit: updated.totalCredit,
      totalAmount: updated.totalAmount,
      time: new Date(),
      status: updated.status,
    });

    return res.json({
      success: true,
      message: "Thanh toán Momo thành công (mock)",
      tuition: updated,
    });
  } catch (error) {
    console.error("❌ Lỗi mock momo:", error);
    return res.status(500).json({ error: "Lỗi khi xử lý thanh toán mock" });
  }
});
