import { PeriodType } from '@shared/types'
import Link from 'next/link'

export default function Home() {
  const period: PeriodType = 'all'
  
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Sistema de Contabilidade</h1>
          <p className="text-gray-600">Gerencie suas finanças com eficiência</p>
          <div className="mt-4 text-sm text-gray-500">
            Período atual: <span className="font-medium">{period}</span>
          </div>
        </div>

        {/* Cards de Acesso Rápido */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Dashboard</h3>
            <p className="text-gray-600 mb-4">Visão geral das finanças</p>
            <Link 
              href="/dashboard" 
              className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
            >
              Acessar
            </Link>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Clientes</h3>
            <p className="text-gray-600 mb-4">Gerenciar dados dos clientes</p>
            <Link 
              href="/clientes" 
              className="inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
            >
              Ver Clientes
            </Link>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Relatórios</h3>
            <p className="text-gray-600 mb-4">Análises e relatórios financeiros</p>
            <Link 
              href="/relatorios" 
              className="inline-block bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition-colors"
            >
              Ver Relatórios
            </Link>
          </div>
        </div>

        {/* Estatísticas Rápidas */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Resumo do Sistema</h2>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">0</div>
              <div className="text-sm text-gray-600">Clientes Ativos</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">R$ 0,00</div>
              <div className="text-sm text-gray-600">Receitas</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">R$ 0,00</div>
              <div className="text-sm text-gray-600">Despesas</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">0</div>
              <div className="text-sm text-gray-600">Relatórios</div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}