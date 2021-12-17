const express = require("express");
const {
  teacherRegister,
  teacherSignin,
  teacherSignout,
  getAllStudentData,
  editStudentData,
  deleteStudentData,
} = require("../../controllers/admin/teacher");
const { requireSignIn } = require("../../middlewares/middleware");
const router = express.Router();

router.post("/teacher/register", teacherRegister);
router.post("/teacher/signin", teacherSignin);
router.post("/teacher/signout", teacherSignout);

router.delete("/teacher/deleteStudentData", requireSignIn, deleteStudentData);
router.put("/teacher/editStudentData", requireSignIn, editStudentData);

router.get("/teacher/get-all-student-data", requireSignIn, getAllStudentData);


module.exports = router;
