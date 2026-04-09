const serverless = require("serverless-http");
const app = require("../app");
const connectDB = require("../config/dbConfig");

// let isConnected = false;

// const connectToDB = async () => {
//   if (!isConnected) {
//     await connectDB();
//     isConnected = true;
//   }
// };

connectDB();

module.exports = async (req, res) => {
  console.log("CLIENT_URL:", process.env.CLIENT_URL);
  await connectDB();
  return serverless(app)(req, res);
};
