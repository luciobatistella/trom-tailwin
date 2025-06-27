"use client"

import { useState } from "react"
import { DetalhesBase } from "./detalhes-base"
import { formatCurrency } from "../utils/formatCurrency"
import { usePatrimonio } from "../context/patrimonioContext" // Importar o contexto

export default function DetalhesFinanceiro({ 
  ativo, 
  isVisible, 
  onClose, 
  categoriaTitle = "Financeiro",
  subcategoriaLabel = "Conta Corrente"
}) {
  // Acessar o contexto para obter o estado hideValues
  const { hideValues } = usePatrimonio()
  
  const [showDetalhesMovimentacao, setShowDetalhesMovimentacao] = useState(true)
  const [showInformacoesConta, setShowInformacoesConta] = useState(true)
  const [showInformacoesOperacao, setShowInformacoesOperacao] = useState(true)

  if (!ativo) return null

  // Função para detectar a categoria baseada no ativo
  const detectCategory = () => {
    return 'financeiro'
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

  // Função para determinar o tipo de movimentação e cor
  const getTipoMovimentacao = () => {
    if (ativo.tipoMovimentacao) return ativo.tipoMovimentacao
    if (ativo.valorAtual > 0) return "Entrada"
    return "Saída"
  }

  // Função para determinar a cor baseada no tipo
  const getCorPorTipo = () => {
    const tipo = getTipoMovimentacao().toLowerCase()
    if (tipo.includes('dividendo') || tipo.includes('jcp')) return 'text-orange-400'
    if (tipo.includes('rendimento')) return 'text-purple-400'
    if (tipo.includes('entrada') || tipo.includes('depósito') || tipo.includes('pix') && ativo.valorAtual > 0) return 'text-green-400'
    if (tipo.includes('saída') || tipo.includes('saque') || tipo.includes('pagamento') || tipo.includes('taxa')) return 'text-red-400'
    if (tipo.includes('resgate')) return 'text-blue-400'
    return 'text-white'
  }

  const actionButtons = (
    <div className="flex justify-between gap-3">
      <button
        className="bg-red-500 hover:bg-red-600 text-white px-4 py-3 rounded-lg font-bold flex-1 transition-colors uppercase text-sm"
        onClick={() => console.log("Sacar", ativo)}
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
          Sacar
        </div>
      </button>
      <button
        className="bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg font-bold flex-1 transition-colors uppercase text-sm"
        onClick={() => console.log("Depositar", ativo)}
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
          Depositar
        </div>
      </button>
    </div>
  )

  return (
    <DetalhesBase
      isVisible={isVisible}
      onClose={onClose}
      title={ativo.nome || ativo.codigo || "Movimentação Financeira"}
      subtitle={ativo.descricao || "Saldo em Conta"}
      actionButtons={actionButtons}
      category={categoryDetected}
      categoriaTitle={categoriaTitle}
      subcategoriaLabel={subcategoriaLabel}
    >
      {/* Valor da Movimentação */}
      <div className="p-3">
        <div className="flex justify-between items-center mb-1">
          <h4 className="text-sm font-semibold text-neutral-400 uppercase">
            {ativo.valorAtual >= 0 ? 'Entrada' : 'Saída'}
          </h4>
          <div className="text-xs text-neutral-500">
            {ativo.dataMovimentacao || `Últ. Atualização: ${horaFormatada}`}
          </div>
        </div>
        <div className={`text-2xl font-bold mb-3 ${getCorPorTipo()}`}>
          {formatValue(Math.abs(ativo.valorAtual || ativo.value || 0))}
        </div>
        <ul className="text-xs text-white-500 p-1">
          <li className="flex justify-between border-b border-neutral-900 p-2">
            <span>Tipo</span>
            <span>{getTipoMovimentacao()}</span>
          </li>
          <li className="flex justify-between border-b border-neutral-900 p-2">
            <span>Status</span>
            <span className={ativo.status === 'Confirmado' || ativo.status === 'Creditado' || ativo.status === 'Processado' ? 'text-green-400' : 'text-yellow-400'}>
              {ativo.status || 'Processado'}
            </span>
          </li>
          <li className="flex justify-between p-2">
            <span>Origem</span>
            <span>{ativo.origem || 'N/A'}</span>
          </li>
        </ul>
      </div>

      {/* Detalhes da Movimentação - Accordion */}
      <div className="text-neutral-200 border-b border-t border-neutral-900">
        <button
          onClick={() => setShowDetalhesMovimentacao(!showDetalhesMovimentacao)}
          className={`w-full flex items-center justify-between p-3 bg-neutral-900/50 hover:bg-neutral-900 transition-colors cursor-pointer ${showDetalhesMovimentacao ? 'bg-neutral-900' : ''}`}
        >
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-neutral-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 1v3m5-3v3m5-3v3M1 7h18M5 11h10M2 3h16a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z"></path>
            </svg>
            <h4 className="text-sm font-semibold text-white">
              Detalhes da Movimentação
            </h4>
          </div>
          <svg
            className={`w-4 h-4 text-neutral-400 transition-transform ${showDetalhesMovimentacao ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {showDetalhesMovimentacao && (
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
                    <span className="text-white font-medium">{ativo.tipoMovimentacao || getTipoMovimentacao()}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 px-3 border-b border-neutral-800/30">
                    <span className="text-neutral-400">Data</span>
                    <span className="text-white font-medium">{ativo.dataMovimentacao || "N/A"}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 px-3 border-b border-neutral-800/30">
                    <span className="text-neutral-400">Descrição</span>
                    <span className="text-white font-medium">{ativo.descricao || "N/A"}</span>
                  </div>
                  {ativo.quantidade && (
                    <div className="flex justify-between items-center py-2 px-3 border-b border-neutral-800/30">
                      <span className="text-neutral-400">Quantidade</span>
                      <span className="text-white font-medium">{hideValues ? "••••••" : ativo.quantidade.toLocaleString("pt-BR")}</span>
                    </div>
                  )}
                  {ativo.valorPorAcao && (
                    <div className="flex justify-between items-center py-2 px-3 border-b border-neutral-800/30">
                      <span className="text-neutral-400">Valor por Ação</span>
                      <span className="text-white font-medium">{formatValue(ativo.valorPorAcao)}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center py-2 px-3 bg-neutral-900/30">
                    <span className="text-neutral-400 font-medium">Status</span>
                    <span className={`font-bold ${ativo.status === 'Confirmado' || ativo.status === 'Creditado' || ativo.status === 'Processado' ? 'text-green-400' : 'text-yellow-400'}`}>
                      {ativo.status || 'Processado'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Informações da Operação - Accordion */}
      {(ativo.numeroOperacao || ativo.banco || ativo.chavePixUtilizada || ativo.codigoBarras || ativo.tipoProvento) && (
        <div className="text-neutral-200 border-b border-neutral-900">
          <button
            onClick={() => setShowInformacoesOperacao(!showInformacoesOperacao)}
            className={`w-full flex items-center justify-between p-3 bg-neutral-900/50 hover:bg-neutral-900 transition-colors cursor-pointer ${showInformacoesOperacao ? 'bg-neutral-900' : ''}`}
          >
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-neutral-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"></path>
              </svg>
              <h4 className="text-sm font-semibold text-white">
                Informações da Operação
              </h4>
            </div>
            <svg
              className={`w-4 h-4 text-neutral-400 transition-transform ${showInformacoesOperacao ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {showInformacoesOperacao && (
            <div>
              <div className="border-b border-neutral-800" />
              <div className="relative px-4 py-4">
                <div className="bg-neutral-900/50 rounded-lg border border-neutral-900/90">
                  <div className="text-xs">
                    {ativo.numeroOperacao && (
                      <div className="flex justify-between items-center py-2 px-3 border-b border-neutral-800/30">
                        <span className="text-neutral-400">Número da Operação</span>
                        <span className="text-white font-medium">{ativo.numeroOperacao}</span>
                      </div>
                    )}
                    {ativo.banco && (
                      <div className="flex justify-between items-center py-2 px-3 border-b border-neutral-800/30">
                        <span className="text-neutral-400">Banco</span>
                        <span className="text-white font-medium">{ativo.banco}</span>
                      </div>
                    )}
                    {ativo.agencia && (
                      <div className="flex justify-between items-center py-2 px-3 border-b border-neutral-800/30">
                        <span className="text-neutral-400">Agência</span>
                        <span className="text-white font-medium">{ativo.agencia}</span>
                      </div>
                    )}
                    {ativo.conta && (
                      <div className="flex justify-between items-center py-2 px-3 border-b border-neutral-800/30">
                        <span className="text-neutral-400">Conta</span>
                        <span className="text-white font-medium">{ativo.conta}</span>
                      </div>
                    )}
                    {ativo.chavePixUtilizada && (
                      <div className="flex justify-between items-center py-2 px-3 border-b border-neutral-800/30">
                        <span className="text-neutral-400">Chave PIX</span>
                        <span className="text-white font-medium">{hideValues ? "••••••" : ativo.chavePixUtilizada}</span>
                      </div>
                    )}
                    {ativo.destinatario && (
                      <div className="flex justify-between items-center py-2 px-3 border-b border-neutral-800/30">
                        <span className="text-neutral-400">Destinatário</span>
                        <span className="text-white font-medium">{ativo.destinatario}</span>
                      </div>
                    )}
                    {ativo.codigoBarras && (
                      <div className="flex justify-between items-center py-2 px-3 border-b border-neutral-800/30">
                        <span className="text-neutral-400">Código de Barras</span>
                        <span className="text-white font-medium text-xs">{hideValues ? "••••••" : ativo.codigoBarras}</span>
                      </div>
                    )}
                    {ativo.beneficiario && (
                      <div className="flex justify-between items-center py-2 px-3 border-b border-neutral-800/30">
                        <span className="text-neutral-400">Beneficiário</span>
                        <span className="text-white font-medium">{ativo.beneficiario}</span>
                      </div>
                    )}
                    {ativo.localizacao && (
                      <div className="flex justify-between items-center py-2 px-3 border-b border-neutral-800/30">
                        <span className="text-neutral-400">Localização</span>
                        <span className="text-white font-medium">{ativo.localizacao}</span>
                      </div>
                    )}
                    {ativo.tipoProvento && (
                      <div className="flex justify-between items-center py-2 px-3 border-b border-neutral-800/30">
                        <span className="text-neutral-400">Tipo de Provento</span>
                        <span className="text-white font-medium">{ativo.tipoProvento}</span>
                      </div>
                    )}
                    {ativo.dataComExDividendo && (
                      <div className="flex justify-between items-center py-2 px-3 border-b border-neutral-800/30">
                        <span className="text-neutral-400">Data Com</span>
                        <span className="text-white font-medium">{ativo.dataComExDividendo}</span>
                      </div>
                    )}
                    {ativo.dataAprovacao && (
                      <div className="flex justify-between items-center py-2 px-3 border-b border-neutral-800/30">
                        <span className="text-neutral-400">Data Aprovação</span>
                        <span className="text-white font-medium">{ativo.dataAprovacao}</span>
                      </div>
                    )}
                    {(ativo.taxa !== undefined && ativo.taxa !== null) && (
                      <div className="flex justify-between items-center py-2 px-3 bg-neutral-900/30">
                        <span className="text-neutral-400 font-medium">Taxa</span>
                        <span className="text-white font-bold">{ativo.taxa === 0 ? 'Gratuito' : formatValue(ativo.taxa)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Informações de Investimento - Accordion (para resgates) */}
      {(ativo.valorInvestido || ativo.rendimentoBruto || ativo.impostoRetido || ativo.taxaContratada) && (
        <div className="text-neutral-200 border-b border-neutral-900">
          <button
            onClick={() => setShowInformacoesConta(!showInformacoesConta)}
            className={`w-full flex items-center justify-between p-3 bg-neutral-900/50 hover:bg-neutral-900 transition-colors cursor-pointer ${showInformacoesConta ? 'bg-neutral-900' : ''}`}
          >
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-neutral-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l4-4 4 4 5-5m0 0h-3.5M16 3v3.5"></path>
              </svg>
              <h4 className="text-sm font-semibold text-white">
                Informações do Investimento
              </h4>
            </div>
            <svg
              className={`w-4 h-4 text-neutral-400 transition-transform ${showInformacoesConta ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {showInformacoesConta && (
            <div>
              <div className="border-b border-neutral-800" />
              <div className="relative px-4 py-4">
                <div className="bg-neutral-900/50 rounded-lg border border-neutral-900/90">
                  <div className="text-xs">
                    {ativo.valorInvestido && (
                      <div className="flex justify-between items-center py-2 px-3 border-b border-neutral-800/30">
                        <span className="text-neutral-400">Valor Investido</span>
                        <span className="text-white font-medium">{formatValue(ativo.valorInvestido)}</span>
                      </div>
                    )}
                    {ativo.rendimentoBruto && (
                      <div className="flex justify-between items-center py-2 px-3 border-b border-neutral-800/30">
                        <span className="text-neutral-400">Rendimento Bruto</span>
                        <span className="text-green-400 font-medium">{formatValue(ativo.rendimentoBruto)}</span>
                      </div>
                    )}
                    {ativo.impostoRetido !== undefined && (
                      <div className="flex justify-between items-center py-2 px-3 border-b border-neutral-800/30">
                        <span className="text-neutral-400">Imposto Retido</span>
                        <span className="text-red-400 font-medium">{formatValue(ativo.impostoRetido)}</span>
                      </div>
                    )}
                    {ativo.rendimentoLiquido && (
                      <div className="flex justify-between items-center py-2 px-3 border-b border-neutral-800/30">
                        <span className="text-neutral-400">Rendimento Líquido</span>
                        <span className="text-green-400 font-medium">{formatValue(ativo.rendimentoLiquido)}</span>
                      </div>
                    )}
                    {ativo.dataInvestimento && (
                      <div className="flex justify-between items-center py-2 px-3 border-b border-neutral-800/30">
                        <span className="text-neutral-400">Data Investimento</span>
                        <span className="text-white font-medium">{ativo.dataInvestimento}</span>
                      </div>
                    )}
                    {ativo.prazoInvestimento && (
                      <div className="flex justify-between items-center py-2 px-3 border-b border-neutral-800/30">
                        <span className="text-neutral-400">Prazo</span>
                        <span className="text-white font-medium">{ativo.prazoInvestimento} dias</span>
                      </div>
                    )}
                    {ativo.taxaContratada && (
                      <div className="flex justify-between items-center py-2 px-3 border-b border-neutral-800/30">
                        <span className="text-neutral-400">Taxa Contratada</span>
                        <span className="text-white font-medium">{hideValues ? "••••••" : `${ativo.taxaContratada}% CDI`}</span>
                      </div>
                    )}
                    {ativo.percentualCDI && (
                      <div className="flex justify-between items-center py-2 px-3 border-b border-neutral-800/30">
                        <span className="text-neutral-400">% do CDI</span>
                        <span className="text-white font-medium">{hideValues ? "••••••" : `${ativo.percentualCDI}%`}</span>
                      </div>
                    )}
                    {ativo.saldoMedio && (
                      <div className="flex justify-between items-center py-2 px-3 bg-neutral-900/30">
                        <span className="text-neutral-400 font-medium">Saldo Médio</span>
                        <span className="text-white font-bold">{formatValue(ativo.saldoMedio)}</span>
                      </div>
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