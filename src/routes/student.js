const express = require("express");
const {
  deleteStudentData,
  editStudentData,
  getAllStudentData,
  forgotPassword,
  resetPassword,
} = require("../controllers/student");
const {
  studentRegister,
  studentSignin,
  studentSignout,
} = require("../controllers/student");
const { requireSignIn, upload } = require("../middlewares/middleware");
const { validateSignupRequest, isRequestValidated, validateSigninRequest } = require("../Validators/validators");
const router = express.Router();

router.post("/register", upload.single("profile_pic"), validateSignupRequest, isRequestValidated, requireSignIn, studentRegister);
router.post("/signin", validateSigninRequest, isRequestValidated, studentSignin);
router.post("/signout", studentSignout);
router.delete("/delete-student/:_id", requireSignIn, deleteStudentData);
router.put("/edit-student-data", requireSignIn, editStudentData);
router.get("/get-all-student-data", requireSignIn, getAllStudentData);
router.post("/forgot-password", forgotPassword);
router.put("/reset-password", resetPassword);

module.exports = router;
