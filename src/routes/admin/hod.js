const express = require("express");
const {
  deleteHodData,
  editHodData,
  getAllHodData,
  // verifyToken,
} = require("../../controllers/admin/hod");
const {
  hodRegister,
  hodSignin,
  hodSignout,
} = require("../../controllers/admin/hod");
const { requireSignIn, upload } = require("../../middlewares/middleware");
const { isRequestValidated, validateSigninRequest, validateSignupRequesthod } = require("../../Validators/validators");
const router = express.Router();

router.post("/register", upload.single("profile_pic"), validateSignupRequesthod, isRequestValidated, requireSignIn, hodRegister);
router.post("/signin", validateSigninRequest, isRequestValidated, hodSignin);
router.post("/signout", hodSignout);
router.delete("/delete-hod/:_id", requireSignIn, deleteHodData);
router.put("/edit-hod-data", requireSignIn, editHodData);
router.get("/get-all-hod-data", requireSignIn, getAllHodData);
// router.post("/authentication/verify-token", verifyToken);

module.exports = router;
