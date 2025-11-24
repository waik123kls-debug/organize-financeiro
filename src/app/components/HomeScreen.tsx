"use client"

import { useEffect, useState } from "react"
import { TrendingUp, TrendingDown, Wallet, Target, Tag, PieChart, Clock, DollarSign, Plus } from "lucide-react"
import { getTransactions, getCategories, getBudgets, getGoals, initializeStorage, calculateBudgetSpent } from "@/lib/storage"

interface HomeScreenProps {
  onNavigate: (screen: "expense" | "income" | "categories" | "budgets" | "goals" | "reports" | "history") => void
}

export default function HomeScreen({ onNavigate }: HomeScreenProps) {
  const [balance, setBalance] = useState(0)
  const [income, setIncome] = useState(0)
  const [expenses, setExpenses] = useState(0)
  const [recentTransactions, setRecentTransactions] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])

  useEffect(() => {
    initializeStorage()
    calculateBudgetSpent()
    loadData()
  }, [])

  const loadData = () => {
    const transactions = getTransactions()
    const cats = getCategories()
    
    const totalIncome = transactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0)
    
    const totalExpenses = transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0)
    
    setIncome(totalIncome)
    setExpenses(totalExpenses)
    setBalance(totalIncome - totalExpenses)
    setRecentTransactions(transactions.slice(-5).reverse())
    setCategories(cats)
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  const getCategoryById = (id: string) => {
    return categories.find((c) => c.id === id)
  }

  return (
    <div className="min-h-screen pb-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-emerald-600 to-teal-600 text-white px-6 pt-8 pb-24 rounded-b-3xl shadow-xl">
        <div className="max-w-md mx-auto">
          <h1 className="text-2xl font-bold mb-2">Olá! 👋</h1>
          <p className="text-emerald-100 text-sm">Bem-vindo ao seu controle financeiro</p>
        </div>
      </div>

      {/* Balance Card */}
      <div className="max-w-md mx-auto px-6 -mt-16">
        <div className="bg-white rounded-2xl shadow-2xl p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                <Wallet className="w-5 h-5 text-emerald-600" />
              </div>
              <span className="text-gray-600 text-sm font-medium">Saldo Total</span>
            </div>
          </div>
          <div className="mb-6">
            <p className={`text-4xl font-bold ${balance >= 0 ? "text-emerald-600" : "text-red-600"}`}>
              {formatCurrency(balance)}
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-emerald-50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                <span className="text-xs text-emerald-700 font-medium">Receitas</span>
              </div>
              <p className="text-lg font-bold text-emerald-600">{formatCurrency(income)}</p>
            </div>
            
            <div className="bg-red-50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingDown className="w-4 h-4 text-red-600" />
                <span className="text-xs text-red-700 font-medium">Despesas</span>
              </div>
              <p className="text-lg font-bold text-red-600">{formatCurrency(expenses)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="max-w-md mx-auto px-6 mt-6">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Ações Rápidas</h2>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => onNavigate("expense")}
            className="bg-white rounded-xl p-4 shadow-md border border-gray-100 hover:shadow-lg transition-all hover:scale-105 active:scale-95"
          >
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-3 mx-auto">
              <TrendingDown className="w-6 h-6 text-red-600" />
            </div>
            <p className="text-sm font-semibold text-gray-800">Nova Despesa</p>
          </button>

          <button
            onClick={() => onNavigate("income")}
            className="bg-white rounded-xl p-4 shadow-md border border-gray-100 hover:shadow-lg transition-all hover:scale-105 active:scale-95"
          >
            <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mb-3 mx-auto">
              <TrendingUp className="w-6 h-6 text-emerald-600" />
            </div>
            <p className="text-sm font-semibold text-gray-800">Nova Receita</p>
          </button>

          <button
            onClick={() => onNavigate("budgets")}
            className="bg-white rounded-xl p-4 shadow-md border border-gray-100 hover:shadow-lg transition-all hover:scale-105 active:scale-95"
          >
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3 mx-auto">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
            <p className="text-sm font-semibold text-gray-800">Orçamentos</p>
          </button>

          <button
            onClick={() => onNavigate("goals")}
            className="bg-white rounded-xl p-4 shadow-md border border-gray-100 hover:shadow-lg transition-all hover:scale-105 active:scale-95"
          >
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-3 mx-auto">
              <Target className="w-6 h-6 text-purple-600" />
            </div>
            <p className="text-sm font-semibold text-gray-800">Metas</p>
          </button>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="max-w-md mx-auto px-6 mt-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-800">Transações Recentes</h2>
          <button
            onClick={() => onNavigate("history")}
            className="text-sm text-emerald-600 font-medium hover:text-emerald-700"
          >
            Ver todas
          </button>
        </div>
        
        {recentTransactions.length === 0 ? (
          <div className="bg-white rounded-xl p-8 shadow-md border border-gray-100 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 mx-auto">
              <Clock className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500 text-sm">Nenhuma transação ainda</p>
            <p className="text-gray-400 text-xs mt-1">Adicione sua primeira transação acima</p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentTransactions.map((transaction) => {
              const category = getCategoryById(transaction.category)
              return (
                <div
                  key={transaction.id}
                  className="bg-white rounded-xl p-4 shadow-md border border-gray-100 flex items-center justify-between hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${
                      transaction.type === "income" ? "bg-emerald-100" : "bg-red-100"
                    }`}>
                      {category?.icon || "📦"}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800 text-sm">{category?.name || "Outros"}</p>
                      <p className="text-xs text-gray-500">{transaction.description}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(transaction.date).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold text-lg ${
                      transaction.type === "income" ? "text-emerald-600" : "text-red-600"
                    }`}>
                      {transaction.type === "income" ? "+" : "-"}{formatCurrency(transaction.amount)}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
