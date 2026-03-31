const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connecté"))
  .catch((err) => console.log(err));

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API MERN fonctionne 🚀");
});

const userRoutes = require("./routes/userRoutes");
app.use("/api/users", userRoutes);

app.listen(5000, () => console.log("Server running on port 5000"));
