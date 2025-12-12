const express = require("express");
const auth = require("../middlewares/authMiddleware");
// const { getUserProfile, updateUserAddress } = require("../controllers/userController");

const router = express.Router();


// router.post("/add", auth, adminAuth, addRestaurant);