const Restaurant = require("../models/Restaurant");

exports.addRestaurant = async (req, res) => {
  try {
    const { name, address, city, cuisine, image } = req.body;

    const restaurant = await Restaurant.create({
      name,
      address,
      city,
      cuisine,
      image,
      createdBy: req.user.id,
    });

    res.json({
      message: "Restaurant added successfully!",
      restaurant,
    });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong!", error });
  }
};




exports.getAllRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find().sort({ createdAt: -1 });

    res.json(restaurants);
  } catch (err) {
    res.status(500).json({ message: "Something went wrong!", err });
  }
};



exports.getRestaurantById = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);

    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found!" });
    }

    res.json(restaurant);
  } catch (err) {
    res.status(500).json({ message: "Something went wrong!", err });
  }
};



exports.updateRestaurant = async (req, res) => {
  try {
    const updated = await Restaurant.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Restaurant not found!" });
    }

    res.json({
      message: "Restaurant updated successfully!",
      updated,
    });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong!", err });
  }
};




exports.deleteRestaurant = async (req, res) => {
  try {
    const deleted = await Restaurant.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Restaurant not found!" });
    }

    res.json({
      message: "Restaurant deleted successfully!",
    });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong!", err });
  }
};
