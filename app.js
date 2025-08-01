const express = require("express");
const cors = require("cors");

const invoiceRoutes = require("./routes/invoiceRoutes");
const userRoutes = require("./routes/userRoutes");
const classRoutes = require("./routes/classRoutes");
const studentRoutes = require("./routes/studentRoutes");
const teacherRoutes = require("./routes/teacherRoutes");
const subjectRoutes = require("./routes/subjectRoutes");
const registeredSubjectRoutes = require("./routes/registeredSubjectRoutes");
const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/invoices", invoiceRoutes);
app.use("/api/user", userRoutes);
app.use("/api/classes", classRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/teachers", teacherRoutes);
app.use("/api/subjects", subjectRoutes);
app.use("/api/registered-subjects", registeredSubjectRoutes);
app.use("/api/tuition", require("./routes/tuitionRoutes"));
app.get("/", (req, res) => {
  res.send("Tuition Payment API Running...");
});

module.exports = app;
