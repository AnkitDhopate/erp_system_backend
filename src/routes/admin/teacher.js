const express = require("express");
const {
  teacherRegister,
  teacherSignin,
  teacherSignout,
} = require("../../controllers/admin/teacher");
const { requireSignIn } = require("../../middlewares/middleware");
const router = express.Router();

router.post("/teacher/register", requireSignIn, teacherRegister);
router.post("/teacher/signin", teacherSignin);
router.post("/teacher/signout", teacherSignout);

module.exports = router;
