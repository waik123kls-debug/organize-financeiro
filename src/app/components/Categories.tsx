"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Plus, Trash2, Edit2 } from "lucide-react"
import { getCategories, addCategory, deleteCategory } from "@/lib/storage"

interface CategoriesProps {
  onBack: () => void
}

export default function Categories({ onBack }: CategoriesProps) {
  const [categories, setCategories] = useState<any[]>([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [newCategory, setNewCategory] = useState({
    name: "",
    type: "expense" as "expense" | "income",
    icon: "📦",
    color: "#6b7280",
  })

  const icons = ["🍔", "🚗", "🏠", "💊", "📚", "🎮", "🛍️", "📄", "💰", "💼", "📈", "💵", "✈️", "🎬", "⚽", "🎵"]
  const colors = ["#ef4444", "#f97316", "#f59e0b", "#84cc16", "#10b981", "#14b8a6", "#06b6d4", "#3b82f6", "#6366f1", "#8b5cf6", "#a855f7", "#ec4899"]

  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = () => {
    setCategories(getCategories())
  }

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!newCategory.name) {
      alert("Digite um nome para a categoria")
      return
    }

    addCategory(newCategory)
    setNewCategory({ name: "", type: "expense", icon: "📦", color: "#6b7280" })
    setShowAddForm(false)
    loadCategories()
  }

  const handleDeleteCategory = (id: string) => {
    if (confirm("Deseja realmente excluir esta categoria?")) {
      deleteCategory(id)
      loadCategories()
    }
  }

  const expenseCategories = categories.filter((c) => c.type === "expense")
  const incomeCategories = categories.filter((c) => c.type === "income")

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-br from-purple-600 to-purple-500 text-white px-6 pt-8 pb-6 rounded-b-3xl shadow-xl">
        <div className="max-w-md mx-auto">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-white/90 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-medium">Voltar</span>
          </button>
          <h1 className="text-2xl font-bold">Categorias</h1>
          <p className="text-purple-100 text-sm mt-1">Organize suas transações</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-md mx-auto px-6 py-6 space-y-6">
        {/* Add Button */}
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="w-full bg-gradient-to-r from-purple-600 to-purple-500 text-white py-4 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Nova Categoria
        </button>

        {/* Add Form */}
        {showAddForm && (
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <form onSubmit={handleAddCategory} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Nome</label>
                <input
                  type="text"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                  placeholder="Ex: Restaurantes"
                  className="w-full px-4 py-3 bg-gray-50 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:outline-none transition-colors text-gray-800"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Tipo</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setNewCategory({ ...newCategory, type: "expense" })}
                    className={`py-3 rounded-xl border-2 font-medium transition-all ${
                      newCategory.type === "expense"
                        ? "border-red-500 bg-red-50 text-red-700"
                        : "border-gray-200 bg-white text-gray-600"
                    }`}
                  >
                    Despesa
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewCategory({ ...newCategory, type: "income" })}
                    className={`py-3 rounded-xl border-2 font-medium transition-all ${
                      newCategory.type === "income"
                        ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                        : "border-gray-200 bg-white text-gray-600"
                    }`}
                  >
                    Receita
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Ícone</label>
                <div className="grid grid-cols-8 gap-2">
                  {icons.map((icon) => (
                    <button
                      key={icon}
                      type="button"
                      onClick={() => setNewCategory({ ...newCategory, icon })}
                      className={`p-2 rounded-lg border-2 text-2xl transition-all ${
                        newCategory.icon === icon
                          ? "border-purple-500 bg-purple-50"
                          : "border-gray-200 bg-white hover:border-gray-300"
                      }`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Cor</label>
                <div className="grid grid-cols-6 gap-2">
                  {colors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setNewCategory({ ...newCategory, color })}
                      className={`w-10 h-10 rounded-lg border-2 transition-all ${
                        newCategory.color === color
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

        {/* Expense Categories */}
        <div>
          <h2 className="text-lg font-bold text-gray-800 mb-3">Despesas</h2>
          <div className="space-y-3">
            {expenseCategories.map((cat) => (
              <div
                key={cat.id}
                className="bg-white rounded-xl p-4 shadow-md border border-gray-100 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                    style={{ backgroundColor: cat.color + "20" }}
                  >
                    {cat.icon}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{cat.name}</p>
                    <p className="text-xs text-gray-500">Despesa</p>
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteCategory(cat.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Income Categories */}
        <div>
          <h2 className="text-lg font-bold text-gray-800 mb-3">Receitas</h2>
          <div className="space-y-3">
            {incomeCategories.map((cat) => (
              <div
                key={cat.id}
                className="bg-white rounded-xl p-4 shadow-md border border-gray-100 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                    style={{ backgroundColor: cat.color + "20" }}
                  >
                    {cat.icon}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{cat.name}</p>
                    <p className="text-xs text-gray-500">Receita</p>
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteCategory(cat.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
