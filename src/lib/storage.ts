// Local Storage utilities for finance data

export interface Transaction {
  id: string
  type: "expense" | "income"
  amount: number
  category: string
  description: string
  date: string
  createdAt: string
}

export interface Category {
  id: string
  name: string
  type: "expense" | "income"
  icon: string
  color: string
}

export interface Budget {
  id: string
  categoryId: string
  amount: number
  month: string
  spent: number
}

export interface Goal {
  id: string
  name: string
  targetAmount: number
  currentAmount: number
  deadline: string
  color: string
}

// Default categories for Brazilian users
export const defaultCategories: Category[] = [
  // Expense categories
  { id: "1", name: "Alimentação", type: "expense", icon: "🍔", color: "#ef4444" },
  { id: "2", name: "Transporte", type: "expense", icon: "🚗", color: "#f97316" },
  { id: "3", name: "Moradia", type: "expense", icon: "🏠", color: "#8b5cf6" },
  { id: "4", name: "Saúde", type: "expense", icon: "💊", color: "#ec4899" },
  { id: "5", name: "Educação", type: "expense", icon: "📚", color: "#3b82f6" },
  { id: "6", name: "Lazer", type: "expense", icon: "🎮", color: "#06b6d4" },
  { id: "7", name: "Compras", type: "expense", icon: "🛍️", color: "#a855f7" },
  { id: "8", name: "Contas", type: "expense", icon: "📄", color: "#64748b" },
  { id: "9", name: "Outros", type: "expense", icon: "📦", color: "#6b7280" },
  // Income categories
  { id: "10", name: "Salário", type: "income", icon: "💰", color: "#10b981" },
  { id: "11", name: "Freelance", type: "income", icon: "💼", color: "#14b8a6" },
  { id: "12", name: "Investimentos", type: "income", icon: "📈", color: "#059669" },
  { id: "13", name: "Outros", type: "income", icon: "💵", color: "#22c55e" },
]

// Storage keys
const STORAGE_KEYS = {
  TRANSACTIONS: "finance_transactions",
  CATEGORIES: "finance_categories",
  BUDGETS: "finance_budgets",
  GOALS: "finance_goals",
}

// Initialize default data
export const initializeStorage = () => {
  if (typeof window === "undefined") return

  if (!localStorage.getItem(STORAGE_KEYS.CATEGORIES)) {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(defaultCategories))
  }
  if (!localStorage.getItem(STORAGE_KEYS.TRANSACTIONS)) {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify([]))
  }
  if (!localStorage.getItem(STORAGE_KEYS.BUDGETS)) {
    localStorage.setItem(STORAGE_KEYS.BUDGETS, JSON.stringify([]))
  }
  if (!localStorage.getItem(STORAGE_KEYS.GOALS)) {
    localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify([]))
  }
}

// Transactions
export const getTransactions = (): Transaction[] => {
  if (typeof window === "undefined") return []
  const data = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS)
  return data ? JSON.parse(data) : []
}

export const addTransaction = (transaction: Omit<Transaction, "id" | "createdAt">): Transaction => {
  const transactions = getTransactions()
  const newTransaction: Transaction = {
    ...transaction,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  }
  transactions.push(newTransaction)
  localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions))
  return newTransaction
}

export const deleteTransaction = (id: string) => {
  const transactions = getTransactions().filter((t) => t.id !== id)
  localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions))
}

// Categories
export const getCategories = (): Category[] => {
  if (typeof window === "undefined") return defaultCategories
  const data = localStorage.getItem(STORAGE_KEYS.CATEGORIES)
  return data ? JSON.parse(data) : defaultCategories
}

export const addCategory = (category: Omit<Category, "id">): Category => {
  const categories = getCategories()
  const newCategory: Category = {
    ...category,
    id: Date.now().toString(),
  }
  categories.push(newCategory)
  localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories))
  return newCategory
}

export const deleteCategory = (id: string) => {
  const categories = getCategories().filter((c) => c.id !== id)
  localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories))
}

// Budgets
export const getBudgets = (): Budget[] => {
  if (typeof window === "undefined") return []
  const data = localStorage.getItem(STORAGE_KEYS.BUDGETS)
  return data ? JSON.parse(data) : []
}

export const addBudget = (budget: Omit<Budget, "id" | "spent">): Budget => {
  const budgets = getBudgets()
  const newBudget: Budget = {
    ...budget,
    id: Date.now().toString(),
    spent: 0,
  }
  budgets.push(newBudget)
  localStorage.setItem(STORAGE_KEYS.BUDGETS, JSON.stringify(budgets))
  return newBudget
}

export const updateBudget = (id: string, updates: Partial<Budget>) => {
  const budgets = getBudgets()
  const index = budgets.findIndex((b) => b.id === id)
  if (index !== -1) {
    budgets[index] = { ...budgets[index], ...updates }
    localStorage.setItem(STORAGE_KEYS.BUDGETS, JSON.stringify(budgets))
  }
}

export const deleteBudget = (id: string) => {
  const budgets = getBudgets().filter((b) => b.id !== id)
  localStorage.setItem(STORAGE_KEYS.BUDGETS, JSON.stringify(budgets))
}

// Goals
export const getGoals = (): Goal[] => {
  if (typeof window === "undefined") return []
  const data = localStorage.getItem(STORAGE_KEYS.GOALS)
  return data ? JSON.parse(data) : []
}

export const addGoal = (goal: Omit<Goal, "id" | "currentAmount">): Goal => {
  const goals = getGoals()
  const newGoal: Goal = {
    ...goal,
    id: Date.now().toString(),
    currentAmount: 0,
  }
  goals.push(newGoal)
  localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(goals))
  return newGoal
}

export const updateGoal = (id: string, updates: Partial<Goal>) => {
  const goals = getGoals()
  const index = goals.findIndex((g) => g.id === id)
  if (index !== -1) {
    goals[index] = { ...goals[index], ...updates }
    localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(goals))
  }
}

export const deleteGoal = (id: string) => {
  const goals = getGoals().filter((g) => g.id !== id)
  localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(goals))
}

// Calculate budget spent amounts
export const calculateBudgetSpent = () => {
  const transactions = getTransactions()
  const budgets = getBudgets()
  
  budgets.forEach((budget) => {
    const spent = transactions
      .filter((t) => t.type === "expense" && t.category === budget.categoryId && t.date.startsWith(budget.month))
      .reduce((sum, t) => sum + t.amount, 0)
    
    updateBudget(budget.id, { spent })
  })
}
