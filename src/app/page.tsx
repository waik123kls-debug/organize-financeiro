"use client"

import { useState, useEffect } from "react"
import { Home, TrendingDown, TrendingUp, Tag, Target, PieChart, Clock, Settings } from "lucide-react"
import HomeScreen from "./components/HomeScreen"
import RegisterExpense from "./components/RegisterExpense"
import RegisterIncome from "./components/RegisterIncome"
import Categories from "./components/Categories"
import Budgets from "./components/Budgets"
import Goals from "./components/Goals"
import Reports from "./components/Reports"
import History from "./components/History"
import SettingsScreen from "./components/SettingsScreen"

type Screen = "home" | "expense" | "income" | "categories" | "budgets" | "goals" | "reports" | "history" | "settings"

export default function FinanceApp() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("home")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  const renderScreen = () => {
    switch (currentScreen) {
      case "home":
        return <HomeScreen onNavigate={setCurrentScreen} />
      case "expense":
        return <RegisterExpense onBack={() => setCurrentScreen("home")} />
      case "income":
        return <RegisterIncome onBack={() => setCurrentScreen("home")} />
      case "categories":
        return <Categories onBack={() => setCurrentScreen("home")} />
      case "budgets":
        return <Budgets onBack={() => setCurrentScreen("home")} />
      case "goals":
        return <Goals onBack={() => setCurrentScreen("home")} />
      case "reports":
        return <Reports onBack={() => setCurrentScreen("home")} />
      case "history":
        return <History onBack={() => setCurrentScreen("home")} />
      case "settings":
        return <SettingsScreen onBack={() => setCurrentScreen("home")} />
      default:
        return <HomeScreen onNavigate={setCurrentScreen} />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      {/* Main Content */}
      <main className="pb-20">
        {renderScreen()}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
        <div className="max-w-md mx-auto px-4">
          <div className="flex items-center justify-around py-3">
            <button
              onClick={() => setCurrentScreen("home")}
              className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all ${
                currentScreen === "home"
                  ? "text-emerald-600 bg-emerald-50"
                  : "text-gray-600 hover:text-emerald-600"
              }`}
            >
              <Home className="w-5 h-5" />
              <span className="text-xs font-medium">Início</span>
            </button>

            <button
              onClick={() => setCurrentScreen("expense")}
              className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all ${
                currentScreen === "expense"
                  ? "text-red-600 bg-red-50"
                  : "text-gray-600 hover:text-red-600"
              }`}
            >
              <TrendingDown className="w-5 h-5" />
              <span className="text-xs font-medium">Gastos</span>
            </button>

            <button
              onClick={() => setCurrentScreen("income")}
              className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all ${
                currentScreen === "income"
                  ? "text-emerald-600 bg-emerald-50"
                  : "text-gray-600 hover:text-emerald-600"
              }`}
            >
              <TrendingUp className="w-5 h-5" />
              <span className="text-xs font-medium">Receitas</span>
            </button>

            <button
              onClick={() => setCurrentScreen("reports")}
              className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all ${
                currentScreen === "reports"
                  ? "text-blue-600 bg-blue-50"
                  : "text-gray-600 hover:text-blue-600"
              }`}
            >
              <PieChart className="w-5 h-5" />
              <span className="text-xs font-medium">Relatórios</span>
            </button>

            <button
              onClick={() => setCurrentScreen("settings")}
              className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all ${
                currentScreen === "settings"
                  ? "text-gray-900 bg-gray-100"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <Settings className="w-5 h-5" />
              <span className="text-xs font-medium">Mais</span>
            </button>
          </div>
        </div>
      </nav>
    </div>
  )
}
