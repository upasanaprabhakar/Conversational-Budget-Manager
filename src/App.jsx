import React, { useState, useEffect, useRef } from 'react';
import { Mic, Send, TrendingUp, DollarSign, ShoppingBag, Car, Film, Heart, Zap, Menu, Bell, Home, BarChart3, Settings, User, MessageSquare, PieChart, Trash2, Edit2, X, Check, Calendar, Filter, ArrowUpDown, UtensilsCrossed, Activity } from 'lucide-react';
import voiceService from './services/voiceService';
import { processVoiceCommand } from './utils/voiceCommandProcessor';

const BudgetManager = () => {
  const [currentScreen, setCurrentScreen] = useState('chat');
  const [isListening, setIsListening] = useState(false);
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState([
    { type: 'ai', text: 'Hi! I\'m your voice-enabled budget assistant powered by Agora AI. I can help you: Log expenses ("Spent 250 on lunch"), Navigate ("Show dashboard"), Change settings ("Switch to USD"), Set budgets ("Set food budget 3000"), and answer questions ("Show budget"). Try saying "Help" for more commands!', time: '10:30 AM' }
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

    const newExpense = {
      id: Date.now(),
      amount,
      category,
      description,
      date: new Date().toLocaleDateString(),
      timestamp: Date.now()
    };
    setExpenses(prev => [...prev, newExpense]);

    return resultText;
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
      
      setTimeout(() => {
        setMessages(prev => [...prev, aiResponse]);
      }, 500);
    }

    setInputText('');
  };

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
            >
              ₹ INR
            </button>
            <button
              onClick={() => setCurrency('USD')}
              className={`currency-btn ${currency === 'USD' ? 'active' : ''}`}
            >
              $ USD
            </button>
          </div>
        </div>

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
            </div>
          </div>
        </div>
      </div>

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
                  </div>
                </div>
              </div>
            </div>

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
                  <div key={idx} className={`message-container ${msg.type === 'user' ? 'user' : 'ai'}`}>
                    <div className={`message-bubble ${msg.type === 'user' ? 'user' : 'ai'}`}>
                      <p className="message-text">{msg.text}</p>
                      <p className={`message-time ${msg.type === 'user' ? 'user' : 'ai'}`}>{msg.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {isListening && (
              <div className="voice-overlay">
                <div className="voice-overlay-content">
                  <div className="voice-mic-container">
                    <div className="voice-mic-ping"></div>
                    <div className="voice-mic-pulse"></div>
                    <div className="voice-mic-icon">
                      <Mic size={56} className="text-white" />
                    </div>
                  </div>
                  
                  <p className="voice-title">Listening...</p>
                  <p className="voice-subtitle">Speak naturally about your expense</p>
                  
                  <div className="voice-visualizer">
                    {[...Array(15)].map((_, i) => (
                      <div
                        key={i}
                        className="voice-bar"
                        style={{
                          height: `${Math.random() * 50 + 20}px`,
                          animationDelay: `${i * 0.1}s`
                        }}
                      />
                    ))}
                  </div>

                  <button
                    onClick={() => setIsListening(false)}
                    className="voice-stop-btn"
                  >
                    Stop Listening
                  </button>
                </div>
              </div>
            )}

            <div className="chat-input-container">
              {voiceError && (
                <div className="voice-error">
                  {voiceError}
                </div>
              )}
              <div className="input-wrapper">
                <div className="input-group">
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your expense like 'Spent 250 on lunch' or 'Invested 1000 in stocks'..."
                    className="text-input"
                  />
                  <button
                    onClick={handleSendMessage}
                    className="send-btn"
                  >
                    <Send size={20} />
                    Send
                  </button>
                  <button
                    onClick={handleVoiceClick}
                    className={`voice-btn ${isListening ? 'listening' : ''}`}
                    title={isListening ? 'Stop listening' : 'Start voice input'}
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
                            style={{ width: `${Math.min(spentPercentage, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

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
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                </div>

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
                  >
                    <option value="All">All Categories</option>
                    {Object.keys(budget.categories).map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="filter-select"
                  >
                    <option value="date">Sort by Date</option>
                    <option value="amount">Sort by Amount</option>
                    <option value="category">Sort by Category</option>
                  </select>
                </div>
              </div>
            </div>

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
                        </tr>
                      </thead>
                      <tbody>
                        {getFilteredAndSortedExpenses().map((expense, idx) => {
                          const IconComp = budget.categories[expense.category].icon;
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