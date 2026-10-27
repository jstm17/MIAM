const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const userRoutes = require("./routes/userRoutes");
const recipeRoutes = require("./routes/recipeRoutes");
const ingredientRoutes = require("./routes/ingredientRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const cookingTimeRoutes = require("./routes/cookingTimeRoutes");
const testUploadRoutes = require("./routes/testUpload");
const adminRoutes = require("./routes/adminRoutes");
const chatRoutes = require("./routes/chatRoutes");

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://192.168.1.198:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("API running 🚀");
});

app.use("/api/users", userRoutes);
app.use("/api/recipes", recipeRoutes);
app.use("/api/ingredients", ingredientRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/cooking-times", cookingTimeRoutes);
app.use("/api/upload", testUploadRoutes);
app.use("/api/admins", adminRoutes);
app.use("/api/chat", chatRoutes);

module.exports = app;
