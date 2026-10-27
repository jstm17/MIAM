const mongoose = require("mongoose");

const chatQuotaSchema = new mongoose.Schema(
  {
    period: {
      type: String,
      required: true,
      unique: true,
    },
    tokensUsed: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("ChatQuota", chatQuotaSchema);
