"use client"

import { ArrowLeft, Tag, Target, DollarSign, Clock, Info } from "lucide-react"

interface SettingsScreenProps {
  onBack: () => void
}

export default function SettingsScreen({ onBack }: SettingsScreenProps) {
  const handleClearData = () => {
    if (confirm("Deseja realmente limpar todos os dados? Esta ação não pode ser desfeita.")) {
      localStorage.clear()
      alert("Dados limpos com sucesso! A página será recarregada.")
      window.location.reload()
    }
  }

  const menuItems = [
    {
      icon: Tag,
      title: "Categorias",
      description: "Gerencie suas categorias",
      color: "purple",
      action: () => {},
    },
    {
      icon: DollarSign,
      title: "Orçamentos",
      description: "Configure seus limites",
      color: "blue",
      action: () => {},
    },
    {
      icon: Target,
      title: "Metas",
      description: "Acompanhe seus objetivos",
      color: "pink",
      action: () => {},
    },
    {
      icon: Clock,
      title: "Histórico",
      description: "Veja todas as transações",
      color: "indigo",
      action: () => {},
    },
  ]

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-br from-gray-800 to-gray-700 text-white px-6 pt-8 pb-6 rounded-b-3xl shadow-xl">
        <div className="max-w-md mx-auto">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-white/90 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-medium">Voltar</span>
          </button>
          <h1 className="text-2xl font-bold">Configurações</h1>
          <p className="text-gray-300 text-sm mt-1">Personalize seu app</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-md mx-auto px-6 py-6 space-y-6">
        {/* App Info */}
        <div className="bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <span className="text-2xl">💰</span>
            </div>
            <div>
              <h2 className="text-xl font-bold">Finanças Pessoais</h2>
              <p className="text-sm text-emerald-100">Controle total do seu dinheiro</p>
            </div>
          </div>
          <p className="text-sm text-emerald-50 leading-relaxed">
            Gerencie suas receitas, despesas, orçamentos e metas de forma simples e eficiente.
          </p>
        </div>

        {/* Quick Access */}
        <div>
          <h3 className="text-lg font-bold text-gray-800 mb-3">Acesso Rápido</h3>
          <div className="grid grid-cols-2 gap-3">
            {menuItems.map((item, index) => {
              const Icon = item.icon
              const colorClasses = {
                purple: "bg-purple-100 text-purple-600",
                blue: "bg-blue-100 text-blue-600",
                pink: "bg-pink-100 text-pink-600",
                indigo: "bg-indigo-100 text-indigo-600",
              }[item.color]

              return (
                <button
                  key={index}
                  onClick={item.action}
                  className="bg-white rounded-xl p-4 shadow-md border border-gray-100 hover:shadow-lg transition-all hover:scale-105 active:scale-95 text-left"
                >
                  <div className={`w-10 h-10 ${colorClasses} rounded-full flex items-center justify-center mb-3`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <p className="text-sm font-semibold text-gray-800">{item.title}</p>
                  <p className="text-xs text-gray-500 mt-1">{item.description}</p>
                </button>
              )
            })}
          </div>
        </div>

        {/* About */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <Info className="w-5 h-5 text-gray-600" />
            <h3 className="text-lg font-bold text-gray-800">Sobre o App</h3>
          </div>
          <div className="space-y-3 text-sm text-gray-600">
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span>Versão</span>
              <span className="font-semibold text-gray-800">1.0.0</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span>Armazenamento</span>
              <span className="font-semibold text-gray-800">Local Storage</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span>Desenvolvido para</span>
              <span className="font-semibold text-gray-800">Público Brasileiro</span>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Funcionalidades</h3>
          <div className="space-y-3">
            {[
              "✅ Registro de receitas e despesas",
              "✅ Categorias personalizáveis",
              "✅ Orçamentos mensais",
              "✅ Metas financeiras",
              "✅ Relatórios detalhados",
              "✅ Histórico completo",
              "✅ Interface responsiva",
              "✅ Dados salvos localmente",
            ].map((feature, index) => (
              <div key={index} className="flex items-center gap-3 text-sm text-gray-700">
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Data Management */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Gerenciar Dados</h3>
          <p className="text-sm text-gray-600 mb-4">
            Seus dados são armazenados localmente no seu navegador. Você pode limpar todos os dados a qualquer momento.
          </p>
          <button
            onClick={handleClearData}
            className="w-full bg-red-600 text-white py-3 rounded-xl font-bold hover:bg-red-700 transition-colors shadow-md hover:shadow-lg"
          >
            Limpar Todos os Dados
          </button>
        </div>

        {/* Footer */}
        <div className="text-center py-6">
          <p className="text-sm text-gray-500">
            Feito com ❤️ para o público brasileiro
          </p>
          <p className="text-xs text-gray-400 mt-2">
            © 2024 Finanças Pessoais. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </div>
  )
}
