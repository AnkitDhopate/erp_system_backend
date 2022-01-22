const express = require("express");
const app = express();
const connect = require("./connect");
const cors = require("cors");
const env = require("dotenv");
const path = require("path");
env.config();
const PORT = process.env.PORT;

// const teacherRoute = require("./routes/admin/teacher");
// const studentRoute = require("./routes/student");
// const adminRoute = require("./routes/admin/admin");
// const hodRoute = require("./routes/admin/hod");
// const principalRoute = require("./routes/admin/principal");
const routes = require("./routes/commonRoute");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
// app.use("/admin/teacher", teacherRoute);
// app.use("/student", studentRoute);
// app.use("/admin", adminRoute);
// app.use("/admin/hod", hodRoute);
// app.use("/admin/principal", principalRoute);
app.use("/erp", routes);

app.use("/public", express.static(path.join(__dirname, "uploads")));

connect;

app.get("/", (req, res) => {
  res.status(201).json({ msg: "Home Page" });
});

app.get("*", (req, res) => {
  res.json({ msg: "404 Page" });
});

app.listen(PORT, () => {
  console.log(`Connected to port ${PORT}`);
});
