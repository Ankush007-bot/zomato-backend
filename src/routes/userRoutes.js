const express = require("express");
const auth = require("../middlewares/authMiddleware");
const { getUserProfile, updateUserAddress } = require("../controllers/userController");

const router = express.Router();

router.get("/profile", auth, getUserProfile);
router.put("/address", auth, updateUserAddress);

module.exports = router;
