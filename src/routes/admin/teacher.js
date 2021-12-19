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

router.post("/teacher/register", requireSignIn, teacherRegister);
router.post("/teacher/signin", teacherSignin);
router.post("/teacher/signout", teacherSignout);

router.delete("/teacher/delete-student/:_id", requireSignIn, deleteStudentData);
router.put("/teacher/edit-student-data", requireSignIn, editStudentData);

router.get("/teacher/get-all-student-data", requireSignIn, getAllStudentData);

module.exports = router;
