"use client"

import { useState } from "react"
import { DetalhesBase } from "./detalhes-base"
import { formatCurrency } from "../utils/formatCurrency"
import { usePatrimonio } from "../context/patrimonioContext"

export default function DetalhesTesouroDireto({ 
  ativo, 
  isVisible, 
  onClose, 
  categoriaTitle,    // Ex: "Tesouro Direto" 
  subcategoriaLabel  // Ex: "Tesouro IPCA+"
}) {
  // Acessar o contexto para obter o estado hideValues global
  const { hideValues } = usePatrimonio()
  
  // Estado local para controlar visibilidade apenas nesta página
  const [localHideValues, setLocalHideValues] = useState(hideValues)
  
  const [showInformacoesTitulo, setShowInformacoesTitulo] = useState(true)
  const [showMinhaPosicao, setShowMinhaPosicao] = useState(true)
  const [showRentabilidade, setShowRentabilidade] = useState(true)

  if (!ativo) return null

  // Função para detectar a categoria baseada no ativo
  const detectCategory = () => {
    return 'tesouroDireto'
  }

  const categoryDetected = detectCategory()

  // Cálculos de rentabilidade
  const valorAplicado = ativo.value || 0
  const valorAtual = ativo.valorAtual || ativo.netValue || 0
  const rentabilidade = valorAtual - valorAplicado
  const percentualRentabilidade = valorAplicado > 0 ? (rentabilidade / valorAplicado) * 100 : 0
  const isPositivo = rentabilidade >= 0

  // Data atual
  const dataAtual = new Date()
  const horaFormatada = dataAtual.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  })

  // Função para formatar valores com base no estado LOCAL
  const formatValue = (value) => {
    return localHideValues ? "••••••••••" : formatCurrency(value)
  }

  // Função para formatar quantidades
  const formatQuantity = (value) => {
    return localHideValues ? "••••••" : value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })
  }

  // Função para formatar percentuais
  const formatPercentage = (value) => {
    return localHideValues ? "••••••" : `${value.toFixed(2)}%`
  }

  const actionButtons = (
    <div className="flex justify-between gap-3">
      <button
        className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-3 rounded-lg font-bold flex-1 transition-colors uppercase text-sm"
        onClick={() => console.log("Resgatar", ativo)}
      >
        <div className="flex items-center justify-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
          Resgatar
        </div>
      </button>
      <button
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-bold flex-1 transition-colors uppercase text-sm"
        onClick={() => console.log("Investir", ativo)}
      >
        <div className="flex items-center justify-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Investir
        </div>
      </button>
    </div>
  )

  return (
    <DetalhesBase
      isVisible={isVisible}
      onClose={onClose}
      title={ativo.codigo || ativo.securitiesName || "Tesouro Direto"}
      subtitle={ativo.nome || ativo.description || ""}
      actionButtons={actionButtons}
      category={categoryDetected}
      categoriaTitle={categoriaTitle}
      subcategoriaLabel={subcategoriaLabel}
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
                console.log("Atualizando título...", ativo.codigo)
              }}
              className="p-1 hover:bg-neutral-800 rounded transition-colors"
              title="Atualizar título"
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
        
        {/* Valor total com botão de visibilidade local */}
        <div className="flex items-center gap-3 mb-3">
          <div className="text-2xl font-bold text-white">
            {formatValue(valorAtual)}
          </div>
          <button
            className="hover:bg-neutral-700 text-white p-1 rounded transition-colors"
            onClick={() => setLocalHideValues(!localHideValues)}
            title={localHideValues ? "Mostrar valores" : "Ocultar valores"}
          >
            {localHideValues ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                <line x1="2" x2="22" y1="2" y2="22" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            )}
          </button>
        </div>
        
        <ul className="text-xs text-white-500 p-1">
          <li className="flex justify-between items-center border-b border-neutral-900 p-2">
            <span>Preço de Compra</span>
            <div className="flex items-center gap-2">
              {/* Badge com rentabilidade */}
              <div className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium text-green-500">
                {/* Seta indicativa */}
                <svg 
                  className={`w-3 h-3 ${isPositivo ? 'rotate-0' : 'rotate-180'}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
                {/* Porcentagem */}
                <span>
                  {localHideValues ? "••••" : `${isPositivo ? '+' : ''}${percentualRentabilidade.toFixed(2)}%`}
                </span>
              </div>
              {/* Preço em destaque */}
              <div className="gap-1 px-2 py-1 rounded-full bg-green-500/20 text-green-400 border border-green-500/30">
                <span className="font-bold text-white">
                  {formatValue(ativo.buyPrice || 0)}
                </span>
              </div>
            </div>
          </li>
          <li className="flex justify-between p-2">
            <span>Quantidade</span>
            <span>{localHideValues ? "••••••" : (ativo.quantidade || ativo.currentBalance || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
          </li>
        </ul>
      </div>

      {/* Informações do Título - Accordion */}
      <div className="text-neutral-200 border-b border-t border-neutral-900">
        <button
          onClick={() => setShowInformacoesTitulo(!showInformacoesTitulo)}
          className={`w-full flex items-center justify-between p-3 bg-neutral-900/50 hover:bg-neutral-900 transition-colors cursor-pointer ${showInformacoesTitulo ? 'bg-neutral-900' : ''}`}
        >
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-neutral-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 1v3m5-3v3m5-3v3M1 7h18M5 11h10M2 3h16a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z"></path>
            </svg>
            <h4 className="text-sm font-semibold text-white">
              Informações do Título
            </h4>
          </div>
          <svg
            className={`w-4 h-4 text-neutral-400 transition-transform ${showInformacoesTitulo ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {showInformacoesTitulo && (
          <div>
            <div className="border-b border-neutral-800" />
            <div className="relative px-4 py-4">
              <div className="bg-neutral-900/50 rounded-lg border border-neutral-900/90">
                <div className="text-xs">
                  <div className="flex justify-between items-center py-2 px-3 border-b border-neutral-800/30">
                    <span className="text-neutral-400">Código</span>
                    <span className="text-white font-medium">{ativo.codigo || "N/A"}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 px-3 border-b border-neutral-800/30">
                    <span className="text-neutral-400">Tipo</span>
                    <span className="text-white font-medium">{ativo.typeName || "N/A"}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 px-3 border-b border-neutral-800/30">
                    <span className="text-neutral-400">Tipo Descrição</span>
                    <span className="text-white font-medium">{ativo.description || "N/A"}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 px-3 border-b border-neutral-800/30">
                    <span className="text-neutral-400">Título</span>
                    <span className="text-white font-medium">{ativo.securitiesName || "N/A"}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 px-3 border-b border-neutral-800/30">
                    <span className="text-neutral-400">Vencimento</span>
                    <span className="text-white font-medium">
                      {ativo.dueDate ? new Date(ativo.dueDate).toLocaleDateString("pt-BR") : "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 px-3 bg-neutral-900/30">
                    <span className="text-neutral-400 font-medium">Preço de Compra</span>
                    <span className="text-white font-bold">{formatValue(ativo.buyPrice || 0)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Minha Posição - Accordion */}
      <div className="text-neutral-200 border-b border-neutral-900">
        <button
          onClick={() => setShowMinhaPosicao(!showMinhaPosicao)}
          className={`w-full flex items-center justify-between p-3 bg-neutral-900/50 hover:bg-neutral-900 transition-colors cursor-pointer ${showMinhaPosicao ? 'bg-neutral-900' : ''}`}
        >
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-neutral-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8M3 8l1-4h12l1 4M3 8h14m-9 4h4"></path>
            </svg>
            <h4 className="text-sm font-semibold text-white">
              Minha Posição
            </h4>
          </div>
          <svg
            className={`w-4 h-4 text-neutral-400 transition-transform ${showMinhaPosicao ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {showMinhaPosicao && (
          <div>
            <div className="border-b border-neutral-800" />
            <div className="relative px-4 py-4">
              <div className="bg-neutral-900/50 rounded-lg border border-neutral-900/90">
                <div className="text-xs">
                  <div className="flex justify-between items-center py-2 px-3 border-b border-neutral-800/30">
                    <span className="text-neutral-400">Quantidade Total</span>
                    <span className="text-white font-medium">
                      {formatQuantity(ativo.currentBalance || 0)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 px-3 border-b border-neutral-800/30">
                    <span className="text-neutral-400">Valor Aplicado</span>
                    <span className="text-white font-medium">{formatValue(ativo.value || 0)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 px-3 border-b border-neutral-800/30">
                    <span className="text-neutral-400">Valor Atual</span>
                    <span className="text-white font-medium">{formatValue(ativo.netValue || 0)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 px-3 border-b border-neutral-800/30">
                    <span className="text-neutral-400">Rentabilidade</span>
                    <span className={`font-medium ${isPositivo ? 'text-green-400' : 'text-red-400'}`}>
                      {formatValue(rentabilidade)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 px-3 bg-neutral-900/30">
                    <span className="text-neutral-400 font-medium">Rentabilidade (%)</span>
                    <span className={`font-bold ${isPositivo ? 'text-green-400' : 'text-red-400'}`}>
                      {localHideValues ? "••••••" : `${isPositivo ? '+' : ''}${percentualRentabilidade.toFixed(2)}%`}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Rentabilidade - Accordion */}
      <div className="text-neutral-200 border-b border-neutral-900">
        <button
          onClick={() => setShowRentabilidade(!showRentabilidade)}
          className={`w-full flex items-center justify-between p-3 bg-neutral-900/50 hover:bg-neutral-900 transition-colors cursor-pointer ${showRentabilidade ? 'bg-neutral-900' : ''}`}
        >
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-neutral-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l4-4 4 4 5-5m0 0h-3.5M16 3v3.5"></path>
            </svg>
            <h4 className="text-sm font-semibold text-white">
              Rentabilidade
            </h4>
          </div>
          <svg
            className={`w-4 h-4 text-neutral-400 transition-transform ${showRentabilidade ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {showRentabilidade && (
          <div>
            <div className="border-b border-neutral-800" />
            <div className="relative px-4 py-4">
              <div className="bg-neutral-900/50 rounded-lg border border-neutral-900/90">
                <div className="text-xs">
                  <div className="flex justify-between items-center py-2 px-3 border-b border-neutral-800/30">
                    <span className="text-neutral-400">Rentabilidade no Mês</span>
                    <span className="text-white font-medium">{formatPercentage(ativo.monthProfitability || 0)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 px-3 border-b border-neutral-800/30">
                    <span className="text-neutral-400">Rentabilidade no Ano</span>
                    <span className="text-white font-medium">{formatPercentage(ativo.yearProfitability || 0)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 px-3 border-b border-neutral-800/30">
                    <span className="text-neutral-400">Rentabilidade 12 Meses</span>
                    <span className="text-white font-medium">{formatPercentage(ativo.last12monthsProfitability || 0)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 px-3 bg-neutral-900/30">
                    <span className="text-neutral-400 font-medium">Rentabilidade Acumulada</span>
                    <span className="text-white font-bold">{formatPercentage(ativo.accumulatedProfitability || 0)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DetalhesBase>
  )
}