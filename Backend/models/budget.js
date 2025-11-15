import mongoose from "mongoose";

const budgetSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  month: {
    type: String,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  totalBudget: {
    type: Number,
    required: true,
  },
  totalSpent: {
    type: Number,
    default: 0,
  },
  categories: {
    Food: {
      limit: Number,
      spent: { type: Number, default: 0 },
    },
    Transport: {
      limit: Number,
      spent: { type: Number, default: 0 },
    },
    Entertainment: {
      limit: Number,
      spent: { type: Number, default: 0 },
    },
    Shopping: {
      limit: Number,
      spent: { type: Number, default: 0 },
    },
    Health: {
      limit: Number,
      spent: { type: Number, default: 0 },
    },
  },
  alerts: [
    {
      type: {
        type: String,
        enum: [
          "threshold_50",
          "threshold_80",
          "threshold_100",
          "predicted_overspend",
        ],
      },
      category: String,
      message: String,
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Compound index for faster queries
budgetSchema.index({ user: 1, year: 1, month: 1 });

export default mongoose.model("Budget", budgetSchema);
