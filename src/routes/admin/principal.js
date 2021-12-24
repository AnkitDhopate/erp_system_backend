const express = require("express");
const {
  deletePrincipalData,
  editPrincipalData,
  getAllPrincipalData,
} = require("../../controllers/admin/principal");
const {
  principalRegister,
  principalSignin,
  principalSignout,
} = require("../../controllers/admin/principal");
const { requireSignIn } = require("../../middlewares/middleware");
const router = express.Router();

router.post("/register", requireSignIn, principalRegister);
router.post("/signin", principalSignin);
router.post("/signout", principalSignout);
router.delete("/delete-principal/:_id", requireSignIn, deletePrincipalData);
router.put("/edit-principal-data", requireSignIn, editPrincipalData);
router.get("/get-all-principal-data", requireSignIn, getAllPrincipalData);

module.exports = router;
