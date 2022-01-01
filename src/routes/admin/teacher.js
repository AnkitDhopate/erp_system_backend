const express = require("express");
const {
  deleteTeacherData,
  editTeacherData,
  getAllTeacherData,
} = require("../../controllers/admin/teacher");
const {
  teacherRegister,
  teacherSignin,
  teacherSignout,
} = require("../../controllers/admin/teacher");
const { requireSignIn } = require("../../middlewares/middleware");
const { isRequestValidated, validateSigninRequest, validateSignupRequesthod } = require("../../Validators/validators");
const router = express.Router();

router.post("/register", validateSignupRequesthod, isRequestValidated, requireSignIn, teacherRegister);
router.post("/signin", validateSigninRequest, isRequestValidated, teacherSignin);
router.post("/signout", teacherSignout);
router.delete("/delete-teacher/:_id", requireSignIn, deleteTeacherData);
router.put("/edit-teacher-data", requireSignIn, editTeacherData);
router.get("/get-all-teacher-data", requireSignIn, getAllTeacherData);

module.exports = router;
