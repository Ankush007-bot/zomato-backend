const User = require("../models/User");

const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password -refreshToken");
    return res.json({ user });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};

const updateUserAddress = async (req, res) => {
  try {
    const { address } = req.body;
    const user = await User.findById(req.user.id);
    user.address = address;
    await user.save();

    return res.json({ message: "Address updated", user });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getUserProfile, updateUserAddress };
