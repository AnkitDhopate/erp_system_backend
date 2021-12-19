const express = require("express");
const {
    hodRegister,
    hodSignin,
    hodSignout,
} = require("../../controllers/admin/hod");
const { requireSignIn } = require("../../middlewares/middleware");
const router = express.Router();

router.post("/hod/register", hodRegister);
router.post("/hod/signin", hodSignin);
router.post("/hod/signout", hodSignout);

module.exports = router;