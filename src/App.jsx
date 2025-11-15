<<<<<<< HEAD
import React, { useState, useEffect, useRef } from 'react';
import { Mic, Send, TrendingUp, DollarSign, ShoppingBag, Car, Film, Heart, Zap, Menu, Bell, Home, BarChart3, Settings, User, MessageSquare, PieChart, Trash2, Edit2, X, Check, Calendar, Filter, ArrowUpDown, UtensilsCrossed, Activity } from 'lucide-react';
import voiceService from './services/voiceService';
import { processVoiceCommand } from './utils/voiceCommandProcessor';
=======
import React, { useState, useEffect } from 'react';
import { Mic, Send, TrendingUp, DollarSign, ShoppingBag, Car, Film, Heart, Zap, Menu, Bell, Home, BarChart3, Settings, User, MessageSquare, PieChart, Trash2, Edit2, X, Check, Calendar, Filter, ArrowUpDown, UtensilsCrossed, Activity } from 'lucide-react';
>>>>>>> 868cd35c96e4d439f823dfcdd61826bb59358874

const BudgetManager = () => {
  const [currentScreen, setCurrentScreen] = useState('chat');
  const [isListening, setIsListening] = useState(false);
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState([
<<<<<<< HEAD
    { type: 'ai', text: 'Hi! I\'m your voice-enabled budget assistant powered by Agora AI. I can help you: Log expenses ("Spent 250 on lunch"), Navigate ("Show dashboard"), Change settings ("Switch to USD"), Set budgets ("Set food budget 3000"), and answer questions ("Show budget"). Try saying "Help" for more commands!', time: '10:30 AM' }
=======
    { type: 'ai', text: 'Hi! I\'m your budget assistant. Tell me about your expenses like "Spent 250 on lunch" or ask me for savings tips!', time: '10:30 AM' }
>>>>>>> 868cd35c96e4d439f823dfcdd61826bb59358874
  ]);
  const [expenses, setExpenses] = useState([]);
  const [currency, setCurrency] = useState('INR');
  const [savingsGoal, setSavingsGoal] = useState(5000);
  const [currentSavings, setCurrentSavings] = useState(0);
  const [budget, setBudget] = useState({
    total: 8500,
    spent: 0,
    categories: {
      Food: { spent: 0, limit: 3000, icon: UtensilsCrossed, color: 'from-orange-400 to-orange-600' },
      Transport: { spent: 0, limit: 1500, icon: Car, color: 'from-blue-400 to-blue-600' },
      Entertainment: { spent: 0, limit: 1000, icon: Film, color: 'from-purple-400 to-purple-600' },
      Shopping: { spent: 0, limit: 2000, icon: ShoppingBag, color: 'from-pink-400 to-pink-600' },
      Health: { spent: 0, limit: 1000, icon: Activity, color: 'from-red-400 to-red-600' },
      Investment: { spent: 0, limit: 0, icon: TrendingUp, color: 'from-green-400 to-emerald-600' }
    }
  });
  const [editingCategory, setEditingCategory] = useState(null);
  const [editingLimit, setEditingLimit] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [sortBy, setSortBy] = useState('date');
  const [aiSuggestions, setAiSuggestions] = useState([]);
<<<<<<< HEAD
  const [voiceError, setVoiceError] = useState(null);
  const voiceServiceRef = useRef(null);
  
  // Refs to store latest state for voice callbacks (avoid closure issues)
  const budgetRef = useRef(budget);
  const expensesRef = useRef(expenses);
  const currencyRef = useRef(currency);
  const savingsGoalRef = useRef(savingsGoal);
  
  // Update refs when state changes
  useEffect(() => {
    budgetRef.current = budget;
  }, [budget]);
  
  useEffect(() => {
    expensesRef.current = expenses;
  }, [expenses]);
  
  useEffect(() => {
    currencyRef.current = currency;
  }, [currency]);
  
  useEffect(() => {
    savingsGoalRef.current = savingsGoal;
  }, [savingsGoal]);
=======
>>>>>>> 868cd35c96e4d439f823dfcdd61826bb59358874

  const getCurrentTime = () => {
    const now = new Date();
    return now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  const getCurrencySymbol = () => currency === 'INR' ? '₹' : '$';
  
  const convertAmount = (amount) => {
    if (currency === 'USD') {
      return (amount / 83).toFixed(2);
    }
    return amount;
  };

  const formatAmount = (amount) => {
    const converted = convertAmount(amount);
    return `${getCurrencySymbol()}${parseFloat(converted).toLocaleString()}`;
  };

  const parseExpenseFromText = (text) => {
    const lowerText = text.toLowerCase();
    
    const amountMatch = lowerText.match(/(\d+)/);
    if (!amountMatch) return null;
    const amount = parseInt(amountMatch[1]);

    let category = 'Shopping';
    if (lowerText.includes('lunch') || lowerText.includes('food') || lowerText.includes('dinner') ||
        lowerText.includes('breakfast') || lowerText.includes('coffee') || lowerText.includes('coffe') ||
        lowerText.includes('cofe') || lowerText.includes('cofee') ||
        lowerText.includes('restaurant') || lowerText.includes('groceries') || lowerText.includes('snack') || 
        lowerText.includes('candy')) {
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
    } else if (lowerText.includes('invest') || lowerText.includes('stock') || lowerText.includes('mutual fund') ||
               lowerText.includes('sip') || lowerText.includes('bond') || lowerText.includes('crypto')) {
      category = 'Investment';
    }

    return { amount, category };
  };

  const logExpense = (amount, category, description) => {
<<<<<<< HEAD
    let resultText = '';
    
    setBudget(prevBudget => {
      const newBudget = { ...prevBudget };
      
      if (!newBudget.categories[category]) {
        console.error(`Category ${category} not found.`);
        return prevBudget;
      }
      
      newBudget.categories[category].spent += amount;
      newBudget.spent += amount;
      
      const weeklySpent = newBudget.categories[category].spent;
      const categoryLimit = newBudget.categories[category].limit;
      const percentage = categoryLimit > 0 ? Math.round((weeklySpent / categoryLimit) * 100) : 0;
      
      resultText = `Logged! ${formatAmount(amount)} added to ${category} category. You've spent ${formatAmount(weeklySpent)} on ${category.toLowerCase()} ${categoryLimit > 0 ? `(${percentage}% of budget)` : ''}.`;
      
      return newBudget;
    });
=======
    const newBudget = { ...budget };
    
    if (!newBudget.categories[category]) {
      console.error(`Category ${category} not found.`);
      return null;
    }
    
    newBudget.categories[category].spent += amount;
    newBudget.spent += amount;
    setBudget(newBudget);
>>>>>>> 868cd35c96e4d439f823dfcdd61826bb59358874

    const newExpense = {
      id: Date.now(),
      amount,
      category,
      description,
      date: new Date().toLocaleDateString(),
      timestamp: Date.now()
    };
    setExpenses(prev => [...prev, newExpense]);

<<<<<<< HEAD
    return resultText;
=======
    const weeklySpent = newBudget.categories[category].spent;
    const categoryLimit = newBudget.categories[category].limit;
    const percentage = categoryLimit > 0 ? Math.round((weeklySpent / categoryLimit) * 100) : 0;

    return `Logged! ${formatAmount(amount)} added to ${category} category. You've spent ${formatAmount(weeklySpent)} on ${category.toLowerCase()} ${categoryLimit > 0 ? `(${percentage}% of budget)` : ''}.`;
>>>>>>> 868cd35c96e4d439f823dfcdd61826bb59358874
  };

  const generateAISuggestions = () => {
    const suggestions = [];
    const totalSpent = budget.spent;
    const remaining = budget.total - totalSpent;
    const spentPercentage = (totalSpent / budget.total) * 100;

    if (remaining > 1000) {
      const investableAmount = Math.floor(remaining * 0.3);
      suggestions.push({
        id: 'invest-1',
        type: 'investment',
        title: 'Smart Investment Opportunity',
        description: `You have ${formatAmount(remaining)} remaining. Consider investing ${formatAmount(investableAmount)} (30% of remaining) in a diversified mutual fund or index fund for long-term growth.`,
        icon: TrendingUp,
        color: 'from-green-400 to-emerald-600',
        action: 'Invest Now',
        amount: investableAmount
      });
    }

    const foodSpent = budget.categories.Food.spent;
    if (foodSpent > budget.categories.Food.limit * 0.7) {
      const potentialSavings = Math.floor(foodSpent * 0.2);
      suggestions.push({
        id: 'save-food-1',
        type: 'savings',
        title: 'Reduce Food Expenses',
        description: `You're spending a lot on food (${formatAmount(foodSpent)}). Cooking at home more often could save you approximately ${formatAmount(potentialSavings)} per month!`,
        icon: Heart,
        color: 'from-orange-400 to-red-600',
        action: 'View Tips',
        amount: potentialSavings
      });
    }

    const transportSpent = budget.categories.Transport.spent;
    if (transportSpent > budget.categories.Transport.limit * 0.6) {
      const potentialSavings = Math.floor(transportSpent * 0.25);
      suggestions.push({
        id: 'save-transport-1',
        type: 'savings',
        title: 'Optimize Transportation',
        description: `Consider carpooling or using public transport. This could save you around ${formatAmount(potentialSavings)} monthly while being eco-friendly!`,
        icon: Car,
        color: 'from-blue-400 to-blue-600',
        action: 'Learn More',
        amount: potentialSavings
      });
    }

    const monthlyRequired = savingsGoal - currentSavings;
    if (monthlyRequired > 0 && remaining > monthlyRequired) {
      suggestions.push({
        id: 'goal-1',
        type: 'goal',
        title: 'Reach Your Savings Goal',
        description: `You need ${formatAmount(monthlyRequired)} more to reach your goal of ${formatAmount(savingsGoal)}. You have enough remaining budget to achieve this!`,
        icon: Zap,
        color: 'from-purple-400 to-pink-600',
        action: 'Save Now',
        amount: monthlyRequired
      });
    }

    if (spentPercentage < 50 && totalSpent > 0) {
      suggestions.push({
        id: 'celebrate-1',
        type: 'celebration',
        title: 'Excellent Budget Management! 🎉',
        description: `You've only used ${Math.round(spentPercentage)}% of your budget. Keep up the great work! Consider investing the surplus.`,
        icon: Heart,
        color: 'from-green-400 to-emerald-600',
        action: 'Celebrate',
        amount: 0
      });
    }

    if (budget.categories.Investment.spent === 0 && totalSpent > 0) {
      suggestions.push({
        id: 'invest-2',
        type: 'investment',
        title: 'Start Building Emergency Fund',
        description: 'Financial experts recommend having 3-6 months of expenses saved. Start with small monthly investments to build your safety net.',
        icon: ShoppingBag,
        color: 'from-indigo-400 to-purple-600',
        action: 'Get Started',
        amount: 500
      });
    }

    setAiSuggestions(suggestions.slice(0, 3));
  };

  useEffect(() => {
    generateAISuggestions();
  }, [budget, expenses, currency, savingsGoal, currentSavings]);

<<<<<<< HEAD
  // Initialize voice service
  useEffect(() => {
    if (!voiceService.isAvailable()) {
      setVoiceError('Voice recognition is not supported in this browser. Please use Chrome, Edge, or Safari.');
      return;
    }

    // Set up voice service callbacks
    voiceService.onResult((transcript) => {
      console.log('Voice transcript:', transcript);
      setInputText(transcript);
      setIsListening(false);
      
      // Automatically process the voice input after a short delay
      setTimeout(() => {
        if (transcript.trim()) {
          // Process the transcript directly
          const userMessage = { type: 'user', text: transcript, time: getCurrentTime() };
          setMessages(prev => [...prev, userMessage]);

          // Process voice command with latest state from refs (avoid closure issues)
          const command = processVoiceCommand(transcript, {
            budget: budgetRef.current,
            expenses: expensesRef.current,
            currency: currencyRef.current,
            savingsGoal: savingsGoalRef.current,
            formatAmount
          });

          console.log('Command detected:', command.type, command);

          let aiResponseText = '';

          // Execute the command
          switch (command.type) {
            case 'navigate':
              setCurrentScreen(command.screen);
              aiResponseText = command.response;
              break;

            case 'setCurrency':
              setCurrency(command.currency);
              aiResponseText = command.response;
              break;

            case 'setCategoryLimit':
              setBudget(prevBudget => {
                const newBudget = { ...prevBudget };
                const oldLimit = newBudget.categories[command.category].limit;
                newBudget.categories[command.category].limit = command.limit;
                newBudget.total = newBudget.total - oldLimit + command.limit;
                return newBudget;
              });
              aiResponseText = command.response;
              break;

            case 'setSavingsGoal':
              console.log('Setting savings goal to:', command.goal);
              setSavingsGoal(command.goal);
              aiResponseText = command.response;
              break;

            case 'setTotalBudget':
              // Preserve all existing budget data, only update total
              setBudget(prevBudget => ({
                ...prevBudget,
                total: command.total
              }));
              aiResponseText = command.response;
              break;

            case 'logExpense':
              aiResponseText = logExpense(command.amount, command.category, command.description);
              break;

            case 'info':
              aiResponseText = command.response;
              break;

            case 'unknown':
            default:
              // Try legacy expense parsing as fallback
              const expenseData = parseExpenseFromText(transcript);
              if (expenseData) {
                const { amount, category } = expenseData;
                aiResponseText = logExpense(amount, category, transcript);
              } else {
                aiResponseText = command.response;
              }
              break;
          }

          // Send AI response
          if (aiResponseText) {
            const aiResponse = {
              type: 'ai',
              text: aiResponseText,
              time: getCurrentTime()
            };
            
            setTimeout(() => {
              setMessages(prev => [...prev, aiResponse]);
            }, 500);
          }
          
          setInputText('');
        }
      }, 300);
    });

    voiceService.onError((error) => {
      console.error('Voice recognition error:', error);
      setIsListening(false);
      
      let errorMessage = 'Voice recognition error. Please try again.';
      if (error === 'no-speech') {
        errorMessage = 'No speech detected. Please try again.';
      } else if (error === 'audio-capture') {
        errorMessage = 'Microphone not found. Please check your microphone settings.';
      } else if (error === 'not-allowed') {
        errorMessage = 'Microphone permission denied. Please allow microphone access.';
      }
      
      setVoiceError(errorMessage);
      
      // Clear error after 5 seconds
      setTimeout(() => {
        setVoiceError(null);
      }, 5000);
    });

    voiceService.onStart(() => {
      setIsListening(true);
      setVoiceError(null);
    });

    voiceService.onEnd(() => {
      setIsListening(false);
    });

    voiceServiceRef.current = voiceService;

    // Cleanup on unmount
    return () => {
      if (voiceServiceRef.current) {
        voiceServiceRef.current.stopListening();
      }
    };
  }, []);

  const handleSendMessage = (textToProcess = null) => {
    const text = textToProcess || inputText;
    if (!text.trim()) return;

    const userMessage = { type: 'user', text: text, time: getCurrentTime() };
    setMessages(prev => [...prev, userMessage]);

    // Process text command using the same processor as voice commands
    const command = processVoiceCommand(text, {
      budget: budgetRef.current,
      expenses: expensesRef.current,
      currency: currencyRef.current,
      savingsGoal: savingsGoalRef.current,
      formatAmount
    });

    console.log('Text command detected:', command.type, command);

    let aiResponseText = '';

    // Execute the command (same logic as voice commands)
    switch (command.type) {
      case 'navigate':
        setCurrentScreen(command.screen);
        aiResponseText = command.response;
        break;

      case 'setCurrency':
        setCurrency(command.currency);
        aiResponseText = command.response;
        break;

      case 'setCategoryLimit':
        setBudget(prevBudget => {
          const newBudget = { ...prevBudget };
          const oldLimit = newBudget.categories[command.category].limit;
          newBudget.categories[command.category].limit = command.limit;
          newBudget.total = newBudget.total - oldLimit + command.limit;
          return newBudget;
        });
        aiResponseText = command.response;
        break;

      case 'setSavingsGoal':
        console.log('Setting savings goal to:', command.goal);
        setSavingsGoal(command.goal);
        aiResponseText = command.response;
        break;

      case 'setTotalBudget':
        // Preserve all existing budget data, only update total
        setBudget(prevBudget => ({
          ...prevBudget,
          total: command.total
        }));
        aiResponseText = command.response;
        break;

      case 'logExpense':
        aiResponseText = logExpense(command.amount, command.category, command.description);
        break;

      case 'info':
        aiResponseText = command.response;
        break;

      case 'unknown':
      default:
        // Try legacy expense parsing as fallback
        const expenseData = parseExpenseFromText(text);
        if (expenseData) {
          const { amount, category } = expenseData;
          aiResponseText = logExpense(amount, category, text);
        } else {
          aiResponseText = command.response;
        }
        break;
    }

    // Send AI response
    if (aiResponseText) {
      const aiResponse = {
        type: 'ai',
        text: aiResponseText,
        time: getCurrentTime()
      };
      
=======
  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    const userMessage = { type: 'user', text: inputText, time: getCurrentTime() };
    setMessages(prev => [...prev, userMessage]);

    const expenseData = parseExpenseFromText(inputText);
    
    if (expenseData) {
      const { amount, category } = expenseData;
      const aiResponseText = logExpense(amount, category, inputText);

      if (aiResponseText) {
        const aiResponse = {
          type: 'ai',
          text: aiResponseText,
          time: getCurrentTime()
        };
        
        setTimeout(() => {
          setMessages(prev => [...prev, aiResponse]);
        }, 500);
      }
    } else {
      const aiResponse = {
        type: 'ai',
        text: 'I can help you track expenses! Try saying something like "Spent 250 on lunch" or "Invested 1000 in mutual fund"',
        time: getCurrentTime()
      };
>>>>>>> 868cd35c96e4d439f823dfcdd61826bb59358874
      setTimeout(() => {
        setMessages(prev => [...prev, aiResponse]);
      }, 500);
    }

    setInputText('');
  };

<<<<<<< HEAD
  const handleVoiceClick = async () => {
    if (!voiceService.isAvailable()) {
      setVoiceError('Voice recognition is not available in this browser.');
      return;
    }

    if (isListening) {
      // Stop listening if already listening
      try {
        await voiceService.stopListening();
        setIsListening(false);
      } catch (error) {
        console.error('Error stopping voice recognition:', error);
        setIsListening(false);
      }
    } else {
      // Start listening
      try {
        await voiceService.startListening();
        // isListening will be set by the onStart callback
      } catch (error) {
        console.error('Error starting voice recognition:', error);
        setVoiceError(error.message || 'Failed to start voice recognition. Please try again.');
        setIsListening(false);
      }
    }
=======
  const handleVoiceClick = () => {
    setIsListening(true);
    
    setTimeout(() => {
      setIsListening(false);
      setInputText('Spent 250 on lunch');
    }, 3000);
>>>>>>> 868cd35c96e4d439f823dfcdd61826bb59358874
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
        text: `Expense of ${formatAmount(expense.amount)} from ${expense.category} has been deleted.`,
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
    if (newLimit >= 0) {
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

  const getRecentExpenses = () => {
    return [...expenses]
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 5);
  };

  const dismissSuggestion = (id) => {
    setAiSuggestions(prev => prev.filter(s => s.id !== id));
  };

  const handleSuggestionAction = (suggestion) => {
    let aiResponseText = '';

    switch (suggestion.type) {
      case 'investment':
        aiResponseText = logExpense(suggestion.amount, 'Investment', suggestion.title);
        aiResponseText = `Great! I've logged your ${formatAmount(suggestion.amount)} investment. ${aiResponseText}`;
        break;
      case 'goal':
        aiResponseText = logExpense(suggestion.amount, 'Investment', suggestion.title);
        setCurrentSavings(prev => prev + suggestion.amount);
        aiResponseText = `Awesome! You're ${formatAmount(suggestion.amount)} closer to your goal! I've logged this in your Investments.`;
        break;
      case 'savings':
        aiResponseText = 'Smart move! Some tips: try cooking at home, using coupons, and unsubscribing from marketing emails.';
        break;
      case 'celebration':
        aiResponseText = 'Feels good, doesn\'t it? Keep up the great budgeting! 🎉';
        break;
      default:
        aiResponseText = 'Action noted!';
    }

    const aiResponse = {
      type: 'ai',
      text: aiResponseText,
      time: getCurrentTime()
    };
    setMessages(prev => [...prev, aiResponse]);

    dismissSuggestion(suggestion.id);
  };

  const remaining = budget.total - budget.spent;
  const spentPercentage = budget.total > 0 ? (budget.spent / budget.total) * 100 : 0;

  return (
<<<<<<< HEAD
    <div className="app-container">
      <div className="sidebar">
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <div className="logo-icon">
              <DollarSign size={28} className="text-white" />
            </div>
            <div>
              <h1 className="logo-title">BudgetAI</h1>
              <p className="logo-subtitle">Smart Finance Manager</p>
            </div>
          </div>
          
          <div className="currency-selector">
            <button
              onClick={() => setCurrency('INR')}
              className={`currency-btn ${currency === 'INR' ? 'active' : ''}`}
=======
    <div className="flex h-screen bg-gradient-to-br from-slate-50 to-blue-50 w-full overflow-hidden">
      <div className="w-72 bg-white border-r border-gray-200 shadow-xl flex flex-col flex-shrink-0">
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
          
          <div className="mt-4 flex items-center gap-2 bg-gray-50 rounded-xl p-2">
            <button
              onClick={() => setCurrency('INR')}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-semibold transition-all ${
                currency === 'INR'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
>>>>>>> 868cd35c96e4d439f823dfcdd61826bb59358874
            >
              ₹ INR
            </button>
            <button
              onClick={() => setCurrency('USD')}
<<<<<<< HEAD
              className={`currency-btn ${currency === 'USD' ? 'active' : ''}`}
=======
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-semibold transition-all ${
                currency === 'USD'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
>>>>>>> 868cd35c96e4d439f823dfcdd61826bb59358874
            >
              $ USD
            </button>
          </div>
        </div>

<<<<<<< HEAD
        <nav className="sidebar-nav">
          <button
            onClick={() => setCurrentScreen('chat')}
            className={`nav-btn ${currentScreen === 'chat' ? 'active' : ''}`}
          >
            <MessageSquare size={20} />
            <span>Chat Assistant</span>
          </button>
          <button
            onClick={() => setCurrentScreen('dashboard')}
            className={`nav-btn ${currentScreen === 'dashboard' ? 'active' : ''}`}
          >
            <PieChart size={20} />
            <span>Dashboard</span>
          </button>
          <button
            onClick={() => setCurrentScreen('expenses')}
            className={`nav-btn ${currentScreen === 'expenses' ? 'active' : ''}`}
          >
            <BarChart3 size={20} />
            <span>All Expenses</span>
          </button>
          <button
            onClick={() => setCurrentScreen('settings')}
            className={`nav-btn ${currentScreen === 'settings' ? 'active' : ''}`}
          >
            <Settings size={20} />
            <span>Budget Settings</span>
          </button>
        </nav>

        <div className="sidebar-footer">
          <div className="user-profile">
            <div className="user-avatar">
              U
            </div>
            <div className="flex-1">
              <p className="user-name">User</p>
              <p className="user-plan">Premium Plan</p>
=======
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

        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
              U
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-800">User</p>
              <p className="text-xs text-gray-500">Premium Plan</p>
>>>>>>> 868cd35c96e4d439f823dfcdd61826bb59358874
            </div>
          </div>
        </div>
      </div>

<<<<<<< HEAD
      <div className="main-content">
        {currentScreen === 'chat' && (
          <>
            <div className="chat-header">
              <div className="chat-header-content">
                <div className="chat-title-section">
                  <div>
                    <h2 className="chat-title">Conversational Budget Assistant</h2>
                    <p className="chat-subtitle">Track expenses naturally through conversation</p>
                  </div>
                  <Bell size={24} style={{ color: '#9ca3af', cursor: 'pointer' }} />
                </div>
                
                <div className="stats-grid">
                  <div className="stat-card stat-card-blue">
                    <p className="stat-label">Monthly Budget</p>
                    <p className="stat-value stat-value-blue">{formatAmount(budget.total)}</p>
                  </div>
                  <div className="stat-card stat-card-orange">
                    <p className="stat-label">Total Spent</p>
                    <p className="stat-value stat-value-orange">{formatAmount(budget.spent)}</p>
                  </div>
                  <div className="stat-card stat-card-green">
                    <p className="stat-label">Remaining</p>
                    <p className="stat-value stat-value-green">{formatAmount(remaining)}</p>
                  </div>
                  <div className="stat-card stat-card-purple">
                    <p className="stat-label">Savings Goal</p>
                    <p className="stat-value stat-value-purple">{formatAmount(savingsGoal)}</p>
=======
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {currentScreen === 'chat' && (
          <>
            <div className="bg-white border-b border-gray-200 shadow-sm">
              <div className="px-8 py-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-800">Conversational Budget Assistant</h2>
                    <p className="text-gray-500 mt-1">Track expenses naturally through conversation</p>
                  </div>
                  <Bell size={24} className="text-gray-400 cursor-pointer hover:text-gray-600" />
                </div>
                
                <div className="grid grid-cols-4 gap-4">
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-5 rounded-2xl border border-blue-100">
                    <p className="text-sm text-gray-600 mb-1">Monthly Budget</p>
                    <p className="text-3xl font-bold text-blue-600">{formatAmount(budget.total)}</p>
                  </div>
                  <div className="bg-gradient-to-br from-orange-50 to-red-50 p-5 rounded-2xl border border-orange-100">
                    <p className="text-sm text-gray-600 mb-1">Total Spent</p>
                    <p className="text-3xl font-bold text-orange-600">{formatAmount(budget.spent)}</p>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-5 rounded-2xl border border-green-100">
                    <p className="text-sm text-gray-600 mb-1">Remaining</p>
                    <p className="text-3xl font-bold text-green-600">{formatAmount(remaining)}</p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-5 rounded-2xl border border-purple-100">
                    <p className="text-sm text-gray-600 mb-1">Savings Goal</p>
                    <p className="text-3xl font-bold text-purple-600">{formatAmount(savingsGoal)}</p>
>>>>>>> 868cd35c96e4d439f823dfcdd61826bb59358874
                  </div>
                </div>
              </div>
            </div>

<<<<<<< HEAD
            <div className="chat-messages">
              <div className="messages-container messages-spacing">
                {aiSuggestions.length > 0 && (
                  <div className="suggestions-card">
                    <div className="suggestions-header">
                      <div className="suggestions-icon">
                        <Zap size={24} className="text-white" />
                      </div>
                      <h3 className="suggestions-title">AI-Powered Suggestions</h3>
                    </div>
                    <div className="suggestions-list">
                      {aiSuggestions.map((suggestion, idx) => {
                        const IconComp = suggestion.icon;
                        const gradientClass = suggestion.color.includes('orange') ? 'gradient-orange' :
                                            suggestion.color.includes('blue') ? 'gradient-blue' :
                                            suggestion.color.includes('purple') ? 'gradient-purple' :
                                            suggestion.color.includes('pink') ? 'gradient-pink' :
                                            suggestion.color.includes('red') ? 'gradient-red' :
                                            suggestion.color.includes('green') || suggestion.color.includes('emerald') ? 'gradient-green' :
                                            'gradient-indigo';
                        return (
                          <div key={suggestion.id} className="suggestion-item">
                            <button 
                              onClick={() => dismissSuggestion(suggestion.id)}
                              className="suggestion-close"
                            >
                              <X size={18} />
                            </button>
                            <div className="suggestion-content">
                              <div className={`suggestion-icon-wrapper ${gradientClass}`}>
                                <IconComp size={24} className="text-white" />
                              </div>
                              <div className="suggestion-details">
                                <h4 className="suggestion-title">{suggestion.title}</h4>
                                <p className="suggestion-description">{suggestion.description}</p>
                                <button 
                                  onClick={() => handleSuggestionAction(suggestion)}
                                  className="suggestion-action"
=======
            <div className="flex-1 overflow-y-auto p-8">
              <div className="max-w-4xl mx-auto space-y-6">
                {aiSuggestions.length > 0 && (
                  <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl p-6 border-2 border-indigo-200 shadow-xl">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
                        <Zap size={24} className="text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-800">AI-Powered Suggestions</h3>
                    </div>
                    <div className="space-y-3">
                      {aiSuggestions.map((suggestion, idx) => {
                        const IconComp = suggestion.icon;
                        return (
                          <div key={suggestion.id} className="bg-white rounded-2xl p-4 shadow-md hover:shadow-lg transition-all relative">
                            <button 
                              onClick={() => dismissSuggestion(suggestion.id)}
                              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-all z-10"
                            >
                              <X size={18} />
                            </button>
                            <div className="flex items-start gap-4">
                              <div className={`w-12 h-12 bg-gradient-to-br ${suggestion.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                                <IconComp size={24} className="text-white" />
                              </div>
                              <div className="flex-1">
                                <h4 className="font-bold text-gray-800 mb-1">{suggestion.title}</h4>
                                <p className="text-sm text-gray-600 mb-3">{suggestion.description}</p>
                                <button 
                                  onClick={() => handleSuggestionAction(suggestion)}
                                  className="text-sm font-semibold text-indigo-600 hover:text-indigo-700"
>>>>>>> 868cd35c96e4d439f823dfcdd61826bb59358874
                                >
                                  {suggestion.action} →
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
                
                {messages.map((msg, idx) => (
<<<<<<< HEAD
                  <div key={idx} className={`message-container ${msg.type === 'user' ? 'user' : 'ai'}`}>
                    <div className={`message-bubble ${msg.type === 'user' ? 'user' : 'ai'}`}>
                      <p className="message-text">{msg.text}</p>
                      <p className={`message-time ${msg.type === 'user' ? 'user' : 'ai'}`}>{msg.time}</p>
=======
                  <div key={idx} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-2xl ${
                      msg.type === 'user' 
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white' 
                        : 'bg-white text-gray-800 border border-gray-200'
                    } rounded-2xl px-6 py-4 shadow-lg`}>
                      <p className="text-base leading-relaxed">{msg.text}</p>
                      <p className={`text-xs mt-2 ${msg.type === 'user' ? 'text-blue-100' : 'text-gray-400'}`}>{msg.time}</p>
>>>>>>> 868cd35c96e4d439f823dfcdd61826bb59358874
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {isListening && (
<<<<<<< HEAD
              <div className="voice-overlay">
                <div className="voice-overlay-content">
                  <div className="voice-mic-container">
                    <div className="voice-mic-ping"></div>
                    <div className="voice-mic-pulse"></div>
                    <div className="voice-mic-icon">
=======
              <div className="absolute inset-0 bg-gradient-to-br from-blue-900/95 via-indigo-900/95 to-purple-900/95 backdrop-blur-sm flex items-center justify-center z-50">
                <div className="text-center">
                  <div className="relative mb-8">
                    <div className="absolute inset-0 bg-blue-400 rounded-full animate-ping opacity-20"></div>
                    <div className="absolute inset-0 bg-blue-500 rounded-full animate-pulse opacity-30"></div>
                    <div className="relative w-32 h-32 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center shadow-2xl mx-auto">
>>>>>>> 868cd35c96e4d439f823dfcdd61826bb59358874
                      <Mic size={56} className="text-white" />
                    </div>
                  </div>
                  
<<<<<<< HEAD
                  <p className="voice-title">Listening...</p>
                  <p className="voice-subtitle">Speak naturally about your expense</p>
                  
                  <div className="voice-visualizer">
                    {[...Array(15)].map((_, i) => (
                      <div
                        key={i}
                        className="voice-bar"
=======
                  <p className="text-4xl font-bold text-white mb-3">Listening...</p>
                  <p className="text-blue-200 text-lg mb-8">Speak naturally about your expense</p>
                  
                  <div className="flex items-center justify-center gap-2 h-20 mb-8">
                    {[...Array(15)].map((_, i) => (
                      <div
                        key={i}
                        className="w-2 bg-gradient-to-t from-blue-400 to-blue-200 rounded-full animate-pulse"
>>>>>>> 868cd35c96e4d439f823dfcdd61826bb59358874
                        style={{
                          height: `${Math.random() * 50 + 20}px`,
                          animationDelay: `${i * 0.1}s`
                        }}
                      />
                    ))}
                  </div>

                  <button
                    onClick={() => setIsListening(false)}
<<<<<<< HEAD
                    className="voice-stop-btn"
=======
                    className="px-8 py-4 bg-red-500 text-white rounded-2xl font-semibold hover:bg-red-600 transition-all shadow-2xl"
>>>>>>> 868cd35c96e4d439f823dfcdd61826bb59358874
                  >
                    Stop Listening
                  </button>
                </div>
              </div>
            )}

<<<<<<< HEAD
            <div className="chat-input-container">
              {voiceError && (
                <div className="voice-error">
                  {voiceError}
                </div>
              )}
              <div className="input-wrapper">
                <div className="input-group">
=======
            <div className="bg-white border-t border-gray-200 shadow-2xl p-6">
              <div className="max-w-4xl mx-auto">
                <div className="flex items-center gap-4">
>>>>>>> 868cd35c96e4d439f823dfcdd61826bb59358874
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your expense like 'Spent 250 on lunch' or 'Invested 1000 in stocks'..."
<<<<<<< HEAD
                    className="text-input"
                  />
                  <button
                    onClick={handleSendMessage}
                    className="send-btn"
=======
                    className="flex-1 py-4 px-6 bg-gray-50 rounded-2xl text-base focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-200"
                  />
                  <button
                    onClick={handleSendMessage}
                    className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl font-semibold hover:shadow-xl transition-all duration-200 flex items-center gap-2"
>>>>>>> 868cd35c96e4d439f823dfcdd61826bb59358874
                  >
                    <Send size={20} />
                    Send
                  </button>
                  <button
                    onClick={handleVoiceClick}
<<<<<<< HEAD
                    className={`voice-btn ${isListening ? 'listening' : ''}`}
                    title={isListening ? 'Stop listening' : 'Start voice input'}
=======
                    className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl hover:shadow-2xl transition-all duration-200 hover:scale-105"
>>>>>>> 868cd35c96e4d439f823dfcdd61826bb59358874
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
<<<<<<< HEAD
            <div className="dashboard-header">
              <h2 className="dashboard-title">Financial Dashboard</h2>
              <p className="dashboard-subtitle">Complete overview of your spending patterns</p>
            </div>

            <div className="dashboard-content">
              <div className="dashboard-grid">
                <div className="budget-card">
                  <div className="budget-card-content">
                    <div className="budget-card-bg-1"></div>
                    <div className="budget-card-bg-2"></div>
                    
                    <div className="budget-card-inner">
                      <div className="budget-header">
                        <div>
                          <p className="budget-label">Total Monthly Budget</p>
                          <p className="budget-amount">{formatAmount(budget.total)}</p>
                        </div>
                        <DollarSign size={64} style={{ opacity: 0.3 }} />
                      </div>
                      
                      <div className="budget-stats">
                        <div className="budget-stat">
                          <p className="budget-stat-label">Spent This Month</p>
                          <p className="budget-stat-value">{formatAmount(budget.spent)}</p>
                        </div>
                        <div className="budget-stat">
                          <p className="budget-stat-label">Remaining Balance</p>
                          <p className="budget-stat-value">{formatAmount(remaining)}</p>
                        </div>
                      </div>

                      <div className="budget-progress">
                        <div className="budget-progress-header">
                          <span>Budget Usage</span>
                          <span style={{ fontWeight: 700 }}>{Math.round(spentPercentage)}%</span>
                        </div>
                        <div className="budget-progress-bar">
                          <div 
                            className="budget-progress-fill"
=======
            <div className="bg-white border-b border-gray-200 shadow-sm px-8 py-6">
              <h2 className="text-3xl font-bold text-gray-800">Financial Dashboard</h2>
              <p className="text-gray-500 mt-1">Complete overview of your spending patterns</p>
            </div>

            <div className="flex-1 overflow-y-auto p-8">
              <div className="grid grid-cols-12 gap-6">
                <div className="col-span-12 lg:col-span-8">
                  <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white rounded-3xl p-8 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24"></div>
                    
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-6">
                        <div>
                          <p className="text-sm opacity-90 mb-2">Total Monthly Budget</p>
                          <p className="text-6xl font-bold">{formatAmount(budget.total)}</p>
                        </div>
                        <DollarSign size={64} className="opacity-30" />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-6 mb-6">
                        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
                          <p className="text-sm opacity-80 mb-1">Spent This Month</p>
                          <p className="text-3xl font-bold">{formatAmount(budget.spent)}</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
                          <p className="text-sm opacity-80 mb-1">Remaining Balance</p>
                          <p className="text-3xl font-bold">{formatAmount(remaining)}</p>
                        </div>
                      </div>

                      <div className="mb-4">
                        <div className="flex justify-between text-sm mb-2">
                          <span>Budget Usage</span>
                          <span className="font-bold">{Math.round(spentPercentage)}%</span>
                        </div>
                        <div className="w-full bg-white/20 rounded-full h-3">
                          <div 
                            className="bg-white rounded-full h-3 transition-all duration-500"
>>>>>>> 868cd35c96e4d439f823dfcdd61826bb59358874
                            style={{ width: `${Math.min(spentPercentage, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

<<<<<<< HEAD
                <div className="recent-expenses-card">
                  <div className="recent-expenses">
                    <h3 className="recent-expenses-title">Recent Expenses</h3>
                    <div className="recent-expenses-list">
                      {getRecentExpenses().length === 0 ? (
                        <p style={{ color: '#6b7280', textAlign: 'center', padding: '1rem 0' }}>No expenses yet</p>
                      ) : (
                        getRecentExpenses().map((expense) => {
                          const IconComp = budget.categories[expense.category].icon;
                          const gradientClass = budget.categories[expense.category].color.includes('orange') ? 'gradient-orange' :
                                              budget.categories[expense.category].color.includes('blue') ? 'gradient-blue' :
                                              budget.categories[expense.category].color.includes('purple') ? 'gradient-purple' :
                                              budget.categories[expense.category].color.includes('pink') ? 'gradient-pink' :
                                              budget.categories[expense.category].color.includes('red') ? 'gradient-red' :
                                              budget.categories[expense.category].color.includes('green') || budget.categories[expense.category].color.includes('emerald') ? 'gradient-green' :
                                              'gradient-indigo';
                          return (
                            <div key={expense.id} className="recent-expense-item">
                              <div className={`expense-icon ${gradientClass}`}>
                                <IconComp size={20} className="text-white" />
                              </div>
                              <div className="expense-info">
                                <p className="expense-category">{expense.category}</p>
                                <p className="expense-description">{expense.description}</p>
                              </div>
                              <p className="expense-amount">{formatAmount(expense.amount)}</p>
=======
                <div className="col-span-12 lg:col-span-4 space-y-6">
                  <div className="bg-white rounded-3xl p-6 shadow-xl">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Recent Expenses</h3>
                    <div className="space-y-3">
                      {getRecentExpenses().length === 0 ? (
                        <p className="text-gray-500 text-center py-4">No expenses yet</p>
                      ) : (
                        getRecentExpenses().map((expense) => {
                          const IconComp = budget.categories[expense.category].icon;
                          return (
                            <div key={expense.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                              <div className={`w-10 h-10 bg-gradient-to-br ${budget.categories[expense.category].color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                                <IconComp size={20} className="text-white" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold text-gray-800 text-sm">{expense.category}</p>
                                <p className="text-xs text-gray-500 truncate">{expense.description}</p>
                              </div>
                              <p className="font-bold text-gray-800">{formatAmount(expense.amount)}</p>
>>>>>>> 868cd35c96e4d439f823dfcdd61826bb59358874
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                </div>

<<<<<<< HEAD
                <div className="category-breakdown">
                  <div className="category-breakdown-card">
                    <h3 className="category-breakdown-title">Category Breakdown</h3>
                    <div className="categories-grid">
                      {Object.entries(budget.categories).map(([name, cat]) => {
                        const IconComp = cat.icon;
                        const percentage = cat.limit > 0 ? (cat.spent / cat.limit) * 100 : 0;
                        const gradientClass = cat.color.includes('orange') ? 'gradient-orange' :
                                            cat.color.includes('blue') ? 'gradient-blue' :
                                            cat.color.includes('purple') ? 'gradient-purple' :
                                            cat.color.includes('pink') ? 'gradient-pink' :
                                            cat.color.includes('red') ? 'gradient-red' :
                                            cat.color.includes('green') || cat.color.includes('emerald') ? 'gradient-green' :
                                            'gradient-indigo';
                        return (
                          <div key={name} className="category-card">
                            <div className="category-header">
                              <div className="category-header-left">
                                <div className={`category-icon ${gradientClass}`}>
                                  <IconComp size={24} className="text-white" />
                                </div>
                                <h4 className="category-name">{name}</h4>
                              </div>
                            </div>
                            <div className="category-stats">
                              <div className="category-stat-row">
                                <span className="category-stat-label">Spent</span>
                                <span className="category-stat-value">{formatAmount(cat.spent)}</span>
                              </div>
                              {cat.limit > 0 && (
                                <>
                                  <div className="category-stat-row">
                                    <span className="category-stat-label">Limit</span>
                                    <span className="category-stat-value">{formatAmount(cat.limit)}</span>
                                  </div>
                                  <div className="category-progress-bar">
                                    <div 
                                      className={`category-progress-fill ${gradientClass}`}
                                      style={{ width: `${Math.min(percentage, 100)}%` }}
                                    ></div>
                                  </div>
                                  <p className="category-progress-text">{Math.round(percentage)}% used</p>
=======
                <div className="col-span-12">
                  <div className="bg-white rounded-3xl p-8 shadow-xl">
                    <h3 className="text-2xl font-bold text-gray-800 mb-6">Category Breakdown</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {Object.entries(budget.categories).map(([name, cat]) => {
                        const IconComp = cat.icon;
                        const percentage = cat.limit > 0 ? (cat.spent / cat.limit) * 100 : 0;
                        return (
                          <div key={name} className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6">
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center gap-3">
                                <div className={`w-12 h-12 bg-gradient-to-br ${cat.color} rounded-xl flex items-center justify-center`}>
                                  <IconComp size={24} className="text-white" />
                                </div>
                                <h4 className="font-bold text-gray-800">{name}</h4>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Spent</span>
                                <span className="font-bold text-gray-800">{formatAmount(cat.spent)}</span>
                              </div>
                              {cat.limit > 0 && (
                                <>
                                  <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Limit</span>
                                    <span className="font-bold text-gray-800">{formatAmount(cat.limit)}</span>
                                  </div>
                                  <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div 
                                      className={`bg-gradient-to-r ${cat.color} rounded-full h-2 transition-all duration-500`}
                                      style={{ width: `${Math.min(percentage, 100)}%` }}
                                    ></div>
                                  </div>
                                  <p className="text-xs text-gray-500">{Math.round(percentage)}% used</p>
>>>>>>> 868cd35c96e4d439f823dfcdd61826bb59358874
                                </>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {currentScreen === 'expenses' && (
          <>
<<<<<<< HEAD
            <div className="expenses-header">
              <div className="expenses-header-content">
                <div>
                  <h2 className="expenses-title">All Expenses</h2>
                  <p className="expenses-subtitle">Complete history of your transactions</p>
                </div>
                <div className="expenses-filters">
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="filter-select"
=======
            <div className="bg-white border-b border-gray-200 shadow-sm px-8 py-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold text-gray-800">All Expenses</h2>
                  <p className="text-gray-500 mt-1">Complete history of your transactions</p>
                </div>
                <div className="flex items-center gap-3">
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
>>>>>>> 868cd35c96e4d439f823dfcdd61826bb59358874
                  >
                    <option value="All">All Categories</option>
                    {Object.keys(budget.categories).map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
<<<<<<< HEAD
                    className="filter-select"
=======
                    className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
>>>>>>> 868cd35c96e4d439f823dfcdd61826bb59358874
                  >
                    <option value="date">Sort by Date</option>
                    <option value="amount">Sort by Amount</option>
                    <option value="category">Sort by Category</option>
                  </select>
                </div>
              </div>
            </div>

<<<<<<< HEAD
            <div className="expenses-content">
              <div className="expenses-container">
                {getFilteredAndSortedExpenses().length === 0 ? (
                  <div className="empty-expenses">
                    <ShoppingBag size={64} className="empty-expenses-icon" />
                    <h3 className="empty-expenses-title">No expenses yet</h3>
                    <p className="empty-expenses-text">Start tracking your expenses in the chat!</p>
                  </div>
                ) : (
                  <div className="expenses-table-wrapper">
                    <table className="expenses-table">
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>Category</th>
                          <th>Description</th>
                          <th className="text-right">Amount</th>
                          <th className="text-right">Actions</th>
=======
            <div className="flex-1 overflow-y-auto p-8">
              <div className="max-w-6xl mx-auto">
                {getFilteredAndSortedExpenses().length === 0 ? (
                  <div className="bg-white rounded-3xl p-12 text-center shadow-xl">
                    <ShoppingBag size={64} className="mx-auto text-gray-300 mb-4" />
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">No expenses yet</h3>
                    <p className="text-gray-500">Start tracking your expenses in the chat!</p>
                  </div>
                ) : (
                  <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-gradient-to-r from-blue-50 to-indigo-50">
                        <tr>
                          <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Date</th>
                          <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Category</th>
                          <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Description</th>
                          <th className="px-6 py-4 text-right text-sm font-bold text-gray-700">Amount</th>
                          <th className="px-6 py-4 text-right text-sm font-bold text-gray-700">Actions</th>
>>>>>>> 868cd35c96e4d439f823dfcdd61826bb59358874
                        </tr>
                      </thead>
                      <tbody>
                        {getFilteredAndSortedExpenses().map((expense, idx) => {
                          const IconComp = budget.categories[expense.category].icon;
<<<<<<< HEAD
                          const gradientClass = budget.categories[expense.category].color.includes('orange') ? 'gradient-orange' :
                                              budget.categories[expense.category].color.includes('blue') ? 'gradient-blue' :
                                              budget.categories[expense.category].color.includes('purple') ? 'gradient-purple' :
                                              budget.categories[expense.category].color.includes('pink') ? 'gradient-pink' :
                                              budget.categories[expense.category].color.includes('red') ? 'gradient-red' :
                                              budget.categories[expense.category].color.includes('green') || budget.categories[expense.category].color.includes('emerald') ? 'gradient-green' :
                                              'gradient-indigo';
                          return (
                            <tr key={expense.id} style={{ backgroundColor: idx % 2 === 0 ? '#ffffff' : '#f9fafb' }}>
                              <td>{expense.date}</td>
                              <td>
                                <div className="expense-category-cell">
                                  <div className={`expense-category-icon ${gradientClass}`}>
                                    <IconComp size={16} className="text-white" />
                                  </div>
                                  <span className="expense-category-name">{expense.category}</span>
                                </div>
                              </td>
                              <td className="expense-description-cell">{expense.description}</td>
                              <td className="text-right expense-amount-cell">{formatAmount(expense.amount)}</td>
                              <td className="text-right">
                                <button
                                  onClick={() => deleteExpense(expense.id)}
                                  className="delete-btn"
=======
                          return (
                            <tr key={expense.id} className={`border-t border-gray-100 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                              <td className="px-6 py-4 text-sm text-gray-600">{expense.date}</td>
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                  <div className={`w-8 h-8 bg-gradient-to-br ${budget.categories[expense.category].color} rounded-lg flex items-center justify-center`}>
                                    <IconComp size={16} className="text-white" />
                                  </div>
                                  <span className="font-semibold text-gray-800">{expense.category}</span>
                                </div>
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">{expense.description}</td>
                              <td className="px-6 py-4 text-right font-bold text-gray-800">{formatAmount(expense.amount)}</td>
                              <td className="px-6 py-4 text-right">
                                <button
                                  onClick={() => deleteExpense(expense.id)}
                                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all"
>>>>>>> 868cd35c96e4d439f823dfcdd61826bb59358874
                                >
                                  <Trash2 size={18} />
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {currentScreen === 'settings' && (
          <>
<<<<<<< HEAD
            <div className="settings-header">
              <h2 className="settings-title">Budget Settings</h2>
              <p className="settings-subtitle">Customize your budget limits and goals</p>
            </div>

            <div className="settings-content">
              <div className="settings-container">
                <div className="settings-section">
                  <div className="settings-card">
                    <h3 className="settings-card-title">Category Limits</h3>
                    <div className="category-list">
                      {Object.entries(budget.categories).map(([name, cat]) => {
                        const IconComp = cat.icon;
                        const gradientClass = cat.color.includes('orange') ? 'gradient-orange' :
                                            cat.color.includes('blue') ? 'gradient-blue' :
                                            cat.color.includes('purple') ? 'gradient-purple' :
                                            cat.color.includes('pink') ? 'gradient-pink' :
                                            cat.color.includes('red') ? 'gradient-red' :
                                            cat.color.includes('green') || cat.color.includes('emerald') ? 'gradient-green' :
                                            'gradient-indigo';
                        return (
                          <div key={name} className="category-item">
                            <div className={`category-item-icon ${gradientClass}`}>
                              <IconComp size={24} className="text-white" />
                            </div>
                            <div className="category-item-info">
                              <p className="category-item-name">{name}</p>
                              <p className="category-item-limit">Current limit: {formatAmount(cat.limit)}</p>
                            </div>
                            {editingCategory === name ? (
                              <div className="category-item-actions">
                                <input
                                  type="number"
                                  value={editingLimit}
                                  onChange={(e) => setEditingLimit(e.target.value)}
                                  className="edit-input"
                                  placeholder="New limit"
                                />
                                <button
                                  onClick={() => updateCategoryLimit(name)}
                                  className="icon-btn green"
                                >
                                  <Check size={20} />
                                </button>
                                <button
                                  onClick={() => setEditingCategory(null)}
                                  className="icon-btn red"
                                >
                                  <X size={20} />
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => startEditingCategory(name)}
                                className="icon-btn blue"
                              >
                                <Edit2 size={20} />
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="settings-card">
                    <h3 className="settings-card-title">Savings Goal</h3>
                    <div className="savings-goal-section">
                      <div>
                        <label className="savings-label">Monthly Savings Target</label>
                        <input
                          type="number"
                          value={savingsGoal}
                          onChange={(e) => setSavingsGoal(parseInt(e.target.value) || 0)}
                          className="savings-input"
                          placeholder="Enter savings goal"
                        />
                      </div>
                      <div className="savings-display">
                        <p className="savings-display-label">Your Goal</p>
                        <p className="savings-display-value">{formatAmount(savingsGoal)}</p>
                      </div>
=======
            <div className="bg-white border-b border-gray-200 shadow-sm px-8 py-6">
              <h2 className="text-3xl font-bold text-gray-800">Budget Settings</h2>
              <p className="text-gray-500 mt-1">Customize your budget limits and goals</p>
            </div>

            <div className="flex-1 overflow-y-auto p-8">
              <div className="max-w-4xl mx-auto space-y-6">
                <div className="bg-white rounded-3xl p-8 shadow-xl">
                  <h3 className="text-2xl font-bold text-gray-800 mb-6">Category Limits</h3>
                  <div className="space-y-4">
                    {Object.entries(budget.categories).map(([name, cat]) => {
                      const IconComp = cat.icon;
                      return (
                        <div key={name} className="flex items-center gap-4 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl">
                          <div className={`w-12 h-12 bg-gradient-to-br ${cat.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                            <IconComp size={24} className="text-white" />
                          </div>
                          <div className="flex-1">
                            <p className="font-bold text-gray-800">{name}</p>
                            <p className="text-sm text-gray-500">Current limit: {formatAmount(cat.limit)}</p>
                          </div>
                          {editingCategory === name ? (
                            <div className="flex items-center gap-2">
                              <input
                                type="number"
                                value={editingLimit}
                                onChange={(e) => setEditingLimit(e.target.value)}
                                className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="New limit"
                              />
                              <button
                                onClick={() => updateCategoryLimit(name)}
                                className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                              >
                                <Check size={20} />
                              </button>
                              <button
                                onClick={() => setEditingCategory(null)}
                                className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                              >
                                <X size={20} />
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => startEditingCategory(name)}
                              className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                            >
                              <Edit2 size={20} />
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="bg-white rounded-3xl p-8 shadow-xl">
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">Savings Goal</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Monthly Savings Target</label>
                      <input
                        type="number"
                        value={savingsGoal}
                        onChange={(e) => setSavingsGoal(parseInt(e.target.value) || 0)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter savings goal"
                      />
                    </div>
                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-2xl">
                      <p className="text-sm text-gray-600 mb-2">Your Goal</p>
                      <p className="text-4xl font-bold text-purple-600">{formatAmount(savingsGoal)}</p>
>>>>>>> 868cd35c96e4d439f823dfcdd61826bb59358874
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