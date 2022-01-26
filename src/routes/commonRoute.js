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
  uploadLearingResource,
  view_learning_resources,
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
router.post(
  "/upload-learing-resource",
  upload.single("file_path"),
  requireSignIn,
  uploadLearingResource
);
router.get("/learning-resources", requireSignIn, view_learning_resources);

module.exports = router;
