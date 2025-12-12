const express = require("express");
const router = express.Router();
const { register, loginUser, forgotPassword, logout,verifyOtp,resetPassword } = require('../controllers/authControllers');

router.post("/register", register);
 router.post("/login", loginUser);
// router.post("/refresh", refresh);
 router.post("/logout", logout);
 router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", verifyOtp);
router.post("/reset-password", resetPassword);

module.exports = router;
