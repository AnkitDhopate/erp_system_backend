const express = require("express");
const {
    principalRegister,
    principalSignin,
    principalSignout,
} = require("../../controllers/admin/principal");
const { requireSignIn } = require("../../middlewares/middleware");
const router = express.Router();

router.post("/principal/register", principalRegister);
router.post("/principal/signin", principalSignin);
router.post("/principal/signout", principalSignout);

module.exports = router;