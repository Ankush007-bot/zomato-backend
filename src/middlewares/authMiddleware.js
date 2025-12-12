const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    // token header se lo
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ msg: "No token provided" });
    }

    // token verify
    const decoded = jwt.verify(token, process.env.ACCESS_SECRET);
    

    // user ko request object me daal do
    req.user = decoded;

    next(); // proceed to next middleware/controller
  } catch (error) {
    console.log(error);
    return res.status(401).json({ msg: "Invalid or expired token" });
  }
};
