const express = require("express");
const auth = require("../middlewares/authMiddleware");
const { adminAuth } = require("../middlewares/admin");
// const { getUserProfile, updateUserAddress } = require("../controllers/userController");

const {
  addRestaurant,
  getAllRestaurants,
  getRestaurantById,
  updateRestaurant,
  deleteRestaurant,
} = require("../controllers/restaurantController");

const router = express.Router();


router.post("/add", auth, adminAuth, addRestaurant);
router.get("/", getAllRestaurants);
router.get("/:id", getRestaurantById);
router.put("/:id", auth, adminAuth, updateRestaurant);
router.delete("/:id", auth, adminAuth, deleteRestaurant);

module.exports = router;


// router.post("/add", auth, adminAuth, addRestaurant);