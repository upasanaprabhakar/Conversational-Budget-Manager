/**
 * Voice Command Processor for Budget Manager
 * Processes voice commands and returns actions to execute
 */

export const processVoiceCommand = (transcript, state) => {
  const lowerText = transcript.toLowerCase().trim();
  
<<<<<<< HEAD
  console.log('🎤 Processing voice command:', lowerText);
  
  // Navigation commands
  if (lowerText.includes('show dashboard') || lowerText.includes('open dashboard') || lowerText.includes('go to dashboard')) {
    console.log('✅ Navigation command detected: dashboard');
=======
  console.log('Processing voice command:', lowerText);
  
  // Navigation commands
  if (lowerText.includes('show dashboard') || lowerText.includes('open dashboard') || lowerText.includes('go to dashboard')) {
>>>>>>> d2135889da78bc9fff4cddac1ceaa3ff19358976
    return {
      type: 'navigate',
      screen: 'dashboard',
      response: 'Opening dashboard...'
    };
  }
  
  if (lowerText.includes('show expenses') || lowerText.includes('open expenses') || lowerText.includes('go to expenses') || lowerText.includes('view expenses')) {
<<<<<<< HEAD
    console.log('✅ Navigation command detected: expenses');
=======
>>>>>>> d2135889da78bc9fff4cddac1ceaa3ff19358976
    return {
      type: 'navigate',
      screen: 'expenses',
      response: 'Opening expenses list...'
    };
  }
  
  if (lowerText.includes('show settings') || lowerText.includes('open settings') || lowerText.includes('go to settings')) {
<<<<<<< HEAD
    console.log('✅ Navigation command detected: settings');
=======
>>>>>>> d2135889da78bc9fff4cddac1ceaa3ff19358976
    return {
      type: 'navigate',
      screen: 'settings',
      response: 'Opening settings...'
    };
  }
  
  if (lowerText.includes('show chat') || lowerText.includes('open chat') || lowerText.includes('go to chat') || lowerText.includes('back to chat')) {
<<<<<<< HEAD
    console.log('✅ Navigation command detected: chat');
=======
>>>>>>> d2135889da78bc9fff4cddac1ceaa3ff19358976
    return {
      type: 'navigate',
      screen: 'chat',
      response: 'Opening chat...'
    };
  }

  // View information commands - CHECK THESE FIRST to avoid false matches
  // Check for "total spent" queries BEFORE budget change commands
  if (lowerText.includes('how much have i spent') || 
      lowerText.includes('what have i spent') || 
      lowerText.includes('tell me how much i spent') ||
      (lowerText.includes('total') && lowerText.includes('spent') && !lowerText.includes('budget'))) {
<<<<<<< HEAD
    console.log('✅ Info command detected: total spent');
=======
>>>>>>> d2135889da78bc9fff4cddac1ceaa3ff19358976
    return {
      type: 'info',
      response: `You've spent a total of ${state.formatAmount(state.budget.spent)} out of your ${state.formatAmount(state.budget.total)} budget.`
    };
  }

  if (lowerText.includes('show budget') || lowerText.includes('what is my budget') || lowerText.includes('tell me my budget')) {
<<<<<<< HEAD
    console.log('✅ Info command detected: show budget');
=======
>>>>>>> d2135889da78bc9fff4cddac1ceaa3ff19358976
    const total = state.budget.total;
    const spent = state.budget.spent;
    const remaining = total - spent;
    return {
      type: 'info',
      response: `Your total budget is ${state.formatAmount(total)}. You've spent ${state.formatAmount(spent)} and have ${state.formatAmount(remaining)} remaining.`
    };
  }

  if (lowerText.includes('how much is remaining') || lowerText.includes('what is remaining') || lowerText.includes('remaining budget')) {
<<<<<<< HEAD
    console.log('✅ Info command detected: remaining budget');
=======
>>>>>>> d2135889da78bc9fff4cddac1ceaa3ff19358976
    const remaining = state.budget.total - state.budget.spent;
    return {
      type: 'info',
      response: `You have ${state.formatAmount(remaining)} remaining from your ${state.formatAmount(state.budget.total)} budget.`
    };
  }

  // Currency commands
  if (lowerText.includes('change currency to usd') || lowerText.includes('switch to usd') || lowerText.includes('use usd')) {
<<<<<<< HEAD
    console.log('✅ Currency command detected: USD');
=======
>>>>>>> d2135889da78bc9fff4cddac1ceaa3ff19358976
    return {
      type: 'setCurrency',
      currency: 'USD',
      response: 'Currency changed to USD'
    };
  }
  
  if (lowerText.includes('change currency to inr') || lowerText.includes('switch to inr') || lowerText.includes('use inr')) {
<<<<<<< HEAD
    console.log('✅ Currency command detected: INR');
=======
>>>>>>> d2135889da78bc9fff4cddac1ceaa3ff19358976
    return {
      type: 'setCurrency',
      currency: 'INR',
      response: 'Currency changed to INR'
    };
  }

  // Savings goal commands - CHECK BEFORE budget commands to avoid conflicts
  // Support both "savings goal" and shorthand "save" commands
  // Check for "save" shorthand first (before expense logging)
  // Only match if it's clearly a savings goal command, not expense-related
  if (!lowerText.includes('spent') && !lowerText.includes('paid') && !lowerText.includes('bought')) {
    const saveMatch = lowerText.match(/(?:^|\s)(?:set|change|update|make)?\s*save\s+(\d+)/);
    if (saveMatch) {
      const goal = parseInt(saveMatch[1]);
<<<<<<< HEAD
      console.log('✅ Savings goal shorthand match:', goal);
=======
      console.log('Save shorthand match:', goal);
>>>>>>> d2135889da78bc9fff4cddac1ceaa3ff19358976
      return {
        type: 'setSavingsGoal',
        goal,
        response: `Savings goal set to ${state.formatAmount(goal)}`
      };
    }
  }

  // Check for savings goal with multiple flexible patterns
  if (lowerText.includes('savings') && lowerText.includes('goal')) {
<<<<<<< HEAD
    console.log('🔍 Found savings goal keywords, trying patterns...');
=======
    console.log('Found savings goal keywords, trying patterns...');
>>>>>>> d2135889da78bc9fff4cddac1ceaa3ff19358976
    
    // Extract all numbers from the text
    const numbers = lowerText.match(/\d+/g);
    if (numbers && numbers.length > 0) {
      // Use the last number (most likely the goal amount)
      const goal = parseInt(numbers[numbers.length - 1]);
<<<<<<< HEAD
      console.log('📊 Savings goal extracted number:', goal);
=======
      console.log('Savings goal extracted number:', goal);
>>>>>>> d2135889da78bc9fff4cddac1ceaa3ff19358976
      
      // Pattern 1: "set savings goal 10000" or "set savings goal to 10000" (most common)
      let match = lowerText.match(/(?:set|change|update) (?:my|the)? savings goal (?:to|as|is)? (\d+)/);
      if (match) {
        const matchedGoal = parseInt(match[1]);
<<<<<<< HEAD
        console.log('✅ Savings goal match 1:', matchedGoal);
=======
        console.log('Savings goal match 1:', matchedGoal);
>>>>>>> d2135889da78bc9fff4cddac1ceaa3ff19358976
        return {
          type: 'setSavingsGoal',
          goal: matchedGoal,
          response: `Savings goal set to ${state.formatAmount(matchedGoal)}`
        };
      }

      // Pattern 2: "savings goal is 10000" or "savings goal should be 10000"
      match = lowerText.match(/savings goal (?:is|should be|to) (\d+)/);
      if (match) {
        const matchedGoal = parseInt(match[1]);
<<<<<<< HEAD
        console.log('✅ Savings goal match 2:', matchedGoal);
=======
        console.log('Savings goal match 2:', matchedGoal);
>>>>>>> d2135889da78bc9fff4cddac1ceaa3ff19358976
        return {
          type: 'setSavingsGoal',
          goal: matchedGoal,
          response: `Savings goal set to ${state.formatAmount(matchedGoal)}`
        };
      }

      // Pattern 3: "change savings goal to 10000" (without "my" or "the")
      match = lowerText.match(/(?:change|set|update) savings goal (?:to|as) (\d+)/);
      if (match) {
        const matchedGoal = parseInt(match[1]);
<<<<<<< HEAD
        console.log('✅ Savings goal match 3:', matchedGoal);
=======
        console.log('Savings goal match 3:', matchedGoal);
>>>>>>> d2135889da78bc9fff4cddac1ceaa3ff19358976
        return {
          type: 'setSavingsGoal',
          goal: matchedGoal,
          response: `Savings goal set to ${state.formatAmount(matchedGoal)}`
        };
      }

      // Pattern 4: "make savings goal 10000" or "make my savings goal 10000"
      match = lowerText.match(/make (?:my|the)? savings goal (?:to|as|is)? (\d+)/);
      if (match) {
        const matchedGoal = parseInt(match[1]);
<<<<<<< HEAD
        console.log('✅ Savings goal match 4:', matchedGoal);
=======
        console.log('Savings goal match 4:', matchedGoal);
>>>>>>> d2135889da78bc9fff4cddac1ceaa3ff19358976
        return {
          type: 'setSavingsGoal',
          goal: matchedGoal,
          response: `Savings goal set to ${state.formatAmount(matchedGoal)}`
        };
      }

      // Pattern 5: Any text with "savings goal" followed by a number (most flexible fallback)
      match = lowerText.match(/savings goal.*?(\d+)/);
      if (match) {
        const matchedGoal = parseInt(match[1]);
<<<<<<< HEAD
        console.log('✅ Savings goal match 5 (fallback):', matchedGoal);
=======
        console.log('Savings goal match 5 (fallback):', matchedGoal);
>>>>>>> d2135889da78bc9fff4cddac1ceaa3ff19358976
        return {
          type: 'setSavingsGoal',
          goal: matchedGoal,
          response: `Savings goal set to ${state.formatAmount(matchedGoal)}`
        };
      }
      
      // Ultimate fallback: if we have "savings goal" and a number, use it
<<<<<<< HEAD
      console.log('✅ Savings goal fallback: using extracted number', goal);
=======
      console.log('Savings goal fallback: using extracted number', goal);
>>>>>>> d2135889da78bc9fff4cddac1ceaa3ff19358976
      return {
        type: 'setSavingsGoal',
        goal,
        response: `Savings goal set to ${state.formatAmount(goal)}`
      };
    }
    
<<<<<<< HEAD
    console.log('⚠️ Savings goal keywords found but no number found');
=======
    console.log('Savings goal keywords found but no number found');
>>>>>>> d2135889da78bc9fff4cddac1ceaa3ff19358976
  }

  // Total monthly budget commands (check this BEFORE category limits and expenses)
  // Make sure it doesn't match "total spent" or savings goal
  // Only match if it explicitly mentions "budget" and NOT "spent" or "savings"
  if (lowerText.includes('budget') && !lowerText.includes('spent') && !lowerText.includes('savings') && !lowerText.includes('how much')) {
    // Pattern 1: "change monthly budget to 10000 from 8500" or "change monthly budget to 10000"
    const totalBudgetMatch1 = lowerText.match(/(?:change|set|update) (?:monthly|total)? ?budget (?:to|as) (\d+)(?: from \d+)?/);
    if (totalBudgetMatch1) {
      const newTotal = parseInt(totalBudgetMatch1[1]);
<<<<<<< HEAD
      console.log('✅ Total budget command detected:', newTotal);
=======
>>>>>>> d2135889da78bc9fff4cddac1ceaa3ff19358976
      return {
        type: 'setTotalBudget',
        total: newTotal,
        response: `Monthly budget changed to ${state.formatAmount(newTotal)}`
      };
    }

    // Pattern 2: "monthly budget is 10000" or "monthly budget should be 10000"
    // But make sure it's not "total spent" - check that "budget" comes before any number
    const totalBudgetMatch2 = lowerText.match(/(?:monthly|total) budget (?:is|should be|to) (\d+)/);
    if (totalBudgetMatch2) {
      const newTotal = parseInt(totalBudgetMatch2[1]);
<<<<<<< HEAD
      console.log('✅ Total budget command detected (pattern 2):', newTotal);
=======
>>>>>>> d2135889da78bc9fff4cddac1ceaa3ff19358976
      return {
        type: 'setTotalBudget',
        total: newTotal,
        response: `Monthly budget changed to ${state.formatAmount(newTotal)}`
      };
    }

    // Pattern 3: "set budget 10000" (simple form)
    const totalBudgetMatch3 = lowerText.match(/(?:set|make) (?:my|the)? (?:monthly|total)? ?budget (?:to|as|is)? (\d+)/);
    if (totalBudgetMatch3) {
      const newTotal = parseInt(totalBudgetMatch3[1]);
<<<<<<< HEAD
      console.log('✅ Total budget command detected (pattern 3):', newTotal);
=======
>>>>>>> d2135889da78bc9fff4cddac1ceaa3ff19358976
      return {
        type: 'setTotalBudget',
        total: newTotal,
        response: `Monthly budget changed to ${state.formatAmount(newTotal)}`
      };
    }
  }

  // Budget limit commands
  const setLimitMatch = lowerText.match(/set (food|transport|entertainment|shopping|health|investment) (?:budget|limit) (?:to|as)? (\d+)/);
  if (setLimitMatch) {
    const category = setLimitMatch[1].charAt(0).toUpperCase() + setLimitMatch[1].slice(1);
    const limit = parseInt(setLimitMatch[2]);
<<<<<<< HEAD
    console.log('✅ Category limit command detected:', category, limit);
=======
>>>>>>> d2135889da78bc9fff4cddac1ceaa3ff19358976
    return {
      type: 'setCategoryLimit',
      category,
      limit,
      response: `Set ${category} budget limit to ${state.formatAmount(limit)}`
    };
  }

  if (lowerText.includes('show expenses') || lowerText.includes('list expenses') || lowerText.includes('my expenses')) {
<<<<<<< HEAD
    console.log('✅ List expenses command detected');
=======
>>>>>>> d2135889da78bc9fff4cddac1ceaa3ff19358976
    const count = state.expenses.length;
    if (count === 0) {
      return {
        type: 'info',
        response: 'You have no expenses recorded yet. Start tracking your expenses by saying something like "Spent 250 on lunch".'
      };
    }
    const recent = state.expenses.slice(-5).map(e => `${state.formatAmount(e.amount)} on ${e.category}`).join(', ');
    return {
      type: 'info',
      response: `You have ${count} expenses recorded. Recent expenses: ${recent}.`
    };
  }

  // Category spending queries
  const categorySpendingMatch = lowerText.match(/how much (?:have i|did i) spent (?:on|for) (food|transport|entertainment|shopping|health|investment)/);
  if (categorySpendingMatch) {
    const category = categorySpendingMatch[1].charAt(0).toUpperCase() + categorySpendingMatch[1].slice(1);
    const categoryData = state.budget.categories[category];
<<<<<<< HEAD
    console.log('✅ Category spending query detected:', category);
=======
>>>>>>> d2135889da78bc9fff4cddac1ceaa3ff19358976
    if (categoryData) {
      return {
        type: 'info',
        response: `You've spent ${state.formatAmount(categoryData.spent)} on ${category}. Your limit is ${state.formatAmount(categoryData.limit)}.`
      };
    }
  }

  // Expense logging (existing functionality) - Only process if it's clearly an expense
  // Check for expense action words FIRST to avoid false positives
<<<<<<< HEAD
  const expenseActionWords = ['spend', 'spent', 'pay', 'paid', 'buy', 'bought', 'invest', 'invested', 'use', 'used', 'cost', 'purchase', 'purchased'];
  const hasExpenseAction = expenseActionWords.some(word => lowerText.includes(word));
  
  console.log('🔍 Checking expense action words:', hasExpenseAction);
  
=======
  const expenseActionWords = ['spent', 'paid', 'bought', 'invested', 'used', 'cost', 'purchased', 'bought'];
  const hasExpenseAction = expenseActionWords.some(word => lowerText.includes(word));
  
>>>>>>> d2135889da78bc9fff4cddac1ceaa3ff19358976
  // Only process as expense if it has expense action words AND a number
  // AND doesn't contain budget-related keywords
  const budgetKeywords = ['budget', 'limit', 'goal', 'total', 'monthly'];
  const hasBudgetKeyword = budgetKeywords.some(word => lowerText.includes(word));
  
<<<<<<< HEAD
  console.log('🔍 Has budget keyword:', hasBudgetKeyword);
  
  if (hasExpenseAction && !hasBudgetKeyword) {
    const amountMatch = lowerText.match(/(\d+)/);
    console.log('🔍 Amount match:', amountMatch);
    
    if (amountMatch) {
      const amount = parseInt(amountMatch[1]);
      let category = 'Shopping'; // Default category
      
      // Category detection with priority order
      if (lowerText.includes('invest') || lowerText.includes('stock') || lowerText.includes('mutual fund') ||
          lowerText.includes('sip') || lowerText.includes('bond') || lowerText.includes('crypto') ||
          lowerText.includes('deposit') || lowerText.includes('saving') || lowerText.includes('fd')) {
        category = 'Investment';
      } else if (lowerText.includes('lunch') || lowerText.includes('food') || lowerText.includes('dinner') ||
=======
  if (hasExpenseAction && !hasBudgetKeyword) {
    const amountMatch = lowerText.match(/(\d+)/);
    if (amountMatch) {
      const amount = parseInt(amountMatch[1]);
      let category = 'Shopping';
      
      if (lowerText.includes('lunch') || lowerText.includes('food') || lowerText.includes('dinner') ||
>>>>>>> d2135889da78bc9fff4cddac1ceaa3ff19358976
          lowerText.includes('breakfast') || lowerText.includes('coffee') || lowerText.includes('restaurant') || 
          lowerText.includes('groceries') || lowerText.includes('snack') || lowerText.includes('candy') ||
          lowerText.includes('meal') || lowerText.includes('eat')) {
        category = 'Food';
      } else if (lowerText.includes('uber') || lowerText.includes('cab') || lowerText.includes('transport') ||
                 lowerText.includes('metro') || lowerText.includes('bus') || lowerText.includes('taxi') ||
                 lowerText.includes('ride') || lowerText.includes('fuel') || lowerText.includes('gas')) {
        category = 'Transport';
      } else if (lowerText.includes('movie') || lowerText.includes('entertainment') || lowerText.includes('game') ||
                 lowerText.includes('concert') || lowerText.includes('music') || lowerText.includes('streaming')) {
        category = 'Entertainment';
      } else if (lowerText.includes('medicine') || lowerText.includes('doctor') || lowerText.includes('health') ||
                 lowerText.includes('gym') || lowerText.includes('hospital') || lowerText.includes('pharmacy')) {
        category = 'Health';
<<<<<<< HEAD
      } else if (lowerText.includes('shopping') || lowerText.includes('buy') || lowerText.includes('purchase') ||
                 lowerText.includes('store') || lowerText.includes('mall') || lowerText.includes('cloth') || lowerText.includes('shoe')) {
        category = 'Shopping';
      }

      console.log('✅ Expense detected:', { amount, category, description: transcript });
      
=======
      } else if (lowerText.includes('invest') || lowerText.includes('stock') || lowerText.includes('mutual fund') ||
                 lowerText.includes('sip') || lowerText.includes('bond') || lowerText.includes('crypto') ||
                 lowerText.includes('deposit')) {
        category = 'Investment';
      } else if (lowerText.includes('shopping') || lowerText.includes('buy') || lowerText.includes('purchase') ||
                 lowerText.includes('store') || lowerText.includes('mall')) {
        category = 'Shopping';
      }

>>>>>>> d2135889da78bc9fff4cddac1ceaa3ff19358976
      return {
        type: 'logExpense',
        amount,
        category,
        description: transcript,
        response: null // Will be generated by logExpense function
      };
    }
  }

  // Help command
  if (lowerText.includes('help') || lowerText.includes('what can you do') || lowerText.includes('commands')) {
<<<<<<< HEAD
    console.log('✅ Help command detected');
    return {
      type: 'info',
      response: 'I can help you: Log expenses (e.g., "Spent 250 on lunch" or "Invested 1000 in stocks"), Change monthly budget ("Change monthly budget to 10000"), View budget ("Show budget"), Navigate ("Show dashboard"), Change currency ("Switch to USD"), Set category limits ("Set food budget 3000"), Set savings goal ("Set savings goal 10000"), and more!'
=======
    return {
      type: 'info',
      response: 'I can help you: Log expenses (e.g., "Spent 250 on lunch"), Change monthly budget ("Change monthly budget to 10000"), View budget ("Show budget"), Navigate ("Show dashboard"), Change currency ("Switch to USD"), Set category limits ("Set food budget 3000"), Set savings goal ("Set savings goal 10000"), and more!'
>>>>>>> d2135889da78bc9fff4cddac1ceaa3ff19358976
    };
  }

  // Default response
<<<<<<< HEAD
  console.log('❌ Command not recognized, returning unknown');
  return {
    type: 'unknown',
    response: 'I didn\'t understand that. Try saying "Spent 250 on lunch" or "Invested 1000 in stocks" to log an expense, or "Show budget" to view your budget. Say "Help" for more commands.'
  };
};
=======
  return {
    type: 'unknown',
    response: 'I didn\'t understand that. Try saying "Spent 250 on lunch" to log an expense, or "Show budget" to view your budget. Say "Help" for more commands.'
  };
};

>>>>>>> d2135889da78bc9fff4cddac1ceaa3ff19358976
