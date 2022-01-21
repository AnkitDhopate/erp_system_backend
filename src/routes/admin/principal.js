const express = require("express");
const {
  deletePrincipalData,
  editPrincipalData,
  getAllPrincipalData,
  forgotPassword,
  resetPassword,
} = require("../../controllers/admin/principal");
const {
  principalRegister,
  principalSignin,
  principalSignout,
} = require("../../controllers/admin/principal");
const { requireSignIn, upload } = require("../../middlewares/middleware");
const { isRequestValidated, validateSigninRequest, validateSignupRequestAdmin } = require("../../Validators/validators");
const router = express.Router();

router.post("/register",upload.single("profile_pic"), validateSignupRequestAdmin,isRequestValidated, requireSignIn, principalRegister);
router.post("/signin", validateSigninRequest, isRequestValidated, principalSignin);
router.post("/signout", principalSignout);
router.delete("/delete-principal/:_id", requireSignIn, deletePrincipalData);
router.put("/edit-principal-data", requireSignIn, editPrincipalData);
router.get("/get-all-principal-data", requireSignIn, getAllPrincipalData);
router.post("/forgot-password", forgotPassword);
router.put("/reset-password", resetPassword);

module.exports = router;
