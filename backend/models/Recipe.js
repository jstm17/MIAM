// models/Recipe.js
const mongoose = require("mongoose");

const ingredientSchema = new mongoose.Schema(
  {
    ingredient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ingredient",
      required: true,
    },
    quantity: {
      type: String,
      required: true,
    },
  },
  { _id: false },
);

const instructionSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
  },
  { _id: false },
);

const recipeSchema = new mongoose.Schema(
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
    ingredients: [ingredientSchema],
    timePrep: {
      type: Number,
      required: true,
      trim: true,
    },
    timeCook: {
      type: Number,
      required: true,
      trim: true,
    },
    categories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
      },
    ],
    instructions: [instructionSchema],
    personsNumber: {
      type: Number,
      required: true,
      trim: true,
    },
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

recipeSchema.index({ addedBy: 1 });
recipeSchema.index({ categories: 1 });
recipeSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Recipe", recipeSchema);
