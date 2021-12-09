const express = require("express");
const { studentRegister,
    studentSignin,
    studentSignout } = require("../controllers/student");
const router = express.Router();


router.post("/register", studentRegister);
router.post("/signin", studentSignin);
router.post("/signout", studentSignout);

module.exports = router;


