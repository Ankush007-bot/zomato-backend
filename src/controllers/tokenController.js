const jwt = require("jsonwebtoken");
const User = require("../models/User");

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

module.exports = { refreshAccessToken };
