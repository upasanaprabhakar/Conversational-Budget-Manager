import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { connectDB } from "./db.js";
import Budget from "./models/budget.js";
import Expense from "./models/expense.js";
import User from "./models/user.js";

dotenv.config(); 

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const DEFAULT_USER_ID = "507f1f77bcf86cd799439011";

const ensureDefaultUser = async () => {
  try {
    const exists = await User.findById(DEFAULT_USER_ID);

    if (!exists) {
      await User.create({ _id: DEFAULT_USER_ID, name: "Default User" });
      console.log("✅ Default user created:", DEFAULT_USER_ID);
    } else {
      console.log("✅ Default user already exists:", DEFAULT_USER_ID);
    }
  } catch (error) {
    console.error("❌ Error ensuring default user:", error);
  }
};

// Connect to MongoDB and then ensure default user
const initializeApp = async () => {
  await connectDB();
  await ensureDefaultUser();
};

initializeApp();

// ===== UTILITY FUNCTIONS =====

const getCurrentMonthYear = () => {
  const now = new Date();
  const month = now.toLocaleString("en-US", { month: "long" });
  const year = now.getFullYear();
  return { month, year };
};

// This function is kept for backward compatibility or direct API usage
// Frontend already handles NLP parsing, so this is optional
const parseExpenseFromText = (text) => {
  const lowerText = text.toLowerCase();
  
  const amountMatch = lowerText.match(/(\d+)/);
  if (!amountMatch) return null;
  const amount = parseInt(amountMatch[1]);

  // Simple fallback - frontend should handle categorization
  return { amount, category: "Shopping", description: text };
};

const checkBudgetAlerts = async (budget, category) => {
  const alerts = [];
  const cat = budget.categories[category];
  
  if (!cat || cat.limit === 0) return alerts;

  const percentage = (cat.spent / cat.limit) * 100;

  if (percentage >= 100 && !budget.alerts.some(a => a.category === category && a.type === "threshold_100")) {
    alerts.push({
      type: "threshold_100",
      category,
      message: `You've exceeded your ${category} budget limit of ₹${cat.limit}!`,
    });
  } else if (percentage >= 80 && percentage < 100 && !budget.alerts.some(a => a.category === category && a.type === "threshold_80")) {
    alerts.push({
      type: "threshold_80",
      category,
      message: `Warning: You've used 80% of your ${category} budget (₹${cat.spent} of ₹${cat.limit})`,
    });
  } else if (percentage >= 50 && percentage < 80 && !budget.alerts.some(a => a.category === category && a.type === "threshold_50")) {
    alerts.push({
      type: "threshold_50",
      category,
      message: `You've used 50% of your ${category} budget (₹${cat.spent} of ₹${cat.limit})`,
    });
  }

  return alerts;
};

// ===== ROUTES =====

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "Budget Manager API is running" });
});

// Get or create budget for current month
app.get("/api/budget/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const { month, year } = getCurrentMonthYear();

    let budget = await Budget.findOne({ user: userId, month, year });

    if (!budget) {
      // Create default budget
      budget = new Budget({
        user: userId,
        month,
        year,
        totalBudget: 8500,
        totalSpent: 0,
        categories: {
          Food: { limit: 3000, spent: 0 },
          Transport: { limit: 1500, spent: 0 },
          Entertainment: { limit: 1000, spent: 0 },
          Shopping: { limit: 2000, spent: 0 },
          Health: { limit: 1000, spent: 0 },
          Investment: { limit: 0, spent: 0 },
        },
        alerts: [],
      });
      await budget.save();
    }

    res.json({ success: true, data: budget });
  } catch (error) {
    console.error("Error fetching budget:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update budget limits
app.put("/api/budget/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const { totalBudget, categories } = req.body;
    const { month, year } = getCurrentMonthYear();

    let budget = await Budget.findOne({ user: userId, month, year });

    if (!budget) {
      return res.status(404).json({ success: false, error: "Budget not found" });
    }

    // Update category limits if provided
    if (categories) {
      Object.keys(categories).forEach((category) => {
        if (budget.categories[category]) {
          budget.categories[category].limit = categories[category].limit;
        }
      });
    }

    // If totalBudget is provided, use it, otherwise calculate from category limits
    if (totalBudget !== undefined) {
      budget.totalBudget = totalBudget;
    } else {
      // Recalculate total budget as sum of all category limits
      budget.totalBudget = Object.values(budget.categories).reduce(
        (sum, cat) => sum + (cat.limit || 0),
        0
      );
    }

    budget.updatedAt = Date.now();
    await budget.save();

    res.json({ success: true, data: budget });
  } catch (error) {
    console.error("Error updating budget:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create expense
app.post("/api/expenses/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const { amount, category, description, entryMethod, confidence } = req.body;

    console.log("📝 Create expense request:", { userId, amount, category, description });

    // Validate required fields
    if (!amount || !category || !description) {
      return res.status(400).json({
        success: false,
        error: "Amount, category, and description are required",
      });
    }

    // Validate amount is a number
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    if (isNaN(numAmount) || numAmount <= 0) {
      return res.status(400).json({ 
        success: false, 
        error: "Invalid amount" 
      });
    }

    // Create expense
    const expense = new Expense({
      user: userId,
      amount: numAmount,
      category,
      description,
      entryMethod: entryMethod || "text",
      confidence: confidence || 100,
      date: new Date(),
    });

    await expense.save();
    console.log("✅ Expense saved:", expense._id);

    // Update budget
    const { month, year } = getCurrentMonthYear();
    let budget = await Budget.findOne({ user: userId, month, year });

    if (!budget) {
      console.log("📊 Creating new budget for", month, year);
      budget = new Budget({
        user: userId,
        month,
        year,
        totalBudget: 8500,
        totalSpent: 0,
        categories: {
          Food: { limit: 3000, spent: 0 },
          Transport: { limit: 1500, spent: 0 },
          Entertainment: { limit: 1000, spent: 0 },
          Shopping: { limit: 2000, spent: 0 },
          Health: { limit: 1000, spent: 0 },
          Investment: { limit: 0, spent: 0 },
        },
        alerts: [],
      });
      await budget.save();
    }

    // Check if category exists, if not add it with 0 limit
    if (!budget.categories[category]) {
      console.log("⚠️ Category not found in budget, adding:", category);
      budget.categories[category] = { limit: 0, spent: 0 };
    }

    // Update spending
    budget.categories[category].spent += numAmount;
    budget.totalSpent += numAmount;
    
    // Check for alerts
    const newAlerts = await checkBudgetAlerts(budget, category);
    if (newAlerts.length > 0) {
      budget.alerts.push(...newAlerts);
      console.log("🔔 New alerts:", newAlerts.length);
    }
    
    budget.updatedAt = Date.now();
    await budget.save();
    console.log("✅ Budget updated");

    // Calculate percentage
    const categoryData = budget.categories[category];
    const percentage = categoryData.limit > 0 
      ? Math.round((categoryData.spent / categoryData.limit) * 100) 
      : 0;

    res.json({
      success: true,
      data: expense,
      budget: budget,
      message: `Logged! ₹${numAmount} added to ${category} category. You've spent ₹${categoryData.spent} on ${category.toLowerCase()} ${categoryData.limit > 0 ? `(${percentage}% of budget)` : ''}.`,
    });
  } catch (error) {
    console.error("❌ Error creating expense:", error);
    console.error("Stack trace:", error.stack);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create expense from frontend-parsed data
// Frontend handles NLP, backend just stores the data
app.post("/api/expenses/:userId/parse", async (req, res) => {
  try {
    const { userId } = req.params;
    const { amount, category, description, entryMethod } = req.body;

    console.log("📝 Parse expense request:", { userId, amount, category, description, entryMethod });

    // Validate required fields (frontend should send these already parsed)
    if (!amount || !category || !description) {
      console.error("❌ Missing required fields:", { amount, category, description });
      return res.status(400).json({ 
        success: false, 
        error: "Amount, category, and description are required" 
      });
    }

    // Validate amount is a number
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    if (isNaN(numAmount) || numAmount <= 0) {
      return res.status(400).json({ 
        success: false, 
        error: "Invalid amount" 
      });
    }

    // Create expense
    const expense = new Expense({
      user: userId,
      amount: numAmount,
      category,
      description,
      entryMethod: entryMethod || "text",
      date: new Date(),
    });

    await expense.save();
    console.log("✅ Expense saved:", expense._id);

    // Update budget
    const { month, year } = getCurrentMonthYear();
    let budget = await Budget.findOne({ user: userId, month, year });

    if (!budget) {
      console.log("📊 Creating new budget for", month, year);
      budget = new Budget({
        user: userId,
        month,
        year,
        totalBudget: 8500,
        totalSpent: 0,
        categories: {
          Food: { limit: 3000, spent: 0 },
          Transport: { limit: 1500, spent: 0 },
          Entertainment: { limit: 1000, spent: 0 },
          Shopping: { limit: 2000, spent: 0 },
          Health: { limit: 1000, spent: 0 },
          Investment: { limit: 0, spent: 0 },
        },
        alerts: [],
      });
      await budget.save();
    }

    // Check if category exists, if not add it with 0 limit
    if (!budget.categories[category]) {
      console.log("⚠️ Category not found in budget, adding:", category);
      budget.categories[category] = { limit: 0, spent: 0 };
    }

    // Update spending
    budget.categories[category].spent += numAmount;
    budget.totalSpent += numAmount;
    
    // Check for alerts
    const newAlerts = await checkBudgetAlerts(budget, category);
    if (newAlerts.length > 0) {
      budget.alerts.push(...newAlerts);
      console.log("🔔 New alerts:", newAlerts.length);
    }
    
    budget.updatedAt = Date.now();
    await budget.save();
    console.log("✅ Budget updated");

    const categoryData = budget.categories[category];
    const percentage = categoryData.limit > 0 
      ? Math.round((categoryData.spent / categoryData.limit) * 100) 
      : 0;

    res.json({
      success: true,
      data: expense,
      budget: budget,
      message: `Logged! ₹${numAmount} added to ${category} category. You've spent ₹${categoryData.spent} on ${category.toLowerCase()} ${categoryData.limit > 0 ? `(${percentage}% of budget)` : ''}.`,
    });
  } catch (error) {
    console.error("❌ Error parsing expense:", error);
    console.error("Stack trace:", error.stack);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get all expenses for user
app.get("/api/expenses/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const { category, startDate, endDate, limit } = req.query;

    let query = { user: userId };

    if (category && category !== "All") {
      query.category = category;
    }

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const expenses = await Expense.find(query)
      .sort({ date: -1 })
      .limit(limit ? parseInt(limit) : 1000);

    res.json({ success: true, data: expenses });
  } catch (error) {
    console.error("Error fetching expenses:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get single expense
app.get("/api/expenses/:userId/:expenseId", async (req, res) => {
  try {
    const { userId, expenseId } = req.params;

    const expense = await Expense.findOne({ _id: expenseId, user: userId });

    if (!expense) {
      return res.status(404).json({ success: false, error: "Expense not found" });
    }

    res.json({ success: true, data: expense });
  } catch (error) {
    console.error("Error fetching expense:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update expense
app.put("/api/expenses/:userId/:expenseId", async (req, res) => {
  try {
    const { userId, expenseId } = req.params;
    const { amount, category, description } = req.body;

    const expense = await Expense.findOne({ _id: expenseId, user: userId });

    if (!expense) {
      return res.status(404).json({ success: false, error: "Expense not found" });
    }

    // Get old values for budget adjustment
    const oldAmount = expense.amount;
    const oldCategory = expense.category;

    // Update expense
    if (amount !== undefined) expense.amount = amount;
    if (category !== undefined) expense.category = category;
    if (description !== undefined) expense.description = description;

    await expense.save();

    // Update budget
    const { month, year } = getCurrentMonthYear();
    const budget = await Budget.findOne({ user: userId, month, year });

    if (budget) {
      // Reverse old transaction
      if (budget.categories[oldCategory]) {
        budget.categories[oldCategory].spent -= oldAmount;
        budget.totalSpent -= oldAmount;
      }

      // Apply new transaction
      if (budget.categories[expense.category]) {
        budget.categories[expense.category].spent += expense.amount;
        budget.totalSpent += expense.amount;
      }

      budget.updatedAt = Date.now();
      await budget.save();
    }

    res.json({ success: true, data: expense, budget });
  } catch (error) {
    console.error("Error updating expense:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Delete expense
app.delete("/api/expenses/:userId/:expenseId", async (req, res) => {
  try {
    const { userId, expenseId } = req.params;

    const expense = await Expense.findOne({ _id: expenseId, user: userId });

    if (!expense) {
      return res.status(404).json({ success: false, error: "Expense not found" });
    }

    console.log("🗑️ Deleting expense:", {
      id: expense._id,
      amount: expense.amount,
      category: expense.category
    });

    // Update budget before deleting
    const { month, year } = getCurrentMonthYear();
    const budget = await Budget.findOne({ user: userId, month, year });

    if (budget) {
      console.log("📊 Budget before delete:", {
        totalSpent: budget.totalSpent,
        categorySpent: budget.categories[expense.category]?.spent
      });

      // Check if category exists, if not create it (shouldn't happen but safety check)
      if (!budget.categories[expense.category]) {
        console.log("⚠️ Category not found in budget, creating:", expense.category);
        budget.categories[expense.category] = { limit: 0, spent: 0 };
      }

      // Update spending
      budget.categories[expense.category].spent -= expense.amount;
      budget.totalSpent -= expense.amount;

      // Ensure spent doesn't go negative
      if (budget.categories[expense.category].spent < 0) {
        budget.categories[expense.category].spent = 0;
      }
      if (budget.totalSpent < 0) {
        budget.totalSpent = 0;
      }

      budget.updatedAt = Date.now();
      
      // Mark the categories field as modified (important for nested objects)
      budget.markModified('categories');
      
      await budget.save();

      console.log("📊 Budget after delete:", {
        totalSpent: budget.totalSpent,
        categorySpent: budget.categories[expense.category]?.spent
      });
    } else {
      console.log("⚠️ No budget found for deletion");
    }

    await Expense.deleteOne({ _id: expenseId });

    res.json({
      success: true,
      message: `Expense of ₹${expense.amount} from ${expense.category} has been deleted.`,
      budget,
    });
  } catch (error) {
    console.error("Error deleting expense:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get spending analytics
app.get("/api/analytics/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const { month, year } = getCurrentMonthYear();

    const budget = await Budget.findOne({ user: userId, month, year });
    const expenses = await Expense.find({ user: userId });

    // Calculate analytics
    const categoryTotals = {};
    const monthlyTrend = {};

    expenses.forEach((expense) => {
      // Category totals
      if (!categoryTotals[expense.category]) {
        categoryTotals[expense.category] = 0;
      }
      categoryTotals[expense.category] += expense.amount;

      // Monthly trend
      const expenseMonth = new Date(expense.date).toLocaleString("en-US", {
        month: "short",
        year: "numeric",
      });
      if (!monthlyTrend[expenseMonth]) {
        monthlyTrend[expenseMonth] = 0;
      }
      monthlyTrend[expenseMonth] += expense.amount;
    });

    res.json({
      success: true,
      data: {
        budget,
        categoryTotals,
        monthlyTrend,
        totalExpenses: expenses.length,
        averageExpense: expenses.length > 0 
          ? Math.round(expenses.reduce((sum, e) => sum + e.amount, 0) / expenses.length)
          : 0,
      },
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get alerts
app.get("/api/alerts/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const { month, year } = getCurrentMonthYear();

    const budget = await Budget.findOne({ user: userId, month, year });

    if (!budget) {
      return res.json({ success: true, data: [] });
    }

    res.json({ success: true, data: budget.alerts });
  } catch (error) {
    console.error("Error fetching alerts:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Clear alerts
app.delete("/api/alerts/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const { month, year } = getCurrentMonthYear();

    const budget = await Budget.findOne({ user: userId, month, year });

    if (!budget) {
      return res.status(404).json({ success: false, error: "Budget not found" });
    }

    budget.alerts = [];
    budget.updatedAt = Date.now();
    await budget.save();

    res.json({ success: true, message: "Alerts cleared" });
  } catch (error) {
    console.error("Error clearing alerts:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// TEMPORARY: Reset budget - DELETE THIS ROUTE AFTER USING
app.delete("/api/budget/:userId/reset", async (req, res) => {
  try {
    const { userId } = req.params;
    await Budget.deleteMany({ user: userId });
    console.log("🗑️ All budgets deleted for user:", userId);
    res.json({ success: true, message: "Budget reset successfully. Refresh the app to create a new budget." });
  } catch (error) {
    console.error("Error resetting budget:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Server error:", err);
  res.status(500).json({
    success: false,
    error: err.message || "Internal server error",
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Route not found",
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Budget Manager API ready`);
});