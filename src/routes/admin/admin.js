const express = require("express");
const {
  deleteAdminData,
  editAdminData,
  getAllAdminData,
} = require("../../controllers/admin/admin");
const {
  adminRegister,
  adminSignin,
  adminSignout,
} = require("../../controllers/admin/admin");
const { requireSignIn } = require("../../middlewares/middleware");
const router = express.Router();

router.post("/register", requireSignIn, adminRegister);
router.post("/signin", adminSignin);
router.post("/signout", adminSignout);
router.delete("/delete-admin/:_id", requireSignIn, deleteAdminData);
router.put("/edit-admin-data", requireSignIn, editAdminData);
router.get("/get-all-admin-data", requireSignIn, getAllAdminData);

module.exports = router;
