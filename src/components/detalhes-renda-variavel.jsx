"use client"

import { useState } from "react"
import { DetalhesBase } from "./detalhes-base"
import { formatCurrency } from "../utils/formatCurrency"
import { usePatrimonio } from "../context/patrimonioContext" // Importar o contexto

export default function DetalhesRendaVariavel({ ativo, codigo, isVisible, onClose }) {
  // Acessar o contexto para obter o estado hideValues
  const { hideValues } = usePatrimonio()

  // Inicializar todos os itens como abertos
  const [openItems, setOpenItems] = useState(() => {
    const initialState = {}
    // Se já temos os dados do timeline, inicializar todos como abertos
    const timelineData = [
      ...(ativo.proventosProvisionados || []).map(item => ({ ...item, type: 'provisionado' })),
      ...(ativo.proventosPagos || []).map(item => ({ ...item, type: 'pago' })),
    ].sort((a, b) => new Date(b.paymentDate) - new Date(a.paymentDate))

    timelineData.forEach((_, idx) => {
      initialState[idx] = true // true = aberto
    })

    return initialState
  })

  if (!ativo) return null

  // Dados principais
  const valorAtual = ativo.valorAtual || 0
  const quantidade = ativo.quantidade || 0
  const dataAtual = new Date()
  const horaFormatada = dataAtual.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  })

  // Timeline unificada de proventos
  const timeline = [
    ...(ativo.proventosProvisionados || []).map(item => ({ ...item, type: 'provisionado' })),
    ...(ativo.proventosPagos || []).map(item => ({ ...item, type: 'pago' })),
  ].sort((a, b) => new Date(b.paymentDate) - new Date(a.paymentDate))

  const toggleItem = id =>
    setOpenItems(prev => ({ ...prev, [id]: !prev[id] }))

  // Função para formatar valores com base no hideValues
  const formatValue = (value) => {
    return hideValues ? "••••••" : formatCurrency(value)
  }

  // Botões de ação originais
  const actionButtons = (
    <div className="flex justify-between gap-3">
      <button
        className="bg-red-700 hover:bg-red-800 text-white px-4 py-3 rounded-lg font-bold flex-1 transition-colors uppercase text-sm"
        onClick={() => console.log("Vender", codigo)}
      >
        <div className="flex items-center justify-center gap-2">
          {/* ícone de venda */}
          <svg className="w-3 h-3 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 14">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13V1m0 0L1 5m4-4 4 4"></path>
          </svg>
          Vender
        </div>
      </button>
      <button
        className="bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg font-bold flex-1 transition-colors uppercase text-sm"
        onClick={() => console.log("Comprar", codigo)}
      >
        <div className="flex items-center justify-center gap-2">
          {/* ícone de compra */}
          <svg className="w-3 h-3 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 14">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 1v12m0 0 4-4m-4 4L1 9"></path>
          </svg>
          Comprar
        </div>
      </button>
    </div>
  )

  return (
    <DetalhesBase
      isVisible={isVisible}
      onClose={onClose}
      title={codigo || "Ação"}
      subtitle={ativo.nome}
      actionButtons={actionButtons}
      category="rendaVariavel"
      categoriaTitle="Renda Variável"
      subcategoriaLabel="Ações"
    >
      {/* Meu Investimento */}
      <div className="p-3">
        <div className="flex justify-between items-center mb-1">
          <h4 className="text-sm font-semibold text-neutral-400 uppercase">
            Meu Investimento
          </h4>
          <div className="flex items-center gap-2">
            <div className="text-xs text-neutral-500">
              Últ. Atualização: {horaFormatada}
            </div>
            <button
              onClick={() => {
                console.log("Atualizando cotação...", codigo)
                // Aqui você pode chamar a função de atualização
              }}
              className="p-1 hover:bg-neutral-800 rounded transition-colors"
              title="Atualizar cotação"
            >
              <svg
                className="w-4 h-4 text-neutral-400 hover:text-white transition-colors"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </button>
          </div>
        </div>
        <div className="text-2xl font-bold text-white mb-3">
          {formatValue(valorAtual)}
        </div>
        <ul className="text-xs text-white-500 p-1">
          <li className="flex justify-between border-b border-neutral-900 p-2">
            <span>Cotação Atual</span>
            <span>{formatValue(ativo.cotacaoAtual || 0)}</span>
          </li>
          <li className="flex justify-between border-b border-neutral-900 p-2">
            <span>Quantidade</span>
            <span>{hideValues ? "••••••" : quantidade}</span>
          </li>
          <li className="flex justify-between p-2">
            <span>Valor Total</span>
            <span>{formatValue(valorAtual)}</span>
          </li>
        </ul>
      </div>

      {/* Histórico de Proventos */}
      {timeline.length > 0 ? (
        <div className="text-neutral-200 border-b border-t border-neutral-900">
          <div className="flex items-center justify-between p-3 bg-neutral-900/50 hover:bg-neutral-900 transition-colors">
            <div className="flex items-center gap-2">
              {/* ícone de calendário */}
              <svg className="w-4 h-4 text-neutral-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 1v3m5-3v3m5-3v3M1 7h18M5 11h10M2 3h16a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z"></path>
              </svg>
              <h4 className="text-sm font-semibold text-white">
                Histórico de Proventos
              </h4>
            </div>
            <select className="bg-neutral-900 text-white text-xs border border-neutral-900 rounded px-2 py-1 focus:outline-none focus:border-orange-400">
              <option value="diario">Diário</option>
              <option value="semanal">Semanal</option>
              <option value="mensal">Mensal</option>
              <option value="anual">Anual</option>
            </select>
          </div>
          <div className="border-b border-neutral-800" />

          <div className="relative px-4 py-4">
            {timeline.map((item, idx) => (
              <div key={idx} className="flex items-start mb-4 last:mb-0">
                {/* Timeline indicator melhorado */}
                <div className="relative flex flex-col items-center mr-4 mt-1">
                  <div className="relative">
                    <div className="w-4 h-4 rounded-full bg-gradient-to-r from-orange-400 to-orange-500 shadow-lg shadow-orange-400/30 ring-4 ring-neutral-900 ring-opacity-50" />
                    {item.type === 'pago' && (
                      <div className="absolute inset-0 w-4 h-4 rounded-full bg-orange-400 animate-ping opacity-20" />
                    )}
                  </div>
                  {idx < timeline.length - 1 && (
                    <div className="absolute top-6 w-0.5 h-16 bg-gradient-to-b from-orange-400 to-transparent opacity-60" />
                  )}
                </div>

                {/* Content card melhorado */}
                <div className="flex-1 rounded-xl border border-neutral-900 shadow-xl hover:shadow-2xl transition-all duration-300">
                  {/* Header - clickable */}
                  <div
                    className={`flex justify-between items-start p-4 cursor-pointer select-none transition-all duration-200 hover:bg-black/50 rounded-t-xl ${openItems[idx] ? 'bg-black/50' : ''
                      }`}
                    onClick={() => toggleItem(idx)}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="text-xs text-neutral-300">
                          {new Date(item.paymentDate).toLocaleDateString("pt-BR", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "2-digit"
                          })}
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${item.type === 'pago'
                          ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30'
                          : 'bg-neutral-700/20 text-neutral-300 border border-neutral-700/30'
                          }`}>
                          {item.type === 'pago' ? 'Pago' : 'Provisionado'}
                        </span>
                      </div>
                      <div className="text-sm text-white font-medium mb-1">
                        {item.dist || item.bonusDescription}
                      </div>
                      <div className="text-xs text-neutral-400">
                        {hideValues ? "••••••" : `${item.qty} cotas`}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-sm text-green-400 font-bold">
                          {formatValue(item.value || 0)}
                        </div>
                        <div className="text-xs text-neutral-400">
                          valor líquido
                        </div>
                      </div>

                      <div className="ml-2 p-1 rounded-full hover:bg-neutral-900 transition-colors duration-200">
                        <svg
                          className={`w-5 h-5 text-neutral-400 transition-transform duration-200 ${openItems[idx] ? 'rotate-90' : ''
                            }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Expandable details como extrato */}
                  <div className={`overflow-hidden transition-all duration-300 ease-in-out ${openItems[idx] ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                    }`}>
                    <div className="px-4 pb-4 border-t border-neutral-800/50">
                      <div className="mt-3 bg-neutral-900/50 rounded-lg border border-neutral-900/90">
                        <div className="text-xs">
                          <div className="flex justify-between items-center py-2 px-3 border-b border-neutral-800/30">
                            <span className="text-neutral-400">Quantidade</span>
                            <span className="text-white font-medium">{hideValues ? "••••••" : item.qty}</span>
                          </div>
                          <div className="flex justify-between items-center py-2 px-3 border-b border-neutral-800/30">
                            <span className="text-neutral-400">Valor Bruto</span>
                            <span className="text-white font-medium">{formatValue(item.inclusiveValue)}</span>
                          </div>
                          <div className="flex justify-between items-center py-2 px-3 border-b border-neutral-800/30">
                            <span className="text-neutral-400">IR Retido</span>
                            <span className="text-red-400 font-medium">{hideValues ? "••••••" : `-${formatCurrency(item.ir)}`}</span>
                          </div>
                          <div className="flex justify-between items-center py-2 px-3 bg-neutral-900/30">
                            <span className="text-neutral-400 font-medium">Valor Líquido</span>
                            <span className="text-green-400 font-bold">{formatValue(item.value)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-neutral-200 border-b border-t border-neutral-900">
          <div className="flex items-center justify-between p-3 bg-neutral-900/50">
            <div className="flex items-center gap-2">
              {/* ícone de calendário */}
              <svg className="w-4 h-4 text-neutral-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 1v3m5-3v3m5-3v3M1 7h18M5 11h10M2 3h16a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z"></path>
              </svg>
              <h4 className="text-sm font-semibold text-white">
                Histórico de Proventos
              </h4>
            </div>
          </div>
          <div className="border-b border-neutral-800" />
          <div className="px-4 py-8 text-center">
            <div className="flex flex-col items-center gap-3">
              <svg className="w-12 h-12 text-neutral-500 mt-0" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M18.364 5.636a9 9 0 1 1-12.728 0M12 8v8m-4-4h8" />
              </svg>
              <p className="text-neutral-400 text-sm">Este ativo não gerou proventos</p>
            </div>
          </div>
        </div>
      )}
    </DetalhesBase>
  )
}