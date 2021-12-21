const express = require("express");
const {
  adminRegister,
  adminSignin,
  adminSignout,
} = require("../../controllers/admin/admin");
const { requireSignIn } = require("../../middlewares/middleware");
const router = express.Router();

router.post("/register", requireSignIn, adminRegister);
router.post("/signin", adminSignin);
router.post("/signout", adminSignout);

module.exports = router;
