const express = require("express");
const {
  teacherRegister,
  teacherSignin,
  teacherSignout,
  getAllStudentData,
  editStudentData,
  deleteStudentData,
} = require("../../controllers/admin/teacher");
const router = express.Router();

router.post("/teacher/register", teacherRegister);
router.post("/teacher/signin", teacherSignin);
router.post("/teacher/signout", teacherSignout);
router.get("/teacher/get-all-student-data", getAllStudentData);
router.delete("/teacher/deleteStudentData", deleteStudentData);
router.put("/teacher/editStudentData", editStudentData);
module.exports = router;
