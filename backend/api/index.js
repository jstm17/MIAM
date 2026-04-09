const serverless = require("serverless-http");
const app = require("../app");
const connectDB = require("../config/dbConfig");

let isConnected = false;

const connectToDB = async () => {
  if (!isConnected) {
    await connectDB();
    isConnected = true;
  }
};

module.exports = async (req, res) => {
  await connectToDB();
  return serverless(app)(req, res);
};
