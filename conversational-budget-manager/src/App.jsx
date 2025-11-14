import React, { useState, useEffect } from 'react';
import { Mic, Send, TrendingUp, DollarSign, ShoppingBag, Car, Film, Heart, Zap, Menu, Bell, Home, BarChart3, Settings, User, MessageSquare, PieChart, Trash2, Edit2, X, Check, Calendar, Filter, ArrowUpDown, UtensilsCrossed, Activity } from 'lucide-react';

const BudgetManager = () => {
  const [currentScreen, setCurrentScreen] = useState('chat');
  const [isListening, setIsListening] = useState(false);
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState([
    { type: 'ai', text: 'Hi! I\'m your budget assistant. Tell me about your expenses like "Spent 250 on lunch"', time: '10:30 AM' }
  ]);
  const [expenses, setExpenses] = useState([]);
  const [budget, setBudget] = useState({
    total: 8500,
    spent: 0,
    categories: {
      Food: { spent: 0, limit: 3000, icon: UtensilsCrossed, color: 'from-orange-400 to-orange-600' },
      Transport: { spent: 0, limit: 1500, icon: Car, color: 'from-blue-400 to-blue-600' },
      Entertainment: { spent: 0, limit: 1000, icon: Film, color: 'from-purple-400 to-purple-600' },
      Shopping: { spent: 0, limit: 2000, icon: ShoppingBag, color: 'from-pink-400 to-pink-600' },
      Health: { spent: 0, limit: 1000, icon: Activity, color: 'from-red-400 to-red-600' }
    }
  });
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [editingLimit, setEditingLimit] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [sortBy, setSortBy] = useState('date');

  const getCurrentTime = () => {
    const now = new Date();
    return now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  const parseExpenseFromText = (text) => {
    const lowerText = text.toLowerCase();
    
    const amountMatch = lowerText.match(/(\d+)/);
    if (!amountMatch) return null;
    const amount = parseInt(amountMatch[1]);

    let category = 'Shopping';
    if (lowerText.includes('lunch') || lowerText.includes('food') || lowerText.includes('dinner') || 
        lowerText.includes('breakfast') || lowerText.includes('coffee') || lowerText.includes('restaurant')) {
      category = 'Food';
    } else if (lowerText.includes('uber') || lowerText.includes('cab') || lowerText.includes('transport') || 
               lowerText.includes('metro') || lowerText.includes('bus') || lowerText.includes('taxi')) {
      category = 'Transport';
    } else if (lowerText.includes('movie') || lowerText.includes('entertainment') || lowerText.includes('game') || 
               lowerText.includes('concert')) {
      category = 'Entertainment';
    } else if (lowerText.includes('medicine') || lowerText.includes('doctor') || lowerText.includes('health') || 
               lowerText.includes('gym')) {
      category = 'Health';
    }

    return { amount, category };
  };

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    const userMessage = { type: 'user', text: inputText, time: getCurrentTime() };
    setMessages(prev => [...prev, userMessage]);

    const expenseData = parseExpenseFromText(inputText);
    
    if (expenseData) {
      const { amount, category } = expenseData;
      
      const newBudget = { ...budget };
      newBudget.categories[category].spent += amount;
      newBudget.spent += amount;
      setBudget(newBudget);

      const newExpense = {
        id: Date.now(),
        amount,
        category,
        description: inputText,
        date: new Date().toLocaleDateString(),
        timestamp: Date.now()
      };
      setExpenses(prev => [...prev, newExpense]);

      const weeklySpent = newBudget.categories[category].spent;
      const categoryLimit = newBudget.categories[category].limit;
      const percentage = Math.round((weeklySpent / categoryLimit) * 100);

      const aiResponse = {
        type: 'ai',
        text: `Logged! ₹${amount} added to ${category} category. You've spent ₹${weeklySpent} on ${category.toLowerCase()} (${percentage}% of budget).`,
        time: getCurrentTime()
      };
      
      setTimeout(() => {
        setMessages(prev => [...prev, aiResponse]);
      }, 500);
    } else {
      const aiResponse = {
        type: 'ai',
        text: 'I can help you track expenses! Try saying something like "Spent 250 on lunch" or "Paid 100 for cab"',
        time: getCurrentTime()
      };
      setTimeout(() => {
        setMessages(prev => [...prev, aiResponse]);
      }, 500);
    }

    setInputText('');
  };

  const handleVoiceClick = () => {
    setIsListening(true);
    
    setTimeout(() => {
      setIsListening(false);
      setInputText('Spent 250 on lunch');
    }, 3000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const deleteExpense = (expenseId) => {
    const expense = expenses.find(e => e.id === expenseId);
    if (expense) {
      const newBudget = { ...budget };
      newBudget.categories[expense.category].spent -= expense.amount;
      newBudget.spent -= expense.amount;
      setBudget(newBudget);
      setExpenses(prev => prev.filter(e => e.id !== expenseId));
      
      const aiResponse = {
        type: 'ai',
        text: `Expense of ₹${expense.amount} from ${expense.category} has been deleted.`,
        time: getCurrentTime()
      };
      setMessages(prev => [...prev, aiResponse]);
    }
  };

  const startEditingCategory = (category) => {
    setEditingCategory(category);
    setEditingLimit(budget.categories[category].limit.toString());
  };

  const updateCategoryLimit = (category) => {
    const newLimit = parseInt(editingLimit);
    if (newLimit > 0) {
      const newBudget = { ...budget };
      const oldLimit = newBudget.categories[category].limit;
      newBudget.categories[category].limit = newLimit;
      newBudget.total = newBudget.total - oldLimit + newLimit;
      setBudget(newBudget);
    }
    setEditingCategory(null);
  };

  const getFilteredAndSortedExpenses = () => {
    let filtered = [...expenses];
    
    if (filterCategory !== 'All') {
      filtered = filtered.filter(e => e.category === filterCategory);
    }
    
    filtered.sort((a, b) => {
      if (sortBy === 'date') {
        return b.timestamp - a.timestamp;
      } else if (sortBy === 'amount') {
        return b.amount - a.amount;
      } else if (sortBy === 'category') {
        return a.category.localeCompare(b.category);
      }
      return 0;
    });
    
    return filtered;
  };

  const getTotalByCategory = (category) => {
    return expenses
      .filter(e => e.category === category)
      .reduce((sum, e) => sum + e.amount, 0);
  };

  const getRecentExpenses = () => {
    return [...expenses]
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 5);
  };

  const remaining = budget.total - budget.spent;
  const spentPercentage = budget.total > 0 ? (budget.spent / budget.total) * 100 : 0;

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 to-blue-50 w-full overflow-hidden">
      {/* Sidebar */}
      <div className="w-72 bg-white border-r border-gray-200 shadow-xl flex flex-col flex-shrink-0">
        {/* Logo */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <DollarSign size={28} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">BudgetAI</h1>
              <p className="text-xs text-gray-500">Smart Finance Manager</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <button
            onClick={() => setCurrentScreen('chat')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl mb-2 transition-all ${
              currentScreen === 'chat'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <MessageSquare size={20} />
            <span className="font-medium">Chat Assistant</span>
          </button>
          <button
            onClick={() => setCurrentScreen('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl mb-2 transition-all ${
              currentScreen === 'dashboard'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <PieChart size={20} />
            <span className="font-medium">Dashboard</span>
          </button>
          <button
            onClick={() => setCurrentScreen('expenses')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl mb-2 transition-all ${
              currentScreen === 'expenses'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <BarChart3 size={20} />
            <span className="font-medium">All Expenses</span>
          </button>
          <button
            onClick={() => setCurrentScreen('settings')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl mb-2 transition-all ${
              currentScreen === 'settings'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Settings size={20} />
            <span className="font-medium">Budget Settings</span>
          </button>
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
              U
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-800">User</p>
              <p className="text-xs text-gray-500">Premium Plan</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {currentScreen === 'chat' && (
          <>
            {/* Header */}
            <div className="bg-white border-b border-gray-200 shadow-sm">
              <div className="px-8 py-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-800">Conversational Budget Assistant</h2>
                    <p className="text-gray-500 mt-1">Track expenses naturally through conversation</p>
                  </div>
                  <Bell size={24} className="text-gray-400 cursor-pointer hover:text-gray-600" />
                </div>
                
                {/* Quick Stats Row */}
                <div className="grid grid-cols-4 gap-4">
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-5 rounded-2xl border border-blue-100">
                    <p className="text-sm text-gray-600 mb-1">Monthly Budget</p>
                    <p className="text-3xl font-bold text-blue-600">₹{budget.total.toLocaleString()}</p>
                  </div>
                  <div className="bg-gradient-to-br from-orange-50 to-red-50 p-5 rounded-2xl border border-orange-100">
                    <p className="text-sm text-gray-600 mb-1">Total Spent</p>
                    <p className="text-3xl font-bold text-orange-600">₹{budget.spent.toLocaleString()}</p>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-5 rounded-2xl border border-green-100">
                    <p className="text-sm text-gray-600 mb-1">Remaining</p>
                    <p className="text-3xl font-bold text-green-600">₹{remaining.toLocaleString()}</p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-5 rounded-2xl border border-purple-100">
                    <p className="text-sm text-gray-600 mb-1">Budget Used</p>
                    <p className="text-3xl font-bold text-purple-600">{Math.round(spentPercentage)}%</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-8">
              <div className="max-w-4xl mx-auto space-y-6">
                {messages.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-2xl ${
                      msg.type === 'user' 
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white' 
                        : 'bg-white text-gray-800 border border-gray-200'
                      } rounded-2xl px-6 py-4 shadow-lg`}>
                      <p className="text-base leading-relaxed">{msg.text}</p>
                      <p className={`text-xs mt-2 ${msg.type === 'user' ? 'text-blue-100' : 'text-gray-400'}`}>{msg.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Voice Listening Overlay */}
            {isListening && (
              <div className="absolute inset-0 bg-gradient-to-br from-blue-900/95 via-indigo-900/95 to-purple-900/95 backdrop-blur-sm flex items-center justify-center z-50">
                <div className="text-center">
                  <div className="relative mb-8">
                    <div className="absolute inset-0 bg-blue-400 rounded-full animate-ping opacity-20"></div>
                    <div className="absolute inset-0 bg-blue-500 rounded-full animate-pulse opacity-30"></div>
                    <div className="relative w-32 h-32 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center shadow-2xl mx-auto">
                      <Mic size={56} className="text-white" />
                    </div>
                  </div>
                  
                  <p className="text-4xl font-bold text-white mb-3">Listening...</p>
                  <p className="text-blue-200 text-lg mb-8">Speak naturally about your expense</p>
                  
                  <div className="flex items-center justify-center gap-2 h-20 mb-8">
                    {[...Array(15)].map((_, i) => (
                      <div
                        key={i}
                        className="w-2 bg-gradient-to-t from-blue-400 to-blue-200 rounded-full animate-pulse"
                        style={{
                          height: `${Math.random() * 50 + 20}px`,
                          animationDelay: `${i * 0.1}s`
                        }}
                      />
                    ))}
                  </div>

                  <button
                    onClick={() => setIsListening(false)}
                    className="px-8 py-4 bg-red-500 text-white rounded-2xl font-semibold hover:bg-red-600 transition-all shadow-2xl"
                  >
                    Stop Listening
                  </button>
                </div>
              </div>
            )}

            {/* Input Area */}
            <div className="bg-white border-t border-gray-200 shadow-2xl p-6">
              <div className="max-w-4xl mx-auto">
                <div className="flex items-center gap-4">
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your expense like 'Spent 250 on lunch' or 'Paid 100 for cab'..."
                    className="flex-1 py-4 px-6 bg-gray-50 rounded-2xl text-base focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-200"
                  />
                  <button
                    onClick={handleSendMessage}
                    className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl font-semibold hover:shadow-xl transition-all duration-200 flex items-center gap-2"
                  >
                    <Send size={20} />
                    Send
                  </button>
                  <button
                    onClick={handleVoiceClick}
                    className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl hover:shadow-2xl transition-all duration-200 hover:scale-105"
                  >
                    <Mic size={28} />
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        {currentScreen === 'dashboard' && (
          <>
            {/* Dashboard Header */}
            <div className="bg-white border-b border-gray-200 shadow-sm px-8 py-6">
              <h2 className="text-3xl font-bold text-gray-800">Financial Dashboard</h2>
              <p className="text-gray-500 mt-1">Complete overview of your spending patterns</p>
            </div>

            {/* Dashboard Content */}
            <div className="flex-1 overflow-y-auto p-8">
              <div className="grid grid-cols-12 gap-6">
                {/* Main Budget Card */}
                <div className="col-span-12 lg:col-span-8">
                  <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white rounded-3xl p-8 shadow-2xl relative overflow-hidden h-full">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24"></div>
                    
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-6">
                        <div>
                          <p className="text-sm opacity-90 mb-2">Total Monthly Budget</p>
                          <p className="text-6xl font-bold">₹{budget.total.toLocaleString()}</p>
                        </div>
                        <DollarSign size={64} className="opacity-30" />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-6 mb-6">
                        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
                          <p className="text-sm opacity-80 mb-1">Spent This Month</p>
                          <p className="text-3xl font-bold">₹{budget.spent.toLocaleString()}</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
                          <p className="text-sm opacity-80 mb-1">Remaining Balance</p>
                          <p className="text-3xl font-bold">₹{remaining.toLocaleString()}</p>
                        </div>
                      </div>
                      
                      <div className="w-full bg-white/20 backdrop-blur-sm rounded-full h-6 mb-3 overflow-hidden">
                        <div 
                          className="bg-gradient-to-r from-orange-400 to-red-500 h-6 rounded-full transition-all duration-500"
                          style={{ width: `${spentPercentage}%` }}
                        />
                      </div>
                      <div className="flex justify-between items-center">
                        <p className="text-lg font-semibold">{Math.round(spentPercentage)}% of budget used</p>
                        <p className="text-sm opacity-80">{100 - Math.round(spentPercentage)}% remaining</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Actions & Recent Expenses */}
                <div className="col-span-12 lg:col-span-4 space-y-4">
                  <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Quick Actions</h3>
                    <button
                      onClick={() => setCurrentScreen('chat')}
                      className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold mb-3 hover:shadow-lg transition-all"
                    >
                      Add Expense
                    </button>
                    <button 
                      onClick={() => setCurrentScreen('expenses')}
                      className="w-full py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all mb-3"
                    >
                      View All Expenses
                    </button>
                    <button
                      onClick={() => setCurrentScreen('settings')}
                      className="w-full py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all"
                    >
                      Budget Settings
                    </button>
                  </div>

                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
                    <Zap className="text-green-600 mb-3" size={32} />
                    <h4 className="font-bold text-gray-800 mb-2">Savings Tip</h4>
                    <p className="text-sm text-gray-600">
                      {budget.spent === 0 
                        ? 'Start tracking your expenses to get personalized savings tips!' 
                        : spentPercentage > 70 
                          ? 'Try to reduce unnecessary spending this week to stay within budget!'
                          : 'Great job managing your budget! Keep up the good work!'}
                    </p>
                  </div>
                </div>

                {/* Categories */}
                <div className="col-span-12">
                  <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Spending by Category</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {Object.entries(budget.categories).map(([category, data]) => {
                        const percentage = data.limit > 0 ? (data.spent / data.limit) * 100 : 0;
                        const remaining = data.limit - data.spent;
                        const IconComponent = data.icon;
                        
                        return (
                          <div key={category} className="group hover:bg-gray-50 p-6 rounded-2xl transition-all duration-200 border border-gray-100">
                            <div className="flex items-center gap-4 mb-4">
                              <div className={`w-16 h-16 bg-gradient-to-br ${data.color} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200`}>
                                <IconComponent size={32} className="text-white" />
                              </div>
                              <div className="flex-1">
                                <h3 className="font-bold text-gray-800 text-lg">{category}</h3>
                                <p className="text-sm text-gray-500">{Math.round(percentage)}% used</p>
                              </div>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-3 mb-3 overflow-hidden">
                              <div 
                                className={`h-3 rounded-full transition-all duration-500 bg-gradient-to-r ${data.color}`}
                                style={{ width: `${Math.min(percentage, 100)}%` }}
                              />
                            </div>
                            <div className="flex justify-between items-center text-sm">
                              <span className="text-gray-600 font-medium">₹{data.spent.toLocaleString()} / ₹{data.limit.toLocaleString()}</span>
                              <span className={`font-bold ${remaining < data.limit * 0.2 ? 'text-red-600' : 'text-green-600'}`}>
                                ₹{remaining.toLocaleString()} left
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Recent Expenses */}
                <div className="col-span-12">
                  <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl font-bold text-gray-800">Recent Expenses</h2>
                      <button
                        onClick={() => setCurrentScreen('expenses')}
                        className="text-blue-600 hover:text-blue-700 font-semibold text-sm"
                      >
                        View All →
                      </button>
                    </div>
                    {getRecentExpenses().length > 0 ? (
                      <div className="space-y-3">
                        {getRecentExpenses().map((expense) => {
                          const IconComponent = budget.categories[expense.category].icon;
                          return (
                            <div key={expense.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all">
                              <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 bg-gradient-to-br ${budget.categories[expense.category].color} rounded-xl flex items-center justify-center`}>
                                  <IconComponent size={24} className="text-white" />
                                </div>
                                <div>
                                  <p className="font-semibold text-gray-800">{expense.description}</p>
                                  <p className="text-sm text-gray-500">{expense.date} • {expense.category}</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-xl font-bold text-gray-800">₹{expense.amount.toLocaleString()}</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <p className="text-gray-400 text-lg">No expenses yet. Start tracking your spending!</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Insights */}
                <div className="col-span-12">
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl p-8 shadow-xl border border-purple-100">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                      <TrendingUp className="text-purple-600" size={32} />
                      Smart Insights & Recommendations
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-white rounded-2xl p-6 shadow-sm border border-purple-100">
                        <TrendingUp className="text-blue-600 mb-3" size={28} />
                        <h4 className="font-semibold text-gray-800 mb-2">Spending Trend</h4>
                        <p className="text-sm text-gray-600">
                          {budget.spent === 0 
                            ? 'Start adding expenses to see your spending trends!'
                            : `You've spent ₹${budget.spent.toLocaleString()} this month. ${spentPercentage > 75 ? 'Consider reducing expenses.' : 'Great job staying within budget!'}`}
                        </p>
                      </div>
                      {spentPercentage > 80 && (
                        <div className="bg-red-50 rounded-2xl p-6 shadow-sm border border-red-200">
                          <Zap className="text-red-600 mb-3" size={28} />
                          <h4 className="font-semibold text-red-800 mb-2">Budget Alert</h4>
                          <p className="text-sm text-red-600">You've used {Math.round(spentPercentage)}% of your budget. Time to cut back on expenses.</p>
                        </div>
                      )}
                      <div className="bg-green-50 rounded-2xl p-6 shadow-sm border border-green-200">
                        <Heart className="text-green-600 mb-3" size={28} />
                        <h4 className="font-semibold text-green-800 mb-2">Money-Saving Tip</h4>
                        <p className="text-sm text-green-600">
                          {expenses.filter(e => e.category === 'Food').length > 3
                            ? 'Try cooking at home more often to save on food expenses!'
                            : 'Set daily spending limits to stay on track with your budget!'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {currentScreen === 'expenses' && (
          <>
            {/* Expenses Header */}
            <div className="bg-white border-b border-gray-200 shadow-sm px-8 py-6">
              <h2 className="text-3xl font-bold text-gray-800">All Expenses</h2>
              <p className="text-gray-500 mt-1">View and manage all your tracked expenses</p>
            </div>

            {/* Filters and Sort */}
            <div className="bg-white border-b border-gray-200 px-8 py-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Filter size={20} className="text-gray-600" />
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="All">All Categories</option>
                    {Object.keys(budget.categories).map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <ArrowUpDown size={20} className="text-gray-600" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="date">Sort by Date</option>
                    <option value="amount">Sort by Amount</option>
                    <option value="category">Sort by Category</option>
                  </select>
                </div>
                <div className="ml-auto">
                  <p className="text-sm text-gray-600">
                    Showing <span className="font-bold text-gray-800">{getFilteredAndSortedExpenses().length}</span> expenses
                  </p>
                </div>
              </div>
            </div>

            {/* Expenses List */}
            <div className="flex-1 overflow-y-auto p-8">
              <div className="max-w-6xl mx-auto">
                {getFilteredAndSortedExpenses().length > 0 ? (
                  <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
                          <tr>
                            <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Category</th>
                            <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Description</th>
                            <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Date</th>
                            <th className="px-6 py-4 text-right text-sm font-bold text-gray-700">Amount</th>
                            <th className="px-6 py-4 text-center text-sm font-bold text-gray-700">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {getFilteredAndSortedExpenses().map((expense) => {
                            const IconComponent = budget.categories[expense.category].icon;
                            return (
                              <tr key={expense.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4">
                                  <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 bg-gradient-to-br ${budget.categories[expense.category].color} rounded-xl flex items-center justify-center`}>
                                      <IconComponent size={20} className="text-white" />
                                    </div>
                                    <span className="font-semibold text-gray-800">{expense.category}</span>
                                  </div>
                                </td>
                                <td className="px-6 py-4">
                                  <p className="text-gray-700">{expense.description}</p>
                                </td>
                                <td className="px-6 py-4">
                                  <div className="flex items-center gap-2 text-gray-600">
                                    <Calendar size={16} />
                                    <span className="text-sm">{expense.date}</span>
                                  </div>
                                </td>
                                <td className="px-6 py-4 text-right">
                                  <span className="text-xl font-bold text-gray-800">₹{expense.amount.toLocaleString()}</span>
                                </td>
                                <td className="px-6 py-4">
                                  <div className="flex items-center justify-center gap-2">
                                    <button
                                      onClick={() => deleteExpense(expense.id)}
                                      className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-all"
                                      title="Delete expense"
                                    >
                                      <Trash2 size={18} />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-12 text-center">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <ShoppingBag size={48} className="text-gray-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">No Expenses Found</h3>
                    <p className="text-gray-500 mb-6">
                      {filterCategory !== 'All' 
                        ? `No expenses in ${filterCategory} category yet.`
                        : 'Start tracking your expenses to see them here.'}
                    </p>
                    <button
                      onClick={() => setCurrentScreen('chat')}
                      className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                    >
                      Add Your First Expense
                    </button>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {currentScreen === 'settings' && (
          <>
            {/* Settings Header */}
            <div className="bg-white border-b border-gray-200 shadow-sm px-8 py-6">
              <h2 className="text-3xl font-bold text-gray-800">Budget Settings</h2>
              <p className="text-gray-500 mt-1">Customize your budget limits for each category</p>
            </div>

            {/* Settings Content */}
            <div className="flex-1 overflow-y-auto p-8">
              <div className="max-w-4xl mx-auto space-y-6">
                {/* Total Budget Card */}
                <div className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-3xl p-8 shadow-2xl">
                  <h3 className="text-2xl font-bold mb-2">Total Monthly Budget</h3>
                  <p className="text-6xl font-bold mb-4">₹{budget.total.toLocaleString()}</p>
                  <p className="text-blue-100">This is the sum of all category limits</p>
                </div>

                {/* Category Settings */}
                <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
                  <h3 className="text-2xl font-bold text-gray-800 mb-6">Category Budget Limits</h3>
                  <div className="space-y-4">
                    {Object.entries(budget.categories).map(([category, data]) => {
                      const IconComponent = data.icon;
                      const percentage = data.limit > 0 ? (data.spent / data.limit) * 100 : 0;
                      return (
                        <div key={category} className="border border-gray-200 rounded-2xl p-6 hover:border-blue-300 transition-all">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-4">
                              <div className={`w-14 h-14 bg-gradient-to-br ${data.color} rounded-2xl flex items-center justify-center shadow-lg`}>
                                <IconComponent size={28} className="text-white" />
                              </div>
                              <div>
                                <h4 className="text-xl font-bold text-gray-800">{category}</h4>
                                <p className="text-sm text-gray-500">
                                  Currently spent: ₹{data.spent.toLocaleString()} ({Math.round(percentage)}%)
                                </p>
                              </div>
                            </div>
                            {editingCategory === category ? (
                              <div className="flex items-center gap-2">
                                <input
                                  type="number"
                                  value={editingLimit}
                                  onChange={(e) => setEditingLimit(e.target.value)}
                                  className="w-32 px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  placeholder="Limit"
                                />
                                <button
                                  onClick={() => updateCategoryLimit(category)}
                                  className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all"
                                >
                                  <Check size={20} />
                                </button>
                                <button
                                  onClick={() => setEditingCategory(null)}
                                  className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all"
                                >
                                  <X size={20} />
                                </button>
                              </div>
                            ) : (
                              <div className="flex items-center gap-4">
                                <div className="text-right">
                                  <p className="text-sm text-gray-600">Budget Limit</p>
                                  <p className="text-2xl font-bold text-gray-800">₹{data.limit.toLocaleString()}</p>
                                </div>
                                <button
                                  onClick={() => startEditingCategory(category)}
                                  className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-all"
                                >
                                  <Edit2 size={20} />
                                </button>
                              </div>
                            )}
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                            <div 
                              className={`h-3 rounded-full transition-all duration-500 bg-gradient-to-r ${data.color}`}
                              style={{ width: `${Math.min(percentage, 100)}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Summary Statistics */}
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl p-8 shadow-xl border border-purple-100">
                  <h3 className="text-2xl font-bold text-gray-800 mb-6">Budget Summary</h3>
                  <div className="grid grid-cols-3 gap-6">
                    <div className="bg-white rounded-2xl p-6 shadow-sm">
                      <p className="text-sm text-gray-600 mb-2">Total Expenses</p>
                      <p className="text-3xl font-bold text-gray-800">{expenses.length}</p>
                    </div>
                    <div className="bg-white rounded-2xl p-6 shadow-sm">
                      <p className="text-sm text-gray-600 mb-2">Average per Expense</p>
                      <p className="text-3xl font-bold text-gray-800">
                        ₹{expenses.length > 0 ? Math.round(budget.spent / expenses.length).toLocaleString() : '0'}
                      </p>
                    </div>
                    <div className="bg-white rounded-2xl p-6 shadow-sm">
                      <p className="text-sm text-gray-600 mb-2">Days Until Reset</p>
                      <p className="text-3xl font-bold text-gray-800">
                        {30 - new Date().getDate()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default BudgetManager;