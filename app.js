const express = require("express");
// const cors = require("cors");

const app = express();

// app.use(cors());
app.use(express.json());

const cookieParser = require("cookie-parser");
app.use(cookieParser());


app.use(require("cors")({
  origin: "http://localhost:3000",
  credentials: true
}));

const auth = require("./src/middlewares/authMiddleware");


const authRoutes = require("./src/routes/authRoutes");
const protectedRoutes = require("./src/routes/protectedRoutes");


const restaurantRoutes = require("./src/routes/restaurantRoutes");

app.use("/api/restaurants", restaurantRoutes);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/protected", protectedRoutes);
app.use("/api/token", require("./src/routes/tokenRoutes"));


const userRoutes = require("./src/routes/userRoutes");
app.use("/api/user", userRoutes);


// test route
app.get("/", (req, res) => {
  res.send("Zomato Backend Running...");
});

module.exports = app;
