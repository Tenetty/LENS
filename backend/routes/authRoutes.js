const express = require("express");
const router = express.Router();
const {
  registerUser,
  registerAdmin,
  loginUser,
  logoutUser,
  resetpasswordrequest,
  resetpassword,
  checkEmailExists,
} = require("../controllers/authController");
const { requireAdmin } = require("../middleware/authMiddleware");

router.post("/register", registerUser);
router.post("/register-admin", requireAdmin, registerAdmin);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/forgot-password", resetpasswordrequest);
router.post("/reset-password", resetpassword);
router.get("/check-email", checkEmailExists);

module.exports = router;
