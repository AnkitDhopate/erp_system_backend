const express = require("express");
const { register, signin, getAllData, Signout, deleteData, editData } = require("../controllers/commonController");
const { upload, requireSignIn } = require("../middlewares/middleware");
const {
  validateSignupRequest,
  isRequestValidated,
  validateSigninRequest,
} = require("../Validators/validators");
const router = express.Router();

// router.post(
//   "/register",
//   upload.single("profile_pic"),
//   validateSignupRequestAdmin,
//   isRequestValidated,
//   requireSignIn,
//   adminRegister
// );
// router.post("/signin", validateSigninRequest, isRequestValidated, adminSignin);
// router.post("/signout", adminSignout);
// router.delete("/delete-admin/:_id", requireSignIn, deleteAdminData);
// router.put("/edit-admin-data", requireSignIn, editAdminData);
// router.get("/get-all-admin-data", requireSignIn, getAllAdminData);
// router.post("/forgot-password", forgotPassword);
// router.put("/reset-password", resetPassword);

router.post(
  "/:role/register",
  upload.single("profile_pic"),
  //   validateSignupRequest,
  //   isRequestValidated,
  requireSignIn,
  register
);

router.post("/:role/signin", validateSigninRequest, isRequestValidated, signin);
router.post("/:role/signout", Signout);
router.get("/:role/get-all-data", requireSignIn, getAllData);
router.delete("/:role/delete-data/:_id", requireSignIn, deleteData);
router.put("/:role/edit-data", requireSignIn, editData);

module.exports = router;
