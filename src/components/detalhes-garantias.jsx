"use client"

import { useState } from "react"
import { DetalhesBase } from "./detalhes-base"
import { formatCurrency } from "../utils/formatCurrency"
import { usePatrimonio } from "../context/patrimonioContext" // Importar o contexto

export default function DetalhesGarantias({ 
  ativo, 
  isVisible, 
  onClose, 
  categoriaTitle,    // Ex: "Garantias" 
  subcategoriaLabel  // Ex: "Carta de Fiança"
}) {
  // Acessar o contexto para obter o estado hideValues
  const { hideValues } = usePatrimonio()
  
  const [showInformacoesGarantia, setShowInformacoesGarantia] = useState(true)

  if (!ativo) return null

  // Função para detectar a categoria baseada no ativo
  const detectCategory = () => {
    return 'garantias'
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

  const actionButtons = (
    <div className="flex justify-between gap-3">
      {/* <button
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded-lg font-bold flex-1 transition-colors uppercase text-sm"
        onClick={() => console.log("Consultar", ativo)}
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
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          Consultar
        </div>
      </button>
      <button
        className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-3 rounded-lg font-bold flex-1 transition-colors uppercase text-sm"
        onClick={() => console.log("Histórico", ativo)}
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
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
            <path d="M12 7v5l4 2" />
          </svg>
          Histórico
        </div>
      </button> */}
    </div>
  )

  return (
    <DetalhesBase
      isVisible={isVisible}
      onClose={onClose}
      title={ativo.codigo || "Garantia"}
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
            Valor da Garantia
          </h4>
          <div className="text-xs text-neutral-500">
            Últ. Atualização: {horaFormatada}
          </div>
        </div>
        <div className="text-2xl font-bold text-white mb-3">
          {formatValue(ativo.valorAtual || ativo.value || 0)}
        </div>
        <ul className="text-xs text-white-500 p-1">
          <li className="flex justify-between border-b border-neutral-900 p-2">
            <span>Tipo de Garantia</span>
            <span>{ativo.collateral || "N/A"}</span>
          </li>
          <li className="flex justify-between p-2">
            <span>Quantidade</span>
            <span>{hideValues ? "••••••" : (ativo.qty || 0).toLocaleString("pt-BR")}</span>
          </li>
        </ul>
      </div>

      {/* Informações da Garantia - Accordion */}
      <div className="text-neutral-200 border-b border-t border-neutral-900">
        <button
          onClick={() => setShowInformacoesGarantia(!showInformacoesGarantia)}
          className={`w-full flex items-center justify-between p-3 bg-neutral-900/50 hover:bg-neutral-900 transition-colors cursor-pointer ${showInformacoesGarantia ? 'bg-neutral-900' : ''}`}
        >
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-neutral-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"></path>
            </svg>
            <h4 className="text-sm font-semibold text-white">
              Informações da Garantia
            </h4>
          </div>
          <svg
            className={`w-4 h-4 text-neutral-400 transition-transform ${showInformacoesGarantia ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {showInformacoesGarantia && (
          <div>
            <div className="border-b border-neutral-800" />
            <div className="relative px-4 py-4">
              <div className="bg-neutral-900/50 rounded-lg border border-neutral-900/90">
                <div className="text-xs">
                  <div className="flex justify-between items-center py-2 px-3 border-b border-neutral-800/30">
                    <span className="text-neutral-400">Data da Garantia</span>
                    <span className="text-white font-medium">{ativo.dtCollateral || "N/A"}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 px-3 border-b border-neutral-800/30">
                    <span className="text-neutral-400">Tipo de Garantia</span>
                    <span className="text-white font-medium">{ativo.collateral || "N/A"}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 px-3 border-b border-neutral-800/30">
                    <span className="text-neutral-400">Descrição</span>
                    <span className="text-white font-medium">{ativo.description || "N/A"}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 px-3 border-b border-neutral-800/30">
                    <span className="text-neutral-400">Quantidade</span>
                    <span className="text-white font-medium">{formatQuantity(ativo.qty || 0)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 px-3 border-b border-neutral-800/30">
                    <span className="text-neutral-400">Valor</span>
                    <span className="text-white font-medium">{formatValue(ativo.value || 0)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 px-3 border-b border-neutral-800/30">
                    <span className="text-neutral-400">Moeda</span>
                    <span className="text-white font-medium">{ativo.currency || "BRL"}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 px-3 border-b border-neutral-800/30">
                    <span className="text-neutral-400">Vencimento</span>
                    <span className="text-white font-medium">{ativo.dtExpired || "N/A"}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 px-3 bg-neutral-900/30">
                    <span className="text-neutral-400 font-medium">Origem</span>
                    <span className="text-white font-bold">{ativo.origin || "N/A"}</span>
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