const express = require("express");
const { upload, addFilesPathToBody } = require("../middlewares/uploadFiles");
const {
  protect,
  restrictTo,
  authenticateWithGoogleId,
} = require("../middlewares/auth");
const {
  signup,
  login,
  logout,
  updatePassword,
  forgotPassword,
  resetPassword,
  updateProfile,
  userProfile,
  deleteAccount,
  verifyAccount,
  allUsers,
  loginWithGoogle,
  verifyUserAccount,
} = require("../controllers/authentication");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/loginwithgoogle", authenticateWithGoogleId, loginWithGoogle);
router.post("/logout", protect, logout);
router.post("/forgotpassword", forgotPassword);
router.post("/reset/password", resetPassword);
router.patch("/updatepassword", protect, updatePassword);
router.patch("/verifyaccount/:id", protect, restrictTo("admin"), verifyAccount);
router.patch(
  "/updateprofile",
  protect,
  upload().fields([
    { name: "profileImage", maxCount: 1 },
    { name: "cnicImage", maxCount: 2 },
  ]),
  addFilesPathToBody,
  updateProfile
);
router.get("/userprofile", protect, userProfile);
router.delete("/deleteaccount", protect, deleteAccount);
router.get("/all/users", allUsers);
router.patch("/verifyaccount", verifyUserAccount);

module.exports = router;