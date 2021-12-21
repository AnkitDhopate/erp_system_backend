const express = require("express");
const {
  hodRegister,
  hodSignin,
  hodSignout,
} = require("../../controllers/admin/hod");
const { requireSignIn } = require("../../middlewares/middleware");
const router = express.Router();

router.post("/register", requireSignIn, hodRegister);
router.post("/signin", hodSignin);
router.post("/signout", hodSignout);

module.exports = router;
