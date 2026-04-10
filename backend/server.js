require("dotenv").config();
const app = require("./app");
const connectDB = require("./config/dbConfig");

const PORT = process.env.APP_PORT || 5000;

connectDB();

app.listen(PORT, () => {
  app.listen(PORT, "0.0.0.0", () => console.log(`http://localhost:${PORT}`));
});
