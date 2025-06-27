"use client"

import { useState } from "react"
import { DetalhesBase } from "./detalhes-base"
import { formatCurrency } from "../utils/formatCurrency"
import { usePatrimonio } from "../context/patrimonioContext" // Importar o contexto

export default function DetalhesRendaFixaPublica({ 
  ativo, 
  isVisible, 
  onClose, 
  categoriaTitle,    // Ex: "Renda Fixa Pública" 
  subcategoriaLabel  // Ex: "Tesouro Prefixado"
}) {
  // Acessar o contexto para obter o estado hideValues
  const { hideValues } = usePatrimonio()
  
  const [showDetalhes, setShowDetalhes] = useState(true)
  const [showCondicoes, setShowCondicoes] = useState(true)
  const [showInformacoesPapel, setShowInformacoesPapel] = useState(true)
  const [showMinhaPosicao, setShowMinhaPosicao] = useState(true)
  const [showTaxasPrecos, setShowTaxasPrecos] = useState(true)

  if (!ativo) return null

  // Função para detectar a categoria baseada no ativo
  const detectCategory = () => {
    const indexador = ativo.indexador?.toLowerCase() || ativo.indexer?.toLowerCase() || ''
    const typeName = ativo.typeName?.toLowerCase() || ''
    const issuer = ativo.issuer?.toLowerCase() || ''
    
    // Se é do Tesouro Nacional, é RF Pública
    if (issuer.includes('tesouro') || typeName.includes('ltn') || typeName.includes('lft') || typeName.includes('ntn')) {
      return 'rfPublica'
    }
    // Se é CDB, LCI, LCA, etc. de bancos privados, é RF Privada  
    else if (typeName.includes('cdb') || typeName.includes('lci') || typeName.includes('lca')) {
      return 'rfPrivada'
    }
    // Padrão para RF Pública se não conseguir detectar
    else {
      return 'rfPublica'
    }
  }

  const categoryDetected = detectCategory()

  // Cálculos
  const valorizacao = (ativo.valueUpdated || 0) - (ativo.value || 0)
  const percentualValorizacao = ativo.value > 0 ? (valorizacao / ativo.value) * 100 : 0
  const isPositivo = valorizacao >= 0

  // Data atual
  const dataAtual = new Date()
  const horaFormatada = dataAtual.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  })
  const dataFormatada = dataAtual.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
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
    return hideValues ? "••••••" : `${value.toFixed(2)}%`
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
          Aplicar
        </div>
      </button>
    </div>
  )

  return (
    <DetalhesBase
      isVisible={isVisible}
      onClose={onClose}
      title={ativo.cod || "Renda Fixa"}
      subtitle={ativo.description || ""}
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
                console.log("Atualizando cotação...", ativo.cod)
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
          {formatValue(ativo.valueUpdated || 0)}
        </div>
        <ul className="text-xs text-white-500 p-1">
          <li className="flex justify-between border-b border-neutral-900 p-2">
            <span>Cotação Atual</span>
            <span>{formatValue(ativo.shareValue || 0)}</span>
          </li>
          <li className="flex justify-between p-2">
            <span>Quantidade</span>
            <span>{hideValues ? "••••••" : (ativo.qty || 0).toLocaleString("pt-BR")}</span>
          </li>
        </ul>
      </div>

      {/* Informações do Papel - Accordion */}
      <div className="text-neutral-200 border-b border-t border-neutral-900">
        <button
          onClick={() => setShowInformacoesPapel(!showInformacoesPapel)}
          className={`w-full flex items-center justify-between p-3 bg-neutral-900/50 hover:bg-neutral-900 transition-colors cursor-pointer ${showInformacoesPapel ? 'bg-neutral-900' : ''}`}
        >
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-neutral-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 1v3m5-3v3m5-3v3M1 7h18M5 11h10M2 3h16a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z"></path>
            </svg>
            <h4 className="text-sm font-semibold text-white">
              Informações do Papel
            </h4>
          </div>
          <svg
            className={`w-4 h-4 text-neutral-400 transition-transform ${showInformacoesPapel ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {showInformacoesPapel && (
          <div>
            <div className="border-b border-neutral-800" />
            <div className="relative px-4 py-4">
              <div className="bg-neutral-900/50 rounded-lg border border-neutral-900/90">
                <div className="text-xs">
                  <div className="flex justify-between items-center py-2 px-3 border-b border-neutral-800/30">
                    <span className="text-neutral-400">Código</span>
                    <span className="text-white font-medium">{ativo.cod || "N/A"}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 px-3 border-b border-neutral-800/30">
                    <span className="text-neutral-400">Tipo</span>
                    <span className="text-white font-medium">{ativo.typeName || "N/A"}</span>
                  </div>
                  {ativo.isin && (
                    <div className="flex justify-between items-center py-2 px-3 border-b border-neutral-800/30">
                      <span className="text-neutral-400">ISIN</span>
                      <span className="text-white font-medium">{ativo.isin}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center py-2 px-3 border-b border-neutral-800/30">
                    <span className="text-neutral-400">Indexador</span>
                    <span className="text-white font-medium">{ativo.indexador || ativo.indexer || "N/A"}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 px-3 border-b border-neutral-800/30">
                    <span className="text-neutral-400">Rating</span>
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3].map((star) => (
                        <svg
                          key={`filled-${star}`}
                          xmlns="http://www.w3.org/2000/svg"
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          stroke="currentColor"
                          strokeWidth="1"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-yellow-400"
                        >
                          <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
                        </svg>
                      ))}
                      {[4, 5].map((star) => (
                        <svg
                          key={`empty-${star}`}
                          xmlns="http://www.w3.org/2000/svg"
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-neutral-500"
                        >
                          <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
                        </svg>
                      ))}
                    </div>
                  </div>
                  {ativo.issuer && (
                    <div className="flex justify-between items-center py-2 px-3 border-b border-neutral-800/30">
                      <span className="text-neutral-400">Emissor</span>
                      <span className="text-white font-medium">{ativo.issuer}</span>
                    </div>
                  )}
                  {ativo.expiredDate && (
                    <div className="flex justify-between items-center py-2 px-3 border-b border-neutral-800/30">
                      <span className="text-neutral-400">Vencimento</span>
                      <span className="text-white font-medium">{new Date(ativo.expiredDate).toLocaleDateString("pt-BR")}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center py-2 px-3 border-b border-neutral-800/30">
                    <span className="text-neutral-400">FGC</span>
                    <span className="text-white font-medium">{ativo.fgc ? "Sim" : "Não"}</span>
                  </div>
                  {ativo.earlyRedemption !== undefined && (
                    <div className="flex justify-between items-center py-2 px-3 bg-neutral-900/30">
                      <span className="text-neutral-400 font-medium">Resgate Antecipado</span>
                      <span className="text-white font-bold">{ativo.earlyRedemption ? "Sim" : "Não"}</span>
                    </div>
                  )}
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
                    <span className="text-neutral-400">Valor Aplicado</span>
                    <span className="text-white font-medium">{formatValue(ativo.value || 0)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 px-3 border-b border-neutral-800/30">
                    <span className="text-neutral-400">Valor Atual</span>
                    <span className="text-white font-medium">{formatValue(ativo.valueUpdated || 0)}</span>
                  </div>
                  {(ativo.qty || ativo.blockedQty || ativo.redemptionQty) && (
                    <>
                      <div className="flex justify-between items-center py-2 px-3 border-b border-neutral-800/30">
                        <span className="text-neutral-400">Qtd Total</span>
                        <span className="text-white font-medium">{hideValues ? "••••••" : (ativo.qty || 0).toLocaleString("pt-BR")}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 px-3 border-b border-neutral-800/30">
                        <span className="text-neutral-400">Qtd Bloqueada</span>
                        <span className="text-orange-400 font-medium">{hideValues ? "••••••" : (ativo.blockedQty || 0).toLocaleString("pt-BR")}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 px-3 border-b border-neutral-800/30">
                        <span className="text-neutral-400">Qtd Resgatada</span>
                        <span className="text-red-400 font-medium">{hideValues ? "••••••" : (ativo.redemptionQty || 0).toLocaleString("pt-BR")}</span>
                      </div>
                    </>
                  )}
                  {ativo.shareValue && (
                    <div className="flex justify-between items-center py-2 px-3 border-b border-neutral-800/30">
                      <span className="text-neutral-400">PU Resgate</span>
                      <span className="text-white font-medium">{formatValue(ativo.shareValue)}</span>
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

      {/* Taxas e Preços - Accordion */}
      {(ativo.performanceFeeMin || ativo.performanceFee || ativo.performanceFeeMax || ativo.admin_fee || ativo.shareValueMin || ativo.shareValueMax) && (
        <div className="text-neutral-200 border-b border-neutral-900">
          <button
            onClick={() => setShowTaxasPrecos(!showTaxasPrecos)}
            className={`w-full flex items-center justify-between p-3 bg-neutral-900/50 hover:bg-neutral-900 transition-colors cursor-pointer ${showTaxasPrecos ? 'bg-neutral-900' : ''}`}
          >
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-neutral-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 1v18M1 1h8M1 7h8M1 13h8M9 19V1"></path>
              </svg>
              <h4 className="text-sm font-semibold text-white">
                Taxas e Preços
              </h4>
            </div>
            <svg
              className={`w-4 h-4 text-neutral-400 transition-transform ${showTaxasPrecos ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {showTaxasPrecos && (
            <div>
              <div className="border-b border-neutral-800" />
              <div className="relative px-4 py-4">
                <div className="bg-neutral-900/50 rounded-lg border border-neutral-900/90">
                  <div className="text-xs">
                    {(ativo.performanceFeeMin || ativo.performanceFee || ativo.performanceFeeMax) && (
                      <>
                        <div className="flex justify-between items-center py-2 px-3 border-b border-neutral-800/30">
                          <span className="text-neutral-400">Taxa Aplicação (%)</span>
                          <span className="text-blue-400 font-medium">{formatPercentage(ativo.performanceFeeMin || 0)}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 px-3 border-b border-neutral-800/30">
                          <span className="text-neutral-400">Taxa Resgate (%)</span>
                          <span className="text-orange-400 font-medium">{formatPercentage(ativo.performanceFee || 0)}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 px-3 border-b border-neutral-800/30">
                          <span className="text-neutral-400">Taxa Apl. Máx (%)</span>
                          <span className="text-purple-400 font-medium">{formatPercentage(ativo.performanceFeeMax || 0)}</span>
                        </div>
                      </>
                    )}
                    {ativo.admin_fee && (
                      <div className="flex justify-between items-center py-2 px-3 border-b border-neutral-800/30">
                        <span className="text-neutral-400">Taxa Administração (%)</span>
                        <span className="text-red-400 font-medium">{formatPercentage(ativo.admin_fee)}</span>
                      </div>
                    )}
                    {(ativo.shareValueMin || ativo.shareValueMax) && (
                      <>
                        <div className="flex justify-between items-center py-2 px-3 border-b border-neutral-800/30">
                          <span className="text-neutral-400">PU Aplicação Mín</span>
                          <span className="text-green-400 font-medium">{formatValue(ativo.shareValueMin || 0)}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 px-3 bg-neutral-900/30">
                          <span className="text-neutral-400 font-medium">PU Resgate Máx</span>
                          <span className="text-green-400 font-bold">{formatValue(ativo.shareValueMax || 0)}</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </DetalhesBase>
  )
}