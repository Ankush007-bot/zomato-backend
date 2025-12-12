const mongoose = require("mongoose");

const restaurantSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    cuisine: { type: String, required: true },
    image: { type: String, default: "" },
    rating: { type: Number, default: 0 },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Restaurant", restaurantSchema);


// Real-Life Example:
// Agar user Banana hain:
// User
// {
//   _id: 65bfa88a91ba2,
//   name: "Ankush",
//   email: "test@gmail.com"
// }


// Aur jab user ek restaurant add kare:

// Restaurant
// {
//   name: "Pizza Hut",
//   city: "Noida",
//   createdBy: 65bfa88a91ba2   ← user ka id
// }

// createdBy restaurant ko kis user ne create kiya, wo store karta hai

// ref: "User" se ye batata hai ki ye id User collection ko refer karti hai


// {
//   name: "Pizza Hut",
//   createdBy: {
//     _id: ...,
//     name: "Ankush",
//     email: "ankush@gmail.com"
//   }
// }