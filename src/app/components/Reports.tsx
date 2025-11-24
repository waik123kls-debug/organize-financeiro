"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, TrendingUp, TrendingDown, PieChart as PieChartIcon } from "lucide-react"
import { getTransactions, getCategories } from "@/lib/storage"

interface ReportsProps {
  onBack: () => void
}

export default function Reports({ onBack }: ReportsProps) {
  const [period, setPeriod] = useState("month")
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7))
  const [transactions, setTransactions] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [stats, setStats] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    balance: 0,
    expensesByCategory: [] as any[],
    incomeByCategory: [] as any[],
  })

  useEffect(() => {
    loadData()
  }, [selectedMonth])

  const loadData = () => {
    const allTransactions = getTransactions()
    const allCategories = getCategories()
    
    // Filter by selected month
    const filtered = allTransactions.filter((t) => t.date.startsWith(selectedMonth))
    
    const totalIncome = filtered
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0)
    
    const totalExpenses = filtered
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0)
    
    // Group by category
    const expensesByCategory = allCategories
      .filter((c) => c.type === "expense")
      .map((cat) => {
        const total = filtered
          .filter((t) => t.type === "expense" && t.category === cat.id)
          .reduce((sum, t) => sum + t.amount, 0)
        return { ...cat, total }
      })
      .filter((c) => c.total > 0)
      .sort((a, b) => b.total - a.total)
    
    const incomeByCategory = allCategories
      .filter((c) => c.type === "income")
      .map((cat) => {
        const total = filtered
          .filter((t) => t.type === "income" && t.category === cat.id)
          .reduce((sum, t) => sum + t.amount, 0)
        return { ...cat, total }
      })
      .filter((c) => c.total > 0)
      .sort((a, b) => b.total - a.total)
    
    setTransactions(filtered)
    setCategories(allCategories)
    setStats({
      totalIncome,
      totalExpenses,
      balance: totalIncome - totalExpenses,
      expensesByCategory,
      incomeByCategory,
    })
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  const getPercentage = (value: number, total: number) => {
    return total > 0 ? (value / total) * 100 : 0
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white px-6 pt-8 pb-6 rounded-b-3xl shadow-xl">
        <div className="max-w-md mx-auto">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-white/90 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-medium">Voltar</span>
          </button>
          <h1 className="text-2xl font-bold">Relatórios</h1>
          <p className="text-blue-100 text-sm mt-1">Análise financeira detalhada</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-md mx-auto px-6 py-6 space-y-6">
        {/* Period Selector */}
        <div className="bg-white rounded-2xl shadow-lg p-4 border border-gray-100">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Período</label>
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="w-full px-4 py-3 bg-gray-50 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-colors text-gray-800"
          />
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 gap-4">
          <div className="bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5" />
              <span className="text-sm font-medium opacity-90">Receitas</span>
            </div>
            <p className="text-3xl font-bold">{formatCurrency(stats.totalIncome)}</p>
          </div>

          <div className="bg-gradient-to-br from-red-500 to-pink-500 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center gap-2 mb-2">
              <TrendingDown className="w-5 h-5" />
              <span className="text-sm font-medium opacity-90">Despesas</span>
            </div>
            <p className="text-3xl font-bold">{formatCurrency(stats.totalExpenses)}</p>
          </div>

          <div className={`rounded-2xl p-6 text-white shadow-lg ${
            stats.balance >= 0
              ? "bg-gradient-to-br from-blue-500 to-indigo-500"
              : "bg-gradient-to-br from-orange-500 to-red-500"
          }`}>
            <div className="flex items-center gap-2 mb-2">
              <PieChartIcon className="w-5 h-5" />
              <span className="text-sm font-medium opacity-90">Saldo</span>
            </div>
            <p className="text-3xl font-bold">{formatCurrency(stats.balance)}</p>
          </div>
        </div>

        {/* Expenses by Category */}
        {stats.expensesByCategory.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Despesas por Categoria</h2>
            <div className="space-y-4">
              {stats.expensesByCategory.map((cat) => {
                const percentage = getPercentage(cat.total, stats.totalExpenses)
                return (
                  <div key={cat.id}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{cat.icon}</span>
                        <span className="text-sm font-medium text-gray-700">{cat.name}</span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-gray-800">{formatCurrency(cat.total)}</p>
                        <p className="text-xs text-gray-500">{percentage.toFixed(1)}%</p>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${percentage}%`,
                          backgroundColor: cat.color,
                        }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Income by Category */}
        {stats.incomeByCategory.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Receitas por Categoria</h2>
            <div className="space-y-4">
              {stats.incomeByCategory.map((cat) => {
                const percentage = getPercentage(cat.total, stats.totalIncome)
                return (
                  <div key={cat.id}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{cat.icon}</span>
                        <span className="text-sm font-medium text-gray-700">{cat.name}</span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-gray-800">{formatCurrency(cat.total)}</p>
                        <p className="text-xs text-gray-500">{percentage.toFixed(1)}%</p>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${percentage}%`,
                          backgroundColor: cat.color,
                        }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Empty State */}
        {stats.expensesByCategory.length === 0 && stats.incomeByCategory.length === 0 && (
          <div className="bg-white rounded-xl p-8 shadow-md border border-gray-100 text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 mx-auto">
              <PieChartIcon className="w-8 h-8 text-blue-600" />
            </div>
            <p className="text-gray-500 text-sm">Nenhuma transação neste período</p>
            <p className="text-gray-400 text-xs mt-1">Adicione transações para ver os relatórios</p>
          </div>
        )}
      </div>
    </div>
  )
}
