const express = require("express");
const {
  register,
  signin,
  getAllData,
  Signout,
  deleteData,
  editData,
  forgotPassword,
  resetPassword,
} = require("../controllers/commonController");
const { upload, requireSignIn } = require("../middlewares/middleware");
const {
  validateSignupRequest,
  isRequestValidated,
  validateSigninRequest,
} = require("../Validators/validators");
const router = express.Router();

router.post(
  "/:role/register",
  upload.single("profile_pic"),
  //   validateSignupRequest,
  //   isRequestValidated,
  requireSignIn,
  register
);

router.post("/:role/signin", validateSigninRequest, isRequestValidated, signin);
router.post("/signout", Signout);
router.get("/:role/get-all-data", requireSignIn, getAllData);
router.delete("/:role/delete-data/:_id", requireSignIn, deleteData);
router.put("/:role/edit-data", requireSignIn, editData);
router.post("/forgot-password", forgotPassword);
router.put("/reset-password", resetPassword);

module.exports = router;
