const mongoose = require("mongoose");

const savedRecipeSchema = new mongoose.Schema(
  {
    recipe: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Recipe",
      required: true,
    },
    savedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false },
);

const savedIngredientSchema = new mongoose.Schema(
  {
    ingredient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ingredient",
      required: true,
    },
    recipe: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Recipe",
      required: true,
    },
    addedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false },
);

const savedProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  checked: {
    type: Boolean,
    default: false,
  },
  addedAt: {
    type: Date,
    default: Date.now,
  },
});

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
    },
    savedRecipes: [savedRecipeSchema],
    savedIngredients: [savedIngredientSchema],
    savedProducts: [savedProductSchema],
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  {
    timestamps: true,
  },
);

userSchema.index({ slug: 1 });
userSchema.index({ name: 1 });

const User = mongoose.model("User", userSchema);

module.exports = User;
