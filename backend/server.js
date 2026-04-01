require("dotenv").config();

const express = require("express");
const connectDB = require("./config/dbConfig");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");

const app = express();
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.APP_PORT || 5000;

app.get("/", (req, res) => {
  res.send("API MERN fonctionne 🚀");
});
app.use(
  "/api/users/",
  (req, res, next) => {
    console.log("Hit:", req.method, req.path);
    next();
  },
  userRoutes,
);

connectDB();

app.listen(PORT, () => console.log(`http://localhost:${PORT}`));
