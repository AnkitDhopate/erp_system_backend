const express = require("express");
const {
    adminRegister,
    adminSignin,
    adminSignout,
} = require("../../controllers/admin/admin");
const { requireSignIn } = require("../../middlewares/middleware");
const router = express.Router();

router.post("/admin/register", adminRegister);
router.post("/admin/signin", adminSignin);
router.post("/admin/signout", adminSignout);

module.exports = router;