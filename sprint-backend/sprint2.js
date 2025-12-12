// 🟦 SPRINT 2 — TASK 1: Register API
// 📌 Goal

// User register ho

// Password hash ho

// Email unique ho

// Proper error handling ho

// Clean folder structure follow ho

// 🧱 STEP 1 — User Model (models/User.js)

// Agar already banaya hai → Theek
// Nahi banaya → ye final version copy kar le:

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      default: "",
    },

    address: {
      type: String,
      default: "",
    },
     refreshToken: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }    //“Har document ke sath createdAt aur updatedAt auto-add kar de.”
);

module.exports = mongoose.model("User", userSchema);

// 🧱 STEP 2 — Register Controller (controllers/auth.controller.js)

// Aise likho:

exports.register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    // validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // user exists check
    const existedUser = await User.findOne({ email });
    if (existedUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
    });

    return res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server error" });
  }
};

// 🧱 STEP 3 — Auth Route (routes/auth.routes.js)
// const express = require("express");
// const router = express.Router();
// const { register } = require("../controllers/auth.controller");

// router.post("/register", register);

// module.exports = router;

// 🧱 STEP 4 — server.js me route use karo
// const express = require("express");
// const connectDB = require("./config/db");
// const cookieParser = require("cookie-parser");
// const authRoutes = require("./routes/auth.routes");

// const app = express();

// app.use(express.json());
// app.use(cookieParser());
// app.use(require("cors")({
//   origin: "http://localhost:3000",
//   credentials: true
// }));

// connectDB();

// app.use("/auth", authRoutes);

// app.listen(5000, () => console.log("Server running on port 5000"));

// 🧪 STEP 5 — Test API

// POST
// http://localhost:5000/auth/register

// Body (JSON):

// {
//   "name": "Ankush",
//   "email": "ankush@test.com",
//   "password": "123456",
//   "phone": "9999999999"
// }


// Expected response:

// {
//   "message": "User registered successfully",
//   "user": {
//     "id": "65xxxxxx",
//     "name": "Ankush",
//     "email": "ankush@test.com"
//   }
// }



//LOGIN API
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. email exists?
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 2. password compare
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // 3. access token
    const accessToken = jwt.sign(
      { id: user._id },
      process.env.ACCESS_SECRET,
      { expiresIn: "15m" }
    );

    // 4. refresh token
    const refreshToken = jwt.sign(
      { id: user._id },
      process.env.REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    // 5. store refresh token in DB
    user.refreshToken = refreshToken;
    await user.save();

       // PRODUCTION COOKIE
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    // 6. return response
       return res.json({
      message: "Login successful",
      accessToken
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error" });
  }
};










// Sprint-2 → Task 3: Refresh Token API start karte hain.
// Ye real-world Zomato, Swiggy, Ola, Amazon sab me exactly aise hi hota hai.

// ✅ Task 3: Refresh Token API (Token Rotation + New Access Token)

// Jab access token expire ho jata hai (15 minutes), frontend refresh token bhejkar naya access token leta hai.

// 📌 Step 1: Controller — controllers/tokenController.js
// const jwt = require("jsonwebtoken");
// const User = require("../models/User");

const refreshAccessToken = async (req, res) => {
  try {
      const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(400).json({ message: "Refresh token is required" });
    }

    // 1. User with this refresh token?
    const user = await User.findOne({ refreshToken });

    if (!user) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    // 2. Verify refresh token
    jwt.verify(refreshToken, process.env.REFRESH_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: "Refresh token expired or invalid" });
      }

      // 3. Generate new access token
      const newAccessToken = jwt.sign(
        { id: user._id },
        process.env.ACCESS_SECRET,
        { expiresIn: "15m" }
      );

      // 4. (Optional but highly recommended)
      // Token rotation: generate new refresh token also
      const newRefreshToken = jwt.sign(
        { id: user._id },
        process.env.REFRESH_SECRET,
        { expiresIn: "7d" }
      );

      user.refreshToken = newRefreshToken;
      user.save();

      // UPDATE COOKIE
      res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        path: "/",
        maxAge: 7 * 24 * 60 * 60 * 1000
      });

      return res.json({
        message: "Token refreshed",
        accessToken: newAccessToken
      });
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error" });
  }
};

// module.exports = { refreshAccessToken };

// 📌 Step 2: Route — routes/tokenRoutes.js
// const express = require("express");
// const { refreshAccessToken } = require("../controllers/tokenController");

// const router = express.Router();

// router.post("/refresh-token", refreshAccessToken);

// module.exports = router;

// 📌 Step 3: Main File — server.js me route add karo
// app.use("/api/token", require("./routes/tokenRoutes"));

// 📌 Step 4: Postman Testing

// POST → /api/token/refresh-token

// Body
// {
//   "refreshToken": "<old_refresh_token>"
// }

// Response (if valid)
// {
//   "message": "New tokens generated",
//   "accessToken": "new_access_token",
//   "refreshToken": "new_refresh_token"
// }

// 🔥 Real-World Behavior
// Scenario	Result
// Access token expired	New access token mil jayega
// Refresh token expired	User ko login karna padega
// Refresh token leaked	DB me stored hote hi revoke ho jayega
// Multiple devices	Har device ka alag refresh token store hoga



// authController
exports.logoutUser = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.json({ message: "Already logged out" });
    }

    // Delete from DB
    const user = await User.findOne({ refreshToken });
    if (user) {
      user.refreshToken = null;
      await user.save();
    }

    // Clear cookie
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/"
    });

    return res.json({ message: "Logout successful" });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error" });
  }
};



// middlewares/auth.js

const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // Check format: "Bearer token"
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.ACCESS_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "Token expired or invalid" });
      }

      req.userId = decoded.id; // store userId for next handlers
      next();
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = auth;


// ✔ Real-world token validation
// ✔ Unauthorized user block
// ✔ Adds req.userId so next route knows "which user"


// ✅ STEP 2 — Create Protected Routes (User Info)

// Create file:

// routes/userRoutes.js

const express = require("express");
const auth = require("../middlewares/auth");
const { getUserProfile, updateUserAddress } = require("../controllers/userController");

const router = express.Router();

router.get("/profile", auth, getUserProfile);
router.put("/address", auth, updateUserAddress);

module.exports = router;




//controllers/userController.js

const User = require("../models/User");

const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password -refreshToken");
    return res.json({ user });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};

const updateUserAddress = async (req, res) => {
  try {
    const { address } = req.body;

    const user = await User.findById(req.userId);
    user.address = address;
    await user.save();

    return res.json({ message: "Address updated", user });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getUserProfile, updateUserAddress };


// ✔ Profile data return
// ✔ Password + refreshToken hidden
// ✔ Address update secure












// 🔥 Task 6: Forgot Password + Reset Password (OTP Flow)

// (100% Production Level, Real Zomato Style)

// Full Flow:

// 1️⃣ User email deta hai →
// 2️⃣ Server OTP generate karta hai (6-digit, expiry 5 min)
// 3️⃣ OTP + expiry DB me save
// 4️⃣ Email se OTP send
// 5️⃣ User OTP verify karta hai
// 6️⃣ Password reset karta hai (new hashed password)

// 💡 Step 1: Forgot Password (Send OTP)
// API: POST /auth/forgot-password

// Body:

{
  "email": "user@gmail.com"
}


// Output:

// OTP email sent

// Save OTP + expiry in DB

// 💡 Step 2: Verify OTP
// API: POST /auth/verify-otp

// Body:

{
  "email": "user@gmail.com",
  "otp": "123456"
}


// Output:

// OTP valid → return temp token to allow password reset

// 💡 Step 3: Reset Password
// API: POST /auth/reset-password

// Body:

{
  "email": "user@gmail.com",
  "newPassword": "xxxx",
  "token": "<temp-reset-token>"
}


// Output:

// Password updated

// Old OTP removed










// ✅ Step 1 — Forgot Password (Send OTP Email)
// 🎯 What this API will do?

// User apna email dega

// Hum check karenge user exists hai ya nahi

// Hum generate karenge:

// 6-digit OTP

// expiry = 5 minutes

// OTP + expiry User collection me store karenge

// Email per OTP send karenge (using Nodemailer)

// 🔧 1. User Model Update (Add OTP fields)

// Your existing schema me yeh 2 fields add kar:

// otp: {
//   type: String,
//   default: null,
// },
// otpExpiry: {
//   type: Date,
//   default: null,
// },

// 🔧 2. Install Nodemailer
// npm install nodemailer

// 🔧 3. Create OTP generator utility

// utils/generateOtp.js

// function generateOTP() {
//   return Math.floor(100000 + Math.random() * 900000).toString();
// }

// module.exports = generateOTP;

// 🔧 4. Create Email Sender Utility

// utils/sendEmail.js

// const nodemailer = require("nodemailer");

// const sendEmail = async (to, subject, text) => {
//   const transporter = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//       user: process.env.EMAIL_USER,
//       pass: process.env.EMAIL_PASS,
//     },
//   });

//   await transporter.sendMail({
//     from: process.env.EMAIL_USER,
//     to,
//     subject,
//     text,
//   });
// };

// module.exports = sendEmail;

// 🔧 5. Forgot Password Controller

// controllers/authController.js

// const User = require("../models/User");
// const generateOTP = require("../utils/generateOtp");
// const sendEmail = require("../utils/sendEmail");

// exports.forgotPassword = async (req, res) => {
//   try {
//     const { email } = req.body;

//     const user = await User.findOne({ email });

//     if (!user) {
//       return res.status(404).json({ message: "User not found!" });
//     }

//     const otp = generateOTP();
//     const otpExpiry = Date.now() + 5 * 60 * 1000; // 5 minutes

//     user.otp = otp;
//     user.otpExpiry = otpExpiry;
//     await user.save();

//     await sendEmail(
//       email,
//       "Your Password Reset OTP",
//       `Your OTP is ${otp}. It is valid for 5 minutes.`
//     );

//     res.json({ message: "OTP sent to email!" });
//   } catch (error) {
//     res.status(500).json({ message: "Something went wrong!", error });
//   }
// };

// 🔧 6. Route

// routes/authRoutes.js

// router.post("/forgot-password", forgotPassword);














// ✅ Step 2 — Verify OTP
// ✔ User email + OTP send karega
// ✔ Hum OTP check karenge
// ✔ Expiry check karenge
// ✔ Agar valid → hum ek temporary reset token generate karenge

// (ye token password reset karne ke liye 1-time valid hoga)

// This is exactly how Zomato, Swiggy, Razorpay karte hain.

// 🔥 Why temp reset token?

// OTP verify hone ke baad user ko password reset allowed karna hota hai

// Directly password reset karne dena insecure hai

// Isliye hum ek short-lived JWT token banate hain (15 minutes)

// 📌 Controller Code: verifyOtp

// File: controllers/authController.js

// const jwt = require("jsonwebtoken");
// const User = require("../models/User");

// exports.verifyOtp = async (req, res) => {
//   try {
//     const { email, otp } = req.body;

//     const user = await User.findOne({ email });

//     if (!user) {
//       return res.status(404).json({ message: "User not found!" });
//     }

//     // OTP match check
//     if (user.otp !== otp) {
//       return res.status(400).json({ message: "Invalid OTP!" });
//     }

//     // Expiry check
//     if (Date.now() > user.otpExpiry) {
//       return res.status(400).json({ message: "OTP expired!" });
//     }

//     // Generate a TEMP RESET TOKEN (valid for 15 min)
//     const resetToken = jwt.sign(
//       { email: user.email },
//       process.env.RESET_TOKEN_SECRET,
//       { expiresIn: "15m" }
//     );

//     // Clear OTP (security best practice)
//     user.otp = null;
//     user.otpExpiry = null;
//     await user.save();

//     res.json({
//       message: "OTP verified successfully!",
//       resetToken,
//     });
//   } catch (error) {
//     res.status(500).json({ message: "Something went wrong!", error });
//   }
// };

// 📌 Add Route

// routes/authRoutes.js

// router.post("/verify-otp", verifyOtp);

// 📌 Add env variable

// .env

// RESET_TOKEN_SECRET=someverystrongsecretkey

// 🎉 Step 2 Done!

// Now flow is:

// 🔹 User forgot password → OTP goes to email
// 🔹 User enters OTP → We verify
// 🔹 If correct → we return resetToken (15 min valid)

















// ✅ Step 3 — Reset Password Using resetToken
// Flow:

// Frontend reset page → email + newPassword + resetToken send karega

// Server resetToken verify karega

// Password bcrypt se hash hoga

// Password update hoga

// User ko success response milega

// Old token expire ho jayega (1-time usable)

// 📌 Controller Code: resetPassword

// File: controllers/authController.js

// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const User = require("../models/User");

// exports.resetPassword = async (req, res) => {
//   try {
//     const { email, newPassword, resetToken } = req.body;

//     // Step 1: Validate token
//     let decoded;
//     try {
//       decoded = jwt.verify(resetToken, process.env.RESET_TOKEN_SECRET);
//     } catch (err) {
//       return res.status(401).json({ message: "Invalid or expired reset token!" });
//     }

//     // Step 2: Verify email from token
//     if (decoded.email !== email) {
//       return res.status(400).json({ message: "Invalid email!" });
//     }

//     // Step 3: Find user
//     const user = await User.findOne({ email });

//     if (!user) {
//       return res.status(404).json({ message: "User not found!" });
//     }

//     // Step 4: Hash new password
//     const hashedPassword = await bcrypt.hash(newPassword, 10);

//     // Step 5: Update password
//     user.password = hashedPassword;
//     await user.save();

//     res.json({
//       message: "Password reset successful! You can now login with new password.",
//     });
//   } catch (error) {
//     res.status(500).json({ message: "Something went wrong!", error });
//   }
// };

// 📌 Route Add Karo

// routes/authRoutes.js

// router.post("/reset-password", resetPassword);

// 📌 Environment Variable Already Added
// RESET_TOKEN_SECRET=someverystrongkey

// 🎉 Step 3 Done — Password Reset Feature Complete

// Real world level:
// ✔ OTP Send
// ✔ OTP Verify
// ✔ Reset Token
// ✔ Password Reset with bcrypt
// ✔ Secure one-time flow

// Zomato, Swiggy, Paytm, all same process.