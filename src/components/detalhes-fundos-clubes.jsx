"use client"

import { useState } from "react"
import { DetalhesBase } from "./detalhes-base"
import { formatCurrency } from "../utils/formatCurrency"
import { usePatrimonio } from "../context/patrimonioContext" // Importar o contexto

export default function DetalhesFundosClubes({ 
  ativo, 
  isVisible, 
  onClose, 
  categoriaTitle,    // Ex: "Fundos" 
  subcategoriaLabel  // Ex: "Ações"
}) {
  // Acessar o contexto para obter o estado hideValues
  const { hideValues } = usePatrimonio()
  
  const [showInformacoesFundo, setShowInformacoesFundo] = useState(true)
  const [showPerformance, setShowPerformance] = useState(true)
  const [showMinhaPosicao, setShowMinhaPosicao] = useState(true)

  if (!ativo) return null

  // Função para detectar a categoria baseada no ativo
  const detectCategory = () => {
    return 'fundos'
  }

  const categoryDetected = detectCategory()

  // Data atual
  const dataAtual = new Date()
  const horaFormatada = dataAtual.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  })

  // Função para formatar valores com base no hideValues
  const formatValue = (value) => {
    return hideValues ? "••••••" : formatCurrency(value)
  }

  // Função para formatar quantidades
  const formatQuantity = (value) => {
    return hideValues ? "••••••" : value.toLocaleString("pt-BR")
  }

  // Função para formatar percentuais
  const formatPercentage = (value) => {
    return hideValues ? "••••••" : `${value}%`
  }

  const actionButtons = (
    <div className="flex justify-between gap-3">
      <button
        className="bg-orange-500 hover:bg-red-600 text-white px-4 py-3 rounded-lg font-bold flex-1 transition-colors uppercase text-sm"
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
        className="bg-blue-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg font-bold flex-1 transition-colors uppercase text-sm"
        onClick={() => console.log("Aplicar", ativo)}
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
          Aplicar
        </div>
      </button>
    </div>
  )

  return (
    <DetalhesBase
      isVisible={isVisible}
      onClose={onClose}
      title={ativo.codigo || "Fundo"}
      subtitle={ativo.nome || ativo.bond || ativo.description || ""}
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
          <div className="text-xs text-neutral-500">
            Últ. Atualização: {horaFormatada}
          </div>
        </div>
        <div className="text-2xl font-bold text-white mb-3">
          {formatValue(ativo.valorAtual || ativo.valueTotal || 0)}
        </div>
        <ul className="text-xs text-white-500 p-1">
          <li className="flex justify-between border-b border-neutral-900 p-2">
            <span>Valor da Cota</span>
            <span>{formatValue(ativo.quoteValue || 0)}</span>
          </li>
          <li className="flex justify-between p-2">
            <span>Quantidade de Cotas</span>
            <span>{hideValues ? "••••••" : (ativo.qtyQuote || 0).toLocaleString("pt-BR")}</span>
          </li>
        </ul>
      </div>

      {/* Informações do Fundo/Clube - Accordion */}
      <div className="text-neutral-200 border-b border-t border-neutral-900">
        <button
          onClick={() => setShowInformacoesFundo(!showInformacoesFundo)}
          className={`w-full flex items-center justify-between p-3 bg-neutral-900/50 hover:bg-neutral-900 transition-colors cursor-pointer ${showInformacoesFundo ? 'bg-neutral-900' : ''}`}
        >
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-neutral-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 1v3m5-3v3m5-3v3M1 7h18M5 11h10M2 3h16a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z"></path>
            </svg>
            <h4 className="text-sm font-semibold text-white">
              Informações do Fundo/Clube
            </h4>
          </div>
          <svg
            className={`w-4 h-4 text-neutral-400 transition-transform ${showInformacoesFundo ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {showInformacoesFundo && (
          <div>
            <div className="border-b border-neutral-800" />
            <div className="relative px-4 py-4">
              <div className="bg-neutral-900/50 rounded-lg border border-neutral-900/90">
                <div className="text-xs">
                  <div className="flex justify-between items-center py-2 px-3 border-b border-neutral-800/30">
                    <span className="text-neutral-400">Fundo</span>
                    <span className="text-white font-medium">{ativo.bond || "N/A"}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 px-3 border-b border-neutral-800/30">
                    <span className="text-neutral-400">Descrição</span>
                    <span className="text-white font-medium">{ativo.description || "N/A"}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 px-3 border-b border-neutral-800/30">
                    <span className="text-neutral-400">Classificação</span>
                    <span className="text-white font-medium">{ativo.classification || "N/A"}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 px-3 border-b border-neutral-800/30">
                    <span className="text-neutral-400">Categoria</span>
                    <span className="text-white font-medium">{ativo.category || "N/A"}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 px-3 border-b border-neutral-800/30">
                    <span className="text-neutral-400">Estratégia</span>
                    <span className="text-white font-medium">{ativo.strategy || ativo.estrategia || "N/A"}</span>
                  </div>
                  {ativo.idRegulator && (
                    <div className="flex justify-between items-center py-2 px-3 border-b border-neutral-800/30">
                      <span className="text-neutral-400">Código ANBIMA</span>
                      <span className="text-white font-medium">{ativo.idRegulator}</span>
                    </div>
                  )}
                  {ativo.isin && (
                    <div className="flex justify-between items-center py-2 px-3 border-b border-neutral-800/30">
                      <span className="text-neutral-400">ISIN</span>
                      <span className="text-white font-medium">{ativo.isin}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center py-2 px-3 border-b border-neutral-800/30">
                    <span className="text-neutral-400">Gestor</span>
                    <span className="text-white font-medium">{ativo.manager || ativo.gestora || "N/A"}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 px-3 border-b border-neutral-800/30">
                    <span className="text-neutral-400">Administrador</span>
                    <span className="text-white font-medium">{ativo.administrator || "N/A"}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 px-3 border-b border-neutral-800/30">
                    <span className="text-neutral-400">Valor da Cota</span>
                    <span className="text-white font-medium">{formatValue(ativo.quoteValue || 0)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 px-3 border-b border-neutral-800/30">
                    <span className="text-neutral-400">Data da Cota</span>
                    <span className="text-white font-medium">{ativo.quoteValueDate || "N/A"}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 px-3 border-b border-neutral-800/30">
                    <span className="text-neutral-400">Taxa Adm (%)</span>
                    <span className="text-white font-medium">{hideValues ? "••••••" : `${ativo.adminFee || ativo.taxaAdministracao || "N/A"}%`}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 px-3 border-b border-neutral-800/30">
                    <span className="text-neutral-400">Benchmark</span>
                    <span className="text-white font-medium">{ativo.benchmark || "N/A"}</span>
                  </div>
                  {ativo.discountQuote !== undefined && (
                    <div className="flex justify-between items-center py-2 px-3 border-b border-neutral-800/30">
                      <span className="text-neutral-400">Come Cotas</span>
                      <span className="text-white font-medium">{ativo.discountQuote ? "Sim" : "Não"}</span>
                    </div>
                  )}
                  {ativo.investmentQuote && (
                    <div className="flex justify-between items-center py-2 px-3 border-b border-neutral-800/30">
                      <span className="text-neutral-400">Info Investimento</span>
                      <span className="text-white font-medium">{ativo.investmentQuote}</span>
                    </div>
                  )}
                  {ativo.redemptionQuote && (
                    <div className="flex justify-between items-center py-2 px-3 border-b border-neutral-800/30">
                      <span className="text-neutral-400">Info Resgate</span>
                      <span className="text-white font-medium">{ativo.redemptionQuote}</span>
                    </div>
                  )}
                  {ativo.levelRisk !== undefined && (
                    <div className="flex justify-between items-center py-2 px-3 border-b border-neutral-800/30">
                      <span className="text-neutral-400">Grau de Risco</span>
                      <span className="text-white font-medium">{ativo.levelRisk}</span>
                    </div>
                  )}
                  {ativo.profileRisk && (
                    <div className="flex justify-between items-center py-2 px-3 bg-neutral-900/30">
                      <span className="text-neutral-400 font-medium">Perfil de Risco</span>
                      <span className="text-white font-bold">{ativo.profileRisk}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Performance - Accordion */}
      <div className="text-neutral-200 border-b border-neutral-900">
        <button
          onClick={() => setShowPerformance(!showPerformance)}
          className={`w-full flex items-center justify-between p-3 bg-neutral-900/50 hover:bg-neutral-900 transition-colors cursor-pointer ${showPerformance ? 'bg-neutral-900' : ''}`}
        >
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-neutral-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l4-4 4 4 5-5m0 0h-3.5M16 3v3.5"></path>
            </svg>
            <h4 className="text-sm font-semibold text-white">
              Performance
            </h4>
          </div>
          <svg
            className={`w-4 h-4 text-neutral-400 transition-transform ${showPerformance ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {showPerformance && (
          <div>
            <div className="border-b border-neutral-800" />
            <div className="relative px-4 py-4">
              <div className="bg-neutral-900/50 rounded-lg border border-neutral-900/90">
                <div className="text-xs">
                  <div className="flex justify-between items-center py-2 px-3 border-b border-neutral-800/30">
                    <span className="text-neutral-400">Performance no Mês</span>
                    <span className="text-white font-medium">{formatPercentage(ativo.performance_month || ativo.rentabilidadeMes || 0)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 px-3 border-b border-neutral-800/30">
                    <span className="text-neutral-400">Performance no Ano</span>
                    <span className="text-white font-medium">{formatPercentage(ativo.performance_year || ativo.rentabilidadeAnual || 0)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 px-3 bg-neutral-900/30">
                    <span className="text-neutral-400 font-medium">Performance 12 Meses</span>
                    <span className="text-white font-bold">{formatPercentage(ativo.performance_last12m || 0)}</span>
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
                    <span className="text-neutral-400">Qtd Cotas</span>
                    <span className="text-white font-medium">{hideValues ? "••••••" : (ativo.qtyQuote || 0).toLocaleString("pt-BR")}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 px-3 border-b border-neutral-800/30">
                    <span className="text-neutral-400">Valor Investido</span>
                    <span className="text-white font-medium">{formatValue(ativo.valueInvested || 0)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 px-3 border-b border-neutral-800/30">
                    <span className="text-neutral-400">Valor Total</span>
                    <span className="text-white font-medium">{formatValue(ativo.valueTotal || 0)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 px-3 border-b border-neutral-800/30">
                    <span className="text-neutral-400">Valor Líquido</span>
                    <span className="text-white font-medium">{formatValue(ativo.valueNet || 0)}</span>
                  </div>
                  {ativo.valueRedemption !== undefined && (
                    <div className="flex justify-between items-center py-2 px-3 border-b border-neutral-800/30">
                      <span className="text-neutral-400">Valor Resgatado</span>
                      <span className="text-red-400 font-medium">{formatValue(ativo.valueRedemption || 0)}</span>
                    </div>
                  )}
                  {(ativo.valueInvestedToday || ativo.valueRedemptionToday) && (
                    <>
                      <div className="flex justify-between items-center py-2 px-3 border-b border-neutral-800/30">
                        <span className="text-neutral-400">Aplicado Hoje</span>
                        <span className="text-green-400 font-medium">{hideValues ? "••••••" : `+${formatCurrency(ativo.valueInvestedToday || 0)}`}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 px-3 bg-neutral-900/30">
                        <span className="text-neutral-400 font-medium">Resgatado Hoje</span>
                        <span className="text-red-400 font-bold">{hideValues ? "••••••" : `-${formatCurrency(ativo.valueRedemptionToday || 0)}`}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DetalhesBase>
  )
}