require("dotenv").config();

const express = require("express");
const connectDB = require("./config/dbConfig");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const recipeRoutes = require("./routes/recipeRoutes");
const ingredientRoutes = require("./routes/ingredientRoutes");
const categoryRoutes = require("./routes/categoryRoutes");

const app = express();
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.APP_PORT || 5000;

app.use("/api/users/", userRoutes);
app.use("/api/recipes/", recipeRoutes);
app.use("/api/ingredients/", ingredientRoutes);
app.use("/api/categories/", categoryRoutes);
const testUploadRoutes = require("./routes/testUpload");
app.use("/api/upload", testUploadRoutes);

connectDB();

app.listen(PORT, () => console.log(`http://localhost:${PORT}`));
