"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Plus, Trash2, DollarSign } from "lucide-react"
import { getBudgets, addBudget, deleteBudget, getCategories, calculateBudgetSpent } from "@/lib/storage"

interface BudgetsProps {
  onBack: () => void
}

export default function Budgets({ onBack }: BudgetsProps) {
  const [budgets, setBudgets] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [newBudget, setNewBudget] = useState({
    categoryId: "",
    amount: "",
    month: new Date().toISOString().slice(0, 7),
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = () => {
    calculateBudgetSpent()
    setBudgets(getBudgets())
    const cats = getCategories().filter((c) => c.type === "expense")
    setCategories(cats)
    if (cats.length > 0 && !newBudget.categoryId) {
      setNewBudget({ ...newBudget, categoryId: cats[0].id })
    }
  }

  const handleAddBudget = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!newBudget.categoryId || !newBudget.amount) {
      alert("Preencha todos os campos")
      return
    }

    addBudget({
      categoryId: newBudget.categoryId,
      amount: parseFloat(newBudget.amount),
      month: newBudget.month,
    })

    setNewBudget({
      categoryId: categories[0]?.id || "",
      amount: "",
      month: new Date().toISOString().slice(0, 7),
    })
    setShowAddForm(false)
    loadData()
  }

  const handleDeleteBudget = (id: string) => {
    if (confirm("Deseja realmente excluir este orçamento?")) {
      deleteBudget(id)
      loadData()
    }
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

  const getPercentage = (spent: number, total: number) => {
    return Math.min((spent / total) * 100, 100)
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-500 text-white px-6 pt-8 pb-6 rounded-b-3xl shadow-xl">
        <div className="max-w-md mx-auto">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-white/90 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-medium">Voltar</span>
          </button>
          <h1 className="text-2xl font-bold">Orçamentos</h1>
          <p className="text-blue-100 text-sm mt-1">Controle seus gastos mensais</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-md mx-auto px-6 py-6 space-y-6">
        {/* Add Button */}
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white py-4 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Novo Orçamento
        </button>

        {/* Add Form */}
        {showAddForm && (
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <form onSubmit={handleAddBudget} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Categoria</label>
                <select
                  value={newBudget.categoryId}
                  onChange={(e) => setNewBudget({ ...newBudget, categoryId: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-colors text-gray-800"
                  required
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.icon} {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Valor Limite</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold text-gray-400">
                    R$
                  </span>
                  <input
                    type="number"
                    step="0.01"
                    value={newBudget.amount}
                    onChange={(e) => setNewBudget({ ...newBudget, amount: e.target.value })}
                    placeholder="0,00"
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-colors text-gray-800"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Mês</label>
                <input
                  type="month"
                  value={newBudget.month}
                  onChange={(e) => setNewBudget({ ...newBudget, month: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-colors text-gray-800"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors"
              >
                Adicionar
              </button>
            </form>
          </div>
        )}

        {/* Budgets List */}
        {budgets.length === 0 ? (
          <div className="bg-white rounded-xl p-8 shadow-md border border-gray-100 text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 mx-auto">
              <DollarSign className="w-8 h-8 text-blue-600" />
            </div>
            <p className="text-gray-500 text-sm">Nenhum orçamento criado</p>
            <p className="text-gray-400 text-xs mt-1">Adicione seu primeiro orçamento acima</p>
          </div>
        ) : (
          <div className="space-y-4">
            {budgets.map((budget) => {
              const category = getCategoryById(budget.categoryId)
              const percentage = getPercentage(budget.spent, budget.amount)
              const isOverBudget = budget.spent > budget.amount

              return (
                <div
                  key={budget.id}
                  className="bg-white rounded-xl p-5 shadow-md border border-gray-100"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                        style={{ backgroundColor: category?.color + "20" }}
                      >
                        {category?.icon || "📦"}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{category?.name || "Categoria"}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(budget.month + "-01").toLocaleDateString("pt-BR", {
                            month: "long",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteBudget(budget.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Gasto</span>
                      <span className={`font-bold ${isOverBudget ? "text-red-600" : "text-gray-800"}`}>
                        {formatCurrency(budget.spent)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Limite</span>
                      <span className="font-bold text-gray-800">{formatCurrency(budget.amount)}</span>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="mt-3">
                      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            isOverBudget ? "bg-red-500" : "bg-blue-500"
                          }`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <p className={`text-xs text-right mt-1 font-medium ${
                        isOverBudget ? "text-red-600" : "text-gray-600"
                      }`}>
                        {percentage.toFixed(0)}% utilizado
                      </p>
                    </div>

                    {isOverBudget && (
                      <div className="mt-2 bg-red-50 border border-red-200 rounded-lg p-2">
                        <p className="text-xs text-red-700 font-medium">
                          ⚠️ Orçamento excedido em {formatCurrency(budget.spent - budget.amount)}
                        </p>
                      </div>
                    )}
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
