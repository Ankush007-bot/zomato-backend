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

const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id);

    // Old password check
    const isMatch = await bcrypt.compare(oldPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Old password is incorrect!" });
    }

    // Hash new password
    const hashed = await bcrypt.hash(newPassword, 10);

    user.password = hashed;
    await user.save();

    res.json({ message: "Password changed successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong!" });
  }
};


// Bhai .select("-password") Mongoose ka feature hai, MongoDB ka nahi.
// Aur yeh bahut purana feature hai — Mongoose ke initial versions (v3/v4) se hi available hai.

// Matlab:

// ✔ MongoDB me .find() me select nahi hota
// ✔ Mongoose me hota hai

// 🔥 .select("-password") Actually karta kya hai?

// Yeh query ke result me se password field ko hata deta hai.

// Example:

// User.find().select("-password");


// Return hoga:

// {
//   _id: "123",
//   name: "Ankush",
//   email: "abc@gmail.com"
//   // ❌ password removed
// }

// 🔥 1. .select() — Choose/Exclude Fields

// Query ke result me se kaunse fields chahiye / nahi chahiye, wo control karta hai.

// Example:
// User.find().select("name email")


// Sirf ye fields milenge:

// { name: "Ankush", email: "a@gmail.com" }

// Exclude:
// User.find().select("-password")


// Password hata dega.

// Use-case:

// ✔ Sensitive data hide karna
// ✔ Response size kam karna

// 🔥 2. .populate() — Join-like data fetch

// MongoDB me SQL ki tarah join nahi hota,
// lekin Mongoose me .populate() reference ke sath data fetch karta hai.

// Example:

// Restaurant schema:

// createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }


// Query:

// Restaurant.find().populate("createdBy");


// Output:

// {
//   name: "Pizza Hut",
//   createdBy: {
//     _id: "user123",
//     name: "Ankush",
//     email: "a@gmail.com"
//   }
// }

// Use-case:

// ✔ Dusre collection ka poora data laana
// ✔ One-to-many, many-to-many relationships

// 🔥 3. .lean() — Fastest Query (plain JS object)

// By default Mongoose result deta hai Mongoose Document Object, jisme heavy metadata hota hai.

// .lean() use karte hi Mongoose:

// ✔ Plain JavaScript object return karta hai
// ✔ Fast
// ✔ Lightweight
// ✔ Better for read-only operations

// Example:
// const users = await User.find().lean();


// Output:

// Array of plain objects, no mongoose functions attached.

// Kab use kare?

// ✔ Jab tum result sirf read kar rahe ho
// ✔ API responses me speed chahiye
// ✔ Big lists fetch karni ho, jaise homescreen, product list
module.exports = { getUserProfile, updateUserAddress,changePassword };
