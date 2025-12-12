const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const generateOTP = require("../utils/generateOtp");
const sendEmail = require("../utils/sendEmail");

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




exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    const otp = generateOTP();
    const otpExpiry = Date.now() + 5 * 60 * 1000; // 5 minutes

    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save();

    await sendEmail(
      email,
      "Your Password Reset OTP",
      `Your OTP is ${otp}. It is valid for 5 minutes.`
    );

    res.json({ message: "OTP sent to email!" });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong!", error });
  }
};




exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    // OTP match check
    if (user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP!" });
    }

    // Expiry check
    if (Date.now() > user.otpExpiry) {
      return res.status(400).json({ message: "OTP expired!" });
    }

    // Generate a TEMP RESET TOKEN (valid for 15 min)
    const resetToken = jwt.sign(
      { email: user.email },
      process.env.RESET_TOKEN_SECRET,
      { expiresIn: "15m" }
    );

    // Clear OTP (security best practice)
    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    res.json({
      message: "OTP verified successfully!",
      resetToken,
    });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong!", error });
  }
};




exports.resetPassword = async (req, res) => {
  try {
    const { email, newPassword, resetToken } = req.body;

    // Step 1: Validate token
    let decoded;
    try {
      decoded = jwt.verify(resetToken, process.env.RESET_TOKEN_SECRET);
    } catch (err) {
      return res.status(401).json({ message: "Invalid or expired reset token!" });
    }

    // Step 2: Verify email from token
    if (decoded.email !== email) {
      return res.status(400).json({ message: "Invalid email!" });
    }

    // Step 3: Find user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    // Step 4: Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Step 5: Update password
    user.password = hashedPassword;
    await user.save();

    res.json({
      message: "Password reset successful! You can now login with new password.",
    });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong!", error });
  }
};