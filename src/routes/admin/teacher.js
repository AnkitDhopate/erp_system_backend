const express = require("express");
const {
  deleteTeacherData,
  editTeacherData,
  getAllTeacherData,
  forgotPassword,
  resetPassword,
} = require("../../controllers/admin/teacher");
const {
  teacherRegister,
  teacherSignin,
  teacherSignout,
} = require("../../controllers/admin/teacher");
const { requireSignIn, upload } = require("../../middlewares/middleware");
const { isRequestValidated, validateSigninRequest, validateSignupRequesthod } = require("../../Validators/validators");
const router = express.Router();

router.post("/register", upload.single("profile_pic"), validateSignupRequesthod, isRequestValidated, requireSignIn, teacherRegister);
router.post("/signin", validateSigninRequest, isRequestValidated, teacherSignin);
router.post("/signout", teacherSignout);
router.delete("/delete-teacher/:_id", requireSignIn, deleteTeacherData);
router.put("/edit-teacher-data", requireSignIn, editTeacherData);
router.get("/get-all-teacher-data", requireSignIn, getAllTeacherData);
router.post("/forgot-password", forgotPassword);
router.put("/reset-password", resetPassword);

module.exports = router;
