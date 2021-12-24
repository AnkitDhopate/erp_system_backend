const express = require("express");
const {
  deleteHodData,
  editHodData,
  getAllHodData,
} = require("../../controllers/admin/hod");
const {
  hodRegister,
  hodSignin,
  hodSignout,
} = require("../../controllers/admin/hod");
const { requireSignIn } = require("../../middlewares/middleware");
const router = express.Router();

router.post("/register", requireSignIn, hodRegister);
router.post("/signin", hodSignin);
router.post("/signout", hodSignout);
router.delete("/delete-hod/:_id", requireSignIn, deleteHodData);
router.put("/edit-hod-data", requireSignIn, editHodData);
router.get("/get-all-hod-data", requireSignIn, getAllHodData);


module.exports = router;
