module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("⚡️ Client connected:", socket.id);

    // Lắng nghe sự kiện từ client (demo)
    socket.on("hello", (data) => {
      console.log("📨 Received hello:", data);
    });

    // Gửi sự kiện về client (demo)
    socket.emit(
      "server-message",
      "Chào mừng đến với hệ thống học phí realtime!"
    );

    socket.on("disconnect", () => {
      console.log("❌ Client disconnected:", socket.id);
    });
  });
};
