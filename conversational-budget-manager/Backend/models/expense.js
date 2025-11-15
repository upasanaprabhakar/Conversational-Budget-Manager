import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      required: [true, "Please provide an amount"],
      min: [0, "Amount cannot be negative"],
    },
    category: {
      type: String,
      required: [true, "Please provide a category"],
      enum: ["Food", "Transport", "Entertainment", "Shopping", "Health", "Investment"],
    },
    description: {
      type: String,
      required: [true, "Please provide a description"],
      trim: true,
      maxlength: [200, "Description cannot exceed 200 characters"],
    },
    date: {
      type: Date,
      default: Date.now,
    },
    entryMethod: {
      type: String,
      enum: ["voice", "text"],
      default: "text",
    },
    confidence: {
      type: Number,
      min: 0,
      max: 100,
      default: 100,
    },
    metadata: {
      processingTime: Number,
      transcription: String,
      merchant: String,
      tags: [String],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
expenseSchema.index({ user: 1, date: -1 });
expenseSchema.index({ user: 1, category: 1 });

export default mongoose.model("Expense", expenseSchema);