const express = require("express");
const {
  deleteAdminData,
  editAdminData,
  getAllAdminData,
  verifyToken,
  forgotPassword,
  resetPassword,
} = require("../../controllers/admin/admin");
const {
  adminRegister,
  adminSignin,
  adminSignout,
} = require("../../controllers/admin/admin");
const { requireSignIn, upload } = require("../../middlewares/middleware");
const {
  isRequestValidated,
  validateSigninRequest,
  validateSignupRequestAdmin,
} = require("../../Validators/validators");
const router = express.Router();

router.post(
  "/register",
  upload.single("profile_pic"),
  validateSignupRequestAdmin,
  isRequestValidated,
  requireSignIn,
  adminRegister
);
router.post("/signin", validateSigninRequest, isRequestValidated, adminSignin);
router.post("/signout", adminSignout);
router.delete("/delete-admin/:_id", requireSignIn, deleteAdminData);
router.put("/edit-admin-data", requireSignIn, editAdminData);
router.get("/get-all-admin-data", requireSignIn, getAllAdminData);
router.post("/authentication/verify-token", verifyToken);
router.post("/forgot-password", forgotPassword);
router.put("/reset-password", resetPassword);

module.exports = router;
