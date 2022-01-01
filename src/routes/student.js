const express = require("express");
const {
  deleteStudentData,
  editStudentData,
  getAllStudentData,
} = require("../controllers/student");
const {
  studentRegister,
  studentSignin,
  studentSignout,
} = require("../controllers/student");
const { requireSignIn } = require("../middlewares/middleware");
const { validateSignupRequest, isRequestValidated, validateSigninRequest } = require("../Validators/validators");
const router = express.Router();

router.post("/register", validateSignupRequest, isRequestValidated, requireSignIn, studentRegister);
router.post("/signin", validateSigninRequest, isRequestValidated, studentSignin);
router.post("/signout", studentSignout);
router.delete("/delete-student/:_id", requireSignIn, deleteStudentData);
router.put("/edit-student-data", requireSignIn, editStudentData);
router.get("/get-all-student-data", requireSignIn, getAllStudentData);

module.exports = router;
