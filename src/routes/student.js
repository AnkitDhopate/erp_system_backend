const express = require("express");
const {
  studentRegister,
  studentSignin,
  studentSignout,
} = require("../controllers/student");
const { requireSignIn } = require("../middlewares/middleware");
const router = express.Router();

router.post("/register", requireSignIn, studentRegister);
router.post("/signin", studentSignin);
router.post("/signout", studentSignout);

module.exports = router;
