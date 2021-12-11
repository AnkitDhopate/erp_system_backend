const express = require("express");
const app = express();
const connect = require("./connect");
const cors = require("cors");
const PORT = 2000;

const teacherRoute = require("./routes/admin/teacher");
const studentRoute = require("./routes/student");

app.use(express.json());
app.use(cors());
app.use("/admin", teacherRoute);
app.use("/student", studentRoute);

connect;

app.get("/", (req, res) => {
  res.status(201).json({ msg: "Home Page" });
});

app.listen(PORT, () => {
  console.log(`Connected to port ${PORT}`);
});
