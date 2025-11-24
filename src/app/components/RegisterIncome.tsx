"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Save, Calendar } from "lucide-react"
import { addTransaction, getCategories } from "@/lib/storage"

interface RegisterIncomeProps {
  onBack: () => void
}

export default function RegisterIncome({ onBack }: RegisterIncomeProps) {
  const [amount, setAmount] = useState("")
  const [category, setCategory] = useState("")
  const [description, setDescription] = useState("")
  const [date, setDate] = useState(new Date().toISOString().split("T")[0])
  const [categories, setCategories] = useState<any[]>([])

  useEffect(() => {
    const cats = getCategories().filter((c) => c.type === "income")
    setCategories(cats)
    if (cats.length > 0) {
      setCategory(cats[0].id)
    }
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!amount || !category) {
      alert("Preencha todos os campos obrigatórios")
      return
    }

    addTransaction({
      type: "income",
      amount: parseFloat(amount),
      category,
      description,
      date,
    })

    alert("Receita registrada com sucesso!")
    onBack()
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-br from-emerald-600 to-teal-600 text-white px-6 pt-8 pb-6 rounded-b-3xl shadow-xl">
        <div className="max-w-md mx-auto">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-white/90 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-medium">Voltar</span>
          </button>
          <h1 className="text-2xl font-bold">Registrar Receita</h1>
          <p className="text-emerald-100 text-sm mt-1">Adicione uma nova entrada</p>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-md mx-auto px-6 py-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Amount */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Valor *
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-gray-400">
                R$
              </span>
              <input
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0,00"
                className="w-full pl-16 pr-4 py-4 text-3xl font-bold text-gray-800 bg-gray-50 rounded-xl border-2 border-gray-200 focus:border-emerald-500 focus:outline-none transition-colors"
                required
              />
            </div>
          </div>

          {/* Category */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Categoria *
            </label>
            <div className="grid grid-cols-2 gap-3">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id)}
                  className={`p-4 rounded-xl border-2 transition-all hover:scale-105 ${
                    category === cat.id
                      ? "border-emerald-500 bg-emerald-50 shadow-md"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                >
                  <div className="text-3xl mb-2">{cat.icon}</div>
                  <p className="text-xs font-medium text-gray-700 truncate">{cat.name}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Descrição
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ex: Salário de Janeiro"
              className="w-full px-4 py-3 bg-gray-50 rounded-xl border-2 border-gray-200 focus:border-emerald-500 focus:outline-none transition-colors text-gray-800"
            />
          </div>

          {/* Date */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Data
            </label>
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-xl border-2 border-gray-200 focus:border-emerald-500 focus:outline-none transition-colors text-gray-800"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
          >
            <Save className="w-5 h-5" />
            Salvar Receita
          </button>
        </form>
      </div>
    </div>
  )
}
