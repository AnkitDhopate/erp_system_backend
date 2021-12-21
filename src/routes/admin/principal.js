const express = require("express");
const {
  principalRegister,
  principalSignin,
  principalSignout,
} = require("../../controllers/admin/principal");
const { requireSignIn } = require("../../middlewares/middleware");
const router = express.Router();

router.post("/register", requireSignIn, principalRegister);
router.post("/signin", principalSignin);
router.post("/signout", principalSignout);

module.exports = router;
