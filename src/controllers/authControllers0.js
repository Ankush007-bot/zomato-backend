const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ msg: "Email already exists" });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    return res.status(201).json({ msg: "Signup successful", user });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal server error" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "Invalid email or password" });
    }

    // compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid email or password" });
    }

    // create JWT
    // const token = jwt.sign(
    //   { id: user._id, email: user.email },
    //   process.env.JWT_SECRET,
    //   { expiresIn: "7d" }
    // );

     const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Save refresh token in DB
    user.refreshTokens.push({ token: refreshToken, createdAt: new Date() });
    await user.save();

    return res.status(200).json({
      msg: "Login successful",
        accessToken,
      refreshToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal server error" });
  }
};


exports.refresh = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken)
      return res.status(401).json({ msg: "No refresh token provided" });

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ msg: "Invalid user" });

    // Check if refresh token exists in DB
    const isValid = user.refreshTokens.find((t) => t.token === refreshToken);
    if (!isValid) return res.status(401).json({ msg: "Refresh token expired" });

    // Token rotation: delete old + add new
    user.refreshTokens = user.refreshTokens.filter(
      (t) => t.token !== refreshToken
    );

    const newRefreshToken = generateRefreshToken(user);
    const newAccessToken = generateAccessToken(user);

    user.refreshTokens.push({
      token: newRefreshToken,
      createdAt: new Date(),
    });

    await user.save();

    res.status(200).json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });

  } catch (error) {
    console.log(error);
    return res.status(401).json({ msg: "Invalid or expired refresh token" });
  }
};


exports.logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    const user = await User.findById(decoded.id);

    user.refreshTokens = user.refreshTokens.filter(
      (t) => t.token !== refreshToken
    );

    await user.save();

    res.json({ msg: "Logged out successfully" });

  } catch (error) {
    console.log(error);
    res.status(400).json({ msg: "Logout failed" });
  }
};
