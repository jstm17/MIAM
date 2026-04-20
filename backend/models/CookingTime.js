const mongoose = require("mongoose");

const cookingTimeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      trim: true,
    },
    device: {
      type: String,
      trim: true,
    },
    degreeCook: {
      type: Number,
      trim: true,
    },
    timeCook: {
      type: Number,
      trim: true,
    },
    methodCook: {
      type: String,
      trim: true,
    },
    notes: {
      type: String,
      trim: true,
    },
    categories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
      },
    ],
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    image: {
      type: String,
    },
    visible: {
      type: Boolean,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

cookingTimeSchema.index({ addedBy: 1 });
cookingTimeSchema.index({ categories: 1 });
cookingTimeSchema.index({ createdAt: -1 });

module.exports = mongoose.model("CookingTime", cookingTimeSchema);
