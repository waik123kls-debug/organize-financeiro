"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Plus, Trash2, Target, TrendingUp } from "lucide-react"
import { getGoals, addGoal, updateGoal, deleteGoal } from "@/lib/storage"

interface GoalsProps {
  onBack: () => void
}

export default function Goals({ onBack }: GoalsProps) {
  const [goals, setGoals] = useState<any[]>([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [showAddAmount, setShowAddAmount] = useState<string | null>(null)
  const [addAmountValue, setAddAmountValue] = useState("")
  const [newGoal, setNewGoal] = useState({
    name: "",
    targetAmount: "",
    deadline: "",
    color: "#10b981",
  })

  const colors = ["#10b981", "#3b82f6", "#8b5cf6", "#ec4899", "#f59e0b", "#ef4444"]

  useEffect(() => {
    loadGoals()
  }, [])

  const loadGoals = () => {
    setGoals(getGoals())
  }

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!newGoal.name || !newGoal.targetAmount) {
      alert("Preencha todos os campos obrigatórios")
      return
    }

    addGoal({
      name: newGoal.name,
      targetAmount: parseFloat(newGoal.targetAmount),
      deadline: newGoal.deadline,
      color: newGoal.color,
    })

    setNewGoal({ name: "", targetAmount: "", deadline: "", color: "#10b981" })
    setShowAddForm(false)
    loadGoals()
  }

  const handleAddAmount = (goalId: string) => {
    if (!addAmountValue) return

    const goal = goals.find((g) => g.id === goalId)
    if (goal) {
      const newAmount = goal.currentAmount + parseFloat(addAmountValue)
      updateGoal(goalId, { currentAmount: Math.min(newAmount, goal.targetAmount) })
      setAddAmountValue("")
      setShowAddAmount(null)
      loadGoals()
    }
  }

  const handleDeleteGoal = (id: string) => {
    if (confirm("Deseja realmente excluir esta meta?")) {
      deleteGoal(id)
      loadGoals()
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  const getPercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100)
  }

  const getDaysRemaining = (deadline: string) => {
    if (!deadline) return null
    const today = new Date()
    const target = new Date(deadline)
    const diff = Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    return diff
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-br from-purple-600 to-pink-600 text-white px-6 pt-8 pb-6 rounded-b-3xl shadow-xl">
        <div className="max-w-md mx-auto">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-white/90 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-medium">Voltar</span>
          </button>
          <h1 className="text-2xl font-bold">Metas Financeiras</h1>
          <p className="text-purple-100 text-sm mt-1">Alcance seus objetivos</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-md mx-auto px-6 py-6 space-y-6">
        {/* Add Button */}
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Nova Meta
        </button>

        {/* Add Form */}
        {showAddForm && (
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <form onSubmit={handleAddGoal} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Nome da Meta *</label>
                <input
                  type="text"
                  value={newGoal.name}
                  onChange={(e) => setNewGoal({ ...newGoal, name: e.target.value })}
                  placeholder="Ex: Viagem para Europa"
                  className="w-full px-4 py-3 bg-gray-50 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:outline-none transition-colors text-gray-800"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Valor Alvo *</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold text-gray-400">
                    R$
                  </span>
                  <input
                    type="number"
                    step="0.01"
                    value={newGoal.targetAmount}
                    onChange={(e) => setNewGoal({ ...newGoal, targetAmount: e.target.value })}
                    placeholder="0,00"
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:outline-none transition-colors text-gray-800"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Prazo (opcional)</label>
                <input
                  type="date"
                  value={newGoal.deadline}
                  onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:outline-none transition-colors text-gray-800"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Cor</label>
                <div className="grid grid-cols-6 gap-2">
                  {colors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setNewGoal({ ...newGoal, color })}
                      className={`w-10 h-10 rounded-lg border-2 transition-all ${
                        newGoal.color === color
                          ? "border-gray-800 scale-110"
                          : "border-gray-200 hover:scale-105"
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-purple-600 text-white py-3 rounded-xl font-bold hover:bg-purple-700 transition-colors"
              >
                Adicionar
              </button>
            </form>
          </div>
        )}

        {/* Goals List */}
        {goals.length === 0 ? (
          <div className="bg-white rounded-xl p-8 shadow-md border border-gray-100 text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4 mx-auto">
              <Target className="w-8 h-8 text-purple-600" />
            </div>
            <p className="text-gray-500 text-sm">Nenhuma meta criada</p>
            <p className="text-gray-400 text-xs mt-1">Adicione sua primeira meta acima</p>
          </div>
        ) : (
          <div className="space-y-4">
            {goals.map((goal) => {
              const percentage = getPercentage(goal.currentAmount, goal.targetAmount)
              const daysRemaining = getDaysRemaining(goal.deadline)
              const isCompleted = goal.currentAmount >= goal.targetAmount

              return (
                <div
                  key={goal.id}
                  className="bg-white rounded-xl p-5 shadow-md border border-gray-100"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: goal.color + "20" }}
                      >
                        <Target className="w-6 h-6" style={{ color: goal.color }} />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{goal.name}</p>
                        {daysRemaining !== null && (
                          <p className="text-xs text-gray-500">
                            {daysRemaining > 0
                              ? `${daysRemaining} dias restantes`
                              : daysRemaining === 0
                              ? "Prazo hoje!"
                              : "Prazo vencido"}
                          </p>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteGoal(goal.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Progresso</span>
                      <span className="font-bold text-gray-800">
                        {formatCurrency(goal.currentAmount)} / {formatCurrency(goal.targetAmount)}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div>
                      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${percentage}%`,
                            backgroundColor: goal.color,
                          }}
                        />
                      </div>
                      <p className="text-xs text-right mt-1 font-medium text-gray-600">
                        {percentage.toFixed(0)}% alcançado
                      </p>
                    </div>

                    {isCompleted ? (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
                        <p className="text-sm text-green-700 font-bold">🎉 Meta alcançada!</p>
                      </div>
                    ) : (
                      <div>
                        {showAddAmount === goal.id ? (
                          <div className="flex gap-2">
                            <div className="relative flex-1">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-400">
                                R$
                              </span>
                              <input
                                type="number"
                                step="0.01"
                                value={addAmountValue}
                                onChange={(e) => setAddAmountValue(e.target.value)}
                                placeholder="0,00"
                                className="w-full pl-10 pr-3 py-2 bg-gray-50 rounded-lg border-2 border-gray-200 focus:border-purple-500 focus:outline-none text-sm"
                              />
                            </div>
                            <button
                              onClick={() => handleAddAmount(goal.id)}
                              className="px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors text-sm"
                            >
                              Adicionar
                            </button>
                            <button
                              onClick={() => {
                                setShowAddAmount(null)
                                setAddAmountValue("")
                              }}
                              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors text-sm"
                            >
                              Cancelar
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setShowAddAmount(goal.id)}
                            className="w-full py-2 bg-purple-100 text-purple-700 rounded-lg font-medium hover:bg-purple-200 transition-colors flex items-center justify-center gap-2 text-sm"
                          >
                            <TrendingUp className="w-4 h-4" />
                            Adicionar Valor
                          </button>
                        )}
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
