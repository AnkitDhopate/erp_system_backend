const express = require("express");
const app = express();
const connect = require("./connect");
const PORT = 80;

const teacherRoute = require("./routes/admin/teacher");

app.use(express.json());
app.use("/admin", teacherRoute);

connect;

app.get("/", (req, res) => {
  res.status(201).json({ msg: "Home Page" });
});

app.listen(PORT, () => {
  console.log(`Connected to port ${PORT}`);
});
