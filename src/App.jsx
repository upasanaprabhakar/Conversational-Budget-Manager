import React, { useState, useEffect, useRef } from 'react';
import { Mic, Send, TrendingUp, DollarSign, ShoppingBag, Car, Film, Heart, Zap, Menu, Bell, Home, BarChart3, Settings, User, MessageSquare, PieChart, Trash2, Edit2, X, Check, Calendar, Filter, ArrowUpDown, UtensilsCrossed, Activity } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

const USER_ID = '507f1f77bcf86cd799439011'; // Replace with actual user ID from auth

const BudgetManager = () => {
  const [currentScreen, setCurrentScreen] = useState('chat');
  const [isListening, setIsListening] = useState(false);
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState([
    { type: 'ai', text: 'Hi! I\'m your voice-enabled budget assistant. I can help you: Log expenses ("Spent 250 on lunch"), Navigate ("Show dashboard"), Change settings ("Switch to USD"), Set budgets ("Set food budget 3000"), and answer questions ("Show budget"). Try saying "Help" for more commands!', time: '10:30 AM' }
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
  const [isLoading, setIsLoading] = useState(false);
  const [voiceError, setVoiceError] = useState(null);
  const [recognition, setRecognition] = useState(null);
  
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

  // Icon mapping for categories
  const iconMapping = {
    Food: UtensilsCrossed,
    Transport: Car,
    Entertainment: Film,
    Shopping: ShoppingBag,
    Health: Activity,
    Investment: TrendingUp
  };

  const colorMapping = {
    Food: 'from-orange-400 to-orange-600',
    Transport: 'from-blue-400 to-blue-600',
    Entertainment: 'from-purple-400 to-purple-600',
    Shopping: 'from-pink-400 to-pink-600',
    Health: 'from-red-400 to-red-600',
    Investment: 'from-green-400 to-emerald-600'
  };

  // Fetch budget from backend - FIXED VERSION
const fetchBudget = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/budget/${USER_ID}`);
    const result = await response.json();
    
    if (result.success) {
      const backendBudget = result.data;
      
      // Helper function to safely get category data
      const getCategoryData = (categoryName) => {
        const backendCategory = backendBudget.categories[categoryName];
        return {
          spent: backendCategory?.spent || 0,
          limit: backendCategory?.limit || 0
        };
      };
      
      setBudget({
        total: backendBudget.totalBudget,
        spent: backendBudget.totalSpent,
        categories: {
          Food: { 
            ...getCategoryData('Food'),
            icon: UtensilsCrossed,
            color: 'from-orange-400 to-orange-600'
          },
          Transport: { 
            ...getCategoryData('Transport'),
            icon: Car,
            color: 'from-blue-400 to-blue-600'
          },
          Entertainment: { 
            ...getCategoryData('Entertainment'),
            icon: Film,
            color: 'from-purple-400 to-purple-600'
          },
          Shopping: { 
            ...getCategoryData('Shopping'),
            icon: ShoppingBag,
            color: 'from-pink-400 to-pink-600'
          },
          Health: { 
            ...getCategoryData('Health'),
            icon: Activity,
            color: 'from-red-400 to-red-600'
          },
          Investment: { 
            ...getCategoryData('Investment'), // ← Now gets actual data from backend
            icon: TrendingUp,
            color: 'from-green-400 to-emerald-600'
          }
        }
      });
    }
  } catch (error) {
    console.error('Error fetching budget:', error);
  }
};

  // Fetch expenses from backend
  const fetchExpenses = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/expenses/${USER_ID}`);
      const result = await response.json();
      
      if (result.success) {
        const formattedExpenses = result.data.map(exp => ({
          id: exp._id,
          amount: exp.amount,
          category: exp.category,
          description: exp.description,
          date: new Date(exp.date).toLocaleDateString(),
          timestamp: new Date(exp.date).getTime()
        }));
        setExpenses(formattedExpenses);
      }
    } catch (error) {
      console.error('Error fetching expenses:', error);
    }
  };

  // Load data on mount
  useEffect(() => {
    fetchBudget();
    fetchExpenses();
  }, []);

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

  // Voice command processor
  const processVoiceCommand = (transcript, state) => {
    const lowerText = transcript.toLowerCase().trim();
    
    console.log('Processing voice command:', lowerText);
    
    // Navigation commands
    if (lowerText.includes('show dashboard') || lowerText.includes('open dashboard') || lowerText.includes('go to dashboard')) {
      return { type: 'navigate', screen: 'dashboard', response: 'Opening dashboard...' };
    }
    
    if (lowerText.includes('show expenses') || lowerText.includes('open expenses') || lowerText.includes('view expenses')) {
      return { type: 'navigate', screen: 'expenses', response: 'Opening expenses list...' };
    }
    
    if (lowerText.includes('show settings') || lowerText.includes('open settings')) {
      return { type: 'navigate', screen: 'settings', response: 'Opening settings...' };
    }
    
    if (lowerText.includes('show chat') || lowerText.includes('back to chat')) {
      return { type: 'navigate', screen: 'chat', response: 'Opening chat...' };
    }

    // View information commands
    if (lowerText.includes('how much have i spent') || lowerText.includes('what have i spent') || 
        (lowerText.includes('total') && lowerText.includes('spent') && !lowerText.includes('budget'))) {
      return {
        type: 'info',
        response: `You've spent a total of ${state.formatAmount(state.budget.spent)} out of your ${state.formatAmount(state.budget.total)} budget.`
      };
    }

    if (lowerText.includes('show budget') || lowerText.includes('what is my budget')) {
      const total = state.budget.total;
      const spent = state.budget.spent;
      const remaining = total - spent;
      return {
        type: 'info',
        response: `Your total budget is ${state.formatAmount(total)}. You've spent ${state.formatAmount(spent)} and have ${state.formatAmount(remaining)} remaining.`
      };
    }

    // Currency commands
    if (lowerText.includes('change currency to usd') || lowerText.includes('switch to usd')) {
      return { type: 'setCurrency', currency: 'USD', response: 'Currency changed to USD' };
    }
    
    if (lowerText.includes('change currency to inr') || lowerText.includes('switch to inr')) {
      return { type: 'setCurrency', currency: 'INR', response: 'Currency changed to INR' };
    }

    // Savings goal commands
    if (lowerText.includes('savings') && lowerText.includes('goal')) {
      const numbers = lowerText.match(/\d+/g);
      if (numbers && numbers.length > 0) {
        const goal = parseInt(numbers[numbers.length - 1]);
        return {
          type: 'setSavingsGoal',
          goal,
          response: `Savings goal set to ${state.formatAmount(goal)}`
        };
      }
    }

    // Budget limit commands
    const setLimitMatch = lowerText.match(/set (food|transport|entertainment|shopping|health|investment) (?:budget|limit) (?:to|as)? (\d+)/);
    if (setLimitMatch) {
      const category = setLimitMatch[1].charAt(0).toUpperCase() + setLimitMatch[1].slice(1);
      const limit = parseInt(setLimitMatch[2]);
      return {
        type: 'setCategoryLimit',
        category,
        limit,
        response: `Set ${category} budget limit to ${state.formatAmount(limit)}`
      };
    }

    // Help command
    if (lowerText.includes('help') || lowerText.includes('what can you do')) {
      return {
        type: 'info',
        response: 'I can help you: Log expenses (e.g., "Spent 250 on lunch"), View budget ("Show budget"), Navigate ("Show dashboard"), Change currency ("Switch to USD"), Set limits ("Set food budget 3000"), and more!'
      };
    }

    // Expense logging
    const expenseActionWords = ['spent', 'paid', 'bought', 'invested', 'used', 'cost', 'purchased'];
    const hasExpenseAction = expenseActionWords.some(word => lowerText.includes(word));
    
    if (hasExpenseAction) {
      const amountMatch = lowerText.match(/(\d+)/);
      if (amountMatch) {
        const amount = parseInt(amountMatch[1]);
        let category = 'Shopping';
        
        if (lowerText.includes('lunch') || lowerText.includes('food') || lowerText.includes('dinner') ||
            lowerText.includes('breakfast') || lowerText.includes('coffee') || lowerText.includes('restaurant')) {
          category = 'Food';
        } else if (lowerText.includes('uber') || lowerText.includes('cab') || lowerText.includes('transport') ||
                   lowerText.includes('metro') || lowerText.includes('bus')) {
          category = 'Transport';
        } else if (lowerText.includes('movie') || lowerText.includes('entertainment') || lowerText.includes('game')) {
          category = 'Entertainment';
        } else if (lowerText.includes('medicine') || lowerText.includes('doctor') || lowerText.includes('health') ||
                   lowerText.includes('gym')) {
          category = 'Health';
        } else if (lowerText.includes('invest') || lowerText.includes('stock') || lowerText.includes('mutual fund')) {
          category = 'Investment';
        }

        return {
          type: 'logExpense',
          amount,
          category,
          description: transcript,
          response: null
        };
      }
    }

    // Default response
    return {
      type: 'unknown',
      response: 'I didn\'t understand that. Try saying "Spent 250 on lunch" to log an expense, or "Show budget" to view your budget.'
    };
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

  const logExpense = async (amount, category, description) => {
    try {
      setIsLoading(true);
      
      const response = await fetch(`${API_BASE_URL}/expenses/${USER_ID}/parse`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          category,
          description,
          entryMethod: 'text'
        })
      });

      const result = await response.json();
      
      if (result.success) {
        // Update local state with backend data
        await fetchBudget();
        await fetchExpenses();
        
        return result.message;
      } else {
        return 'Failed to log expense. Please try again.';
      }
    } catch (error) {
      console.error('Error logging expense:', error);
      return 'Failed to log expense. Please try again.';
    } finally {
      setIsLoading(false);
    }
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

  // Initialize Web Speech API
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      setVoiceError('Voice recognition is not supported in this browser. Please use Chrome, Edge, or Safari.');
      return;
    }

    const recognitionInstance = new SpeechRecognition();
    recognitionInstance.continuous = false;
    recognitionInstance.interimResults = false;
    recognitionInstance.lang = 'en-US';

    recognitionInstance.onstart = () => {
      setIsListening(true);
      setVoiceError(null);
    };

    recognitionInstance.onresult = async (event) => {
      const transcript = event.results[0][0].transcript;
      console.log('Voice transcript:', transcript);
      setInputText(transcript);
      setIsListening(false);
      
      // Process voice command
      setTimeout(async () => {
        if (transcript.trim()) {
          const userMessage = { type: 'user', text: transcript, time: getCurrentTime() };
          setMessages(prev => [...prev, userMessage]);

          const command = processVoiceCommand(transcript, {
            budget: budgetRef.current,
            expenses: expensesRef.current,
            currency: currencyRef.current,
            savingsGoal: savingsGoalRef.current,
            formatAmount
          });

          console.log('Command detected:', command.type, command);

          let aiResponseText = '';

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
              const newLimit = command.limit;
              const category = command.category;
              const newBudget = { ...budgetRef.current };
              newBudget.categories[category].limit = newLimit;
              const newTotal = Object.values(newBudget.categories).reduce((sum, cat) => sum + cat.limit, 0);
              
              try {
                const updatedCategories = {};
                updatedCategories[category] = { limit: newLimit };

                const response = await fetch(`${API_BASE_URL}/budget/${USER_ID}`, {
                  method: 'PUT',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    totalBudget: newTotal,
                    categories: updatedCategories
                  })
                });

                if (response.ok) {
                  await fetchBudget();
                }
              } catch (error) {
                console.error('Error updating budget:', error);
              }
              
              aiResponseText = command.response;
              break;

            case 'setSavingsGoal':
              setSavingsGoal(command.goal);
              aiResponseText = command.response;
              break;

            case 'logExpense':
              aiResponseText = await logExpense(command.amount, command.category, command.description);
              break;

            case 'info':
              aiResponseText = command.response;
              break;

            case 'unknown':
            default:
              const expenseData = parseExpenseFromText(transcript);
              if (expenseData) {
                const { amount, category } = expenseData;
                aiResponseText = await logExpense(amount, category, transcript);
              } else {
                aiResponseText = command.response;
              }
              break;
          }

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
    };

    recognitionInstance.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      
      let errorMessage = 'Voice recognition error. Please try again.';
      if (event.error === 'no-speech') {
        errorMessage = 'No speech detected. Please try again.';
      } else if (event.error === 'audio-capture') {
        errorMessage = 'Microphone not found. Please check your microphone settings.';
      } else if (event.error === 'not-allowed') {
        errorMessage = 'Microphone permission denied. Please allow microphone access.';
      }
      
      setVoiceError(errorMessage);
      
      setTimeout(() => {
        setVoiceError(null);
      }, 5000);
    };

    recognitionInstance.onend = () => {
      setIsListening(false);
    };

    setRecognition(recognitionInstance);

    return () => {
      if (recognitionInstance) {
        recognitionInstance.stop();
      }
    };
  }, []);

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage = { type: 'user', text: inputText, time: getCurrentTime() };
    setMessages(prev => [...prev, userMessage]);

    // Process text command using voice command processor
    const command = processVoiceCommand(inputText, {
      budget: budgetRef.current,
      expenses: expensesRef.current,
      currency: currencyRef.current,
      savingsGoal: savingsGoalRef.current,
      formatAmount
    });

    let aiResponseText = '';

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
        const newLimit = command.limit;
        const category = command.category;
        const newBudget = { ...budgetRef.current };
        newBudget.categories[category].limit = newLimit;
        const newTotal = Object.values(newBudget.categories).reduce((sum, cat) => sum + cat.limit, 0);
        
        try {
          const updatedCategories = {};
          updatedCategories[category] = { limit: newLimit };

          const response = await fetch(`${API_BASE_URL}/budget/${USER_ID}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              totalBudget: newTotal,
              categories: updatedCategories
            })
          });

          if (response.ok) {
            await fetchBudget();
          }
        } catch (error) {
          console.error('Error updating budget:', error);
        }
        
        aiResponseText = command.response;
        break;

      case 'setSavingsGoal':
        setSavingsGoal(command.goal);
        aiResponseText = command.response;
        break;

      case 'logExpense':
        aiResponseText = await logExpense(command.amount, command.category, command.description);
        break;

      case 'info':
        aiResponseText = command.response;
        break;

      case 'unknown':
      default:
        const expenseData = parseExpenseFromText(inputText);
        if (expenseData) {
          const { amount, category } = expenseData;
          aiResponseText = await logExpense(amount, category, inputText);
        } else {
          aiResponseText = command.response;
        }
        break;
    }

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
    if (!recognition) {
      setVoiceError('Voice recognition is not available in this browser.');
      return;
    }

    if (isListening) {
      try {
        recognition.stop();
        setIsListening(false);
      } catch (error) {
        console.error('Error stopping voice recognition:', error);
        setIsListening(false);
      }
    } else {
      try {
        recognition.start();
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

  const deleteExpense = async (expenseId) => {
  try {
    console.log('🗑️ Deleting expense:', expenseId);
    
    const response = await fetch(`${API_BASE_URL}/expenses/${USER_ID}/${expenseId}`, {
      method: 'DELETE'
    });

    const result = await response.json();
    console.log('Delete response:', result);
    
    if (result.success) {
      // Immediately update budget state with the returned budget
      if (result.budget) {
        console.log('📊 Updating budget after delete:', {
          totalSpent: result.budget.totalSpent,
          categories: result.budget.categories
        });
        
        // Helper function to safely get category data
        const getCategoryData = (categoryName) => {
          const backendCategory = result.budget.categories[categoryName];
          return {
            spent: backendCategory?.spent || 0,
            limit: backendCategory?.limit || 0
          };
        };
        
        // Update budget state immediately
        setBudget({
          total: result.budget.totalBudget,
          spent: result.budget.totalSpent,
          categories: {
            Food: { 
              ...getCategoryData('Food'),
              icon: UtensilsCrossed,
              color: 'from-orange-400 to-orange-600'
            },
            Transport: { 
              ...getCategoryData('Transport'),
              icon: Car,
              color: 'from-blue-400 to-blue-600'
            },
            Entertainment: { 
              ...getCategoryData('Entertainment'),
              icon: Film,
              color: 'from-purple-400 to-purple-600'
            },
            Shopping: { 
              ...getCategoryData('Shopping'),
              icon: ShoppingBag,
              color: 'from-pink-400 to-pink-600'
            },
            Health: { 
              ...getCategoryData('Health'),
              icon: Activity,
              color: 'from-red-400 to-red-600'
            },
            Investment: { 
              ...getCategoryData('Investment'),
              icon: TrendingUp,
              color: 'from-green-400 to-emerald-600'
            }
          }
        });
      }
      
      // Then fetch expenses to update the list
      await fetchExpenses();
      
      const aiResponse = {
        type: 'ai',
        text: result.message,
        time: getCurrentTime()
      };
      setMessages(prev => [...prev, aiResponse]);
      
      console.log('✅ Expense deleted and state updated');
    } else {
      console.error('❌ Delete failed:', result.error);
    }
  } catch (error) {
    console.error('❌ Error deleting expense:', error);
  }
};

  const startEditingCategory = (category) => {
    setEditingCategory(category);
    setEditingLimit(budget.categories[category].limit.toString());
  };

  const updateCategoryLimit = async (category) => {
    const newLimit = parseInt(editingLimit);
    if (newLimit >= 0) {
      try {
        // Calculate new total budget
        const newBudget = { ...budget };
        newBudget.categories[category].limit = newLimit;
        
        // Calculate total as sum of all category limits
        const newTotal = Object.values(newBudget.categories).reduce((sum, cat) => sum + cat.limit, 0);
        
        const updatedCategories = {};
        updatedCategories[category] = { limit: newLimit };

        const response = await fetch(`${API_BASE_URL}/budget/${USER_ID}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            totalBudget: newTotal,
            categories: updatedCategories
          })
        });

        const result = await response.json();
        
        if (result.success) {
          await fetchBudget();
        }
      } catch (error) {
        console.error('Error updating budget limit:', error);
      }
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

  const handleSuggestionAction = async (suggestion) => {
    let aiResponseText = '';

    switch (suggestion.type) {
      case 'investment':
        aiResponseText = await logExpense(suggestion.amount, 'Investment', suggestion.title);
        aiResponseText = `Great! I've logged your ${formatAmount(suggestion.amount)} investment. ${aiResponseText}`;
        break;
      case 'goal':
        aiResponseText = await logExpense(suggestion.amount, 'Investment', suggestion.title);
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
            >
              ₹ INR
            </button>
            <button
              onClick={() => setCurrency('USD')}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-semibold transition-all ${
                currency === 'USD'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              $ USD
            </button>
          </div>
        </div>

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
            </div>
          </div>
        </div>
      </div>

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
                  </div>
                </div>
              </div>
            </div>

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
                      {aiSuggestions.map((suggestion) => {
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
                                  disabled={isLoading}
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

            <div className="bg-white border-t border-gray-200 shadow-2xl p-6">
              <div className="max-w-4xl mx-auto">
                <div className="flex items-center gap-4">
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your expense like 'Spent 250 on lunch' or 'Invested 1000 in stocks'..."
                    className="flex-1 py-4 px-6 bg-gray-50 rounded-2xl text-base focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-200"
                    disabled={isLoading}
                  />
                  <button
                    onClick={handleSendMessage}
                    className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl font-semibold hover:shadow-xl transition-all duration-200 flex items-center gap-2 disabled:opacity-50"
                    disabled={isLoading}
                  >
                    <Send size={20} />
                    {isLoading ? 'Sending...' : 'Send'}
                  </button>
                  <button
                    onClick={handleVoiceClick}
                    className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl hover:shadow-2xl transition-all duration-200 hover:scale-105"
                    disabled={isLoading}
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
                            style={{ width: `${Math.min(spentPercentage, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

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
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                </div>

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
                  >
                    <option value="All">All Categories</option>
                    {Object.keys(budget.categories).map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
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
              </div>
            </div>

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
                        </tr>
                      </thead>
                      <tbody>
                        {getFilteredAndSortedExpenses().map((expense, idx) => {
                          const IconComp = budget.categories[expense.category].icon;
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
            <div className="bg-white border-b border-gray-200 shadow-sm px-8 py-6">
              <h2 className="text-3xl font-bold text-gray-800">Budget Settings</h2>
              <p className="text-gray-500 mt-1">Customize your budget limits and goals</p>
            </div>

            <div className="flex-1 overflow-y-auto p-8">
              <div className="max-w-4xl mx-auto space-y-6">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-6 border-2 border-blue-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Total Monthly Budget</p>
                      <p className="text-4xl font-bold text-blue-600">{formatAmount(budget.total)}</p>
                      <p className="text-xs text-gray-500 mt-2">Auto-calculated from category limits</p>
                    </div>
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                      <DollarSign size={32} className="text-white" />
                    </div>
                  </div>
                </div>

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