"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Search, Filter, Trash2, Clock } from "lucide-react"
import { getTransactions, deleteTransaction, getCategories } from "@/lib/storage"

interface HistoryProps {
  onBack: () => void
}

export default function History({ onBack }: HistoryProps) {
  const [transactions, setTransactions] = useState<any[]>([])
  const [filteredTransactions, setFilteredTransactions] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState<"all" | "income" | "expense">("all")
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7))

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [transactions, searchTerm, filterType, selectedMonth])

  const loadData = () => {
    setTransactions(getTransactions().reverse())
    setCategories(getCategories())
  }

  const applyFilters = () => {
    let filtered = [...transactions]

    // Filter by month
    filtered = filtered.filter((t) => t.date.startsWith(selectedMonth))

    // Filter by type
    if (filterType !== "all") {
      filtered = filtered.filter((t) => t.type === filterType)
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (t) =>
          t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          getCategoryById(t.category)?.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredTransactions(filtered)
  }

  const handleDeleteTransaction = (id: string) => {
    if (confirm("Deseja realmente excluir esta transação?")) {
      deleteTransaction(id)
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

  const groupByDate = (transactions: any[]) => {
    const grouped: { [key: string]: any[] } = {}
    
    transactions.forEach((t) => {
      const date = new Date(t.date).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
      
      if (!grouped[date]) {
        grouped[date] = []
      }
      grouped[date].push(t)
    })
    
    return grouped
  }

  const groupedTransactions = groupByDate(filteredTransactions)

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-br from-indigo-600 to-purple-600 text-white px-6 pt-8 pb-6 rounded-b-3xl shadow-xl">
        <div className="max-w-md mx-auto">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-white/90 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-medium">Voltar</span>
          </button>
          <h1 className="text-2xl font-bold">Histórico</h1>
          <p className="text-indigo-100 text-sm mt-1">Todas as suas transações</p>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-md mx-auto px-6 py-6 space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar transações..."
            className="w-full pl-12 pr-4 py-3 bg-white rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none transition-colors text-gray-800 shadow-md"
          />
        </div>

        {/* Month Selector */}
        <div className="bg-white rounded-xl shadow-md p-4 border border-gray-100">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Período</label>
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="w-full px-4 py-2 bg-gray-50 rounded-lg border-2 border-gray-200 focus:border-indigo-500 focus:outline-none transition-colors text-gray-800"
          />
        </div>

        {/* Type Filter */}
        <div className="bg-white rounded-xl shadow-md p-4 border border-gray-100">
          <div className="flex items-center gap-2 mb-3">
            <Filter className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-semibold text-gray-700">Tipo</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => setFilterType("all")}
              className={`py-2 rounded-lg font-medium text-sm transition-all ${
                filterType === "all"
                  ? "bg-indigo-600 text-white shadow-md"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Todas
            </button>
            <button
              onClick={() => setFilterType("income")}
              className={`py-2 rounded-lg font-medium text-sm transition-all ${
                filterType === "income"
                  ? "bg-emerald-600 text-white shadow-md"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Receitas
            </button>
            <button
              onClick={() => setFilterType("expense")}
              className={`py-2 rounded-lg font-medium text-sm transition-all ${
                filterType === "expense"
                  ? "bg-red-600 text-white shadow-md"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Despesas
            </button>
          </div>
        </div>

        {/* Results Count */}
        <div className="text-center">
          <p className="text-sm text-gray-600">
            {filteredTransactions.length} transação(ões) encontrada(s)
          </p>
        </div>

        {/* Transactions List */}
        {Object.keys(groupedTransactions).length === 0 ? (
          <div className="bg-white rounded-xl p-8 shadow-md border border-gray-100 text-center">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4 mx-auto">
              <Clock className="w-8 h-8 text-indigo-600" />
            </div>
            <p className="text-gray-500 text-sm">Nenhuma transação encontrada</p>
            <p className="text-gray-400 text-xs mt-1">Tente ajustar os filtros</p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedTransactions).map(([date, items]) => (
              <div key={date}>
                <h3 className="text-sm font-bold text-gray-600 mb-3 px-2">{date}</h3>
                <div className="space-y-3">
                  {items.map((transaction) => {
                    const category = getCategoryById(transaction.category)
                    return (
                      <div
                        key={transaction.id}
                        className="bg-white rounded-xl p-4 shadow-md border border-gray-100 flex items-center justify-between hover:shadow-lg transition-shadow"
                      >
                        <div className="flex items-center gap-3 flex-1">
                          <div
                            className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${
                              transaction.type === "income" ? "bg-emerald-100" : "bg-red-100"
                            }`}
                          >
                            {category?.icon || "📦"}
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-gray-800 text-sm">{category?.name || "Outros"}</p>
                            <p className="text-xs text-gray-500">{transaction.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <p
                              className={`font-bold text-lg ${
                                transaction.type === "income" ? "text-emerald-600" : "text-red-600"
                              }`}
                            >
                              {transaction.type === "income" ? "+" : "-"}
                              {formatCurrency(transaction.amount)}
                            </p>
                          </div>
                          <button
                            onClick={() => handleDeleteTransaction(transaction.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
