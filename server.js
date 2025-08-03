const express = require("express");
const http = require("http");
const cors = require("cors");
const mongoose = require("mongoose");
const { Server } = require("socket.io");
require("dotenv").config(); // ⭐ Phải có dòng này đầu tiên

const app = express();
app.use(cors());
app.use(express.json()); // ❗ QUAN TRỌNG: để đọc JSON từ body

// ✅ Kết nối MongoDB
mongoose
  .connect("mongodb://localhost:27017/payment", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

const server = http.createServer(app);

// ⚡ Khởi tạo Socket.IO server
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("⚡️ Client connected:", socket.id);

  socket.on("hello", (data) => {
    console.log("✅ Client gửi hello:", data);
    socket.emit("server-message", "Xin chào từ server 👋");
  });

  socket.on("disconnect", () => {
    console.log("❌ Client disconnected:", socket.id);
  });
});
app.set("io", io);
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/auth", require("./routes/auth")); // Đăng ký route auth
app.use("/api/classes", require("./routes/classRoutes"));
app.use("/api/students", require("./routes/studentRoutes"));
app.use("/api/teachers", require("./routes/teacherRoutes"));
app.use("/api/subjects", require("./routes/subjectRoutes"));
app.use(
  "/api/registered-subjects",
  require("./routes/registeredSubjectRoutes")
);
app.use("/api/tuition", require("./routes/tuitionRoutes"));
const invoices = require("./data/mockInvoices");
app.get("/api/invoices", (req, res) => {
  res.json(invoices);
});

server.listen(3001, () => {
  console.log("🚀 Server listening on port 3001");
});
