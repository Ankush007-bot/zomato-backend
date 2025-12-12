const express = require("express");
const auth = require("../middlewares/authMiddleware");
const { getUserProfile, updateUserAddress,changePassword } = require("../controllers/userController");

const router = express.Router();

router.get("/profile", auth, getUserProfile);
router.put("/address", auth, updateUserAddress);
router.put("/change-password", auth, changePassword);


module.exports = router;
