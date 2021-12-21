const express = require("express");
const {
  teacherRegister,
  teacherSignin,
  teacherSignout,
} = require("../../controllers/admin/teacher");
const { requireSignIn } = require("../../middlewares/middleware");
const router = express.Router();

router.post("/register", requireSignIn, teacherRegister);
router.post("/signin", teacherSignin);
router.post("/signout", teacherSignout);

module.exports = router;
