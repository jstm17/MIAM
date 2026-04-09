const app = require("../app");
const connectDB = require("../config/dbConfig");

connectDB();

module.exports = app;
