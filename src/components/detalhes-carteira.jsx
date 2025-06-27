"use client"

import { useState, useEffect } from "react"
import { formatCurrency } from "../utils/formatCurrency"

export default function DetalhesCarteira({ ativo, isVisible, onClose }) {
  // Estados para controlar os acordeões
  const [showDepositos, setShowDepositos] = useState(false)
  const [showCondicoes, setShowCondicoes] = useState(false)
  const [showGarantias, setShowGarantias] = useState(false)
  const [showImpostos, setShowImpostos] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  // Controlar a animação de entrada e saída
  useEffect(() => {
    if (isVisible) {
      setIsAnimating(true)
    } else {
      const timer = setTimeout(() => setIsAnimating(false), 300)
      return () => clearTimeout(timer)
    }
  }, [isVisible])

  if (!ativo || (!isVisible && !isAnimating)) return null

  // Obter data e hora atual formatada
  const dataAtual = new Date()
  const dataFormatada = dataAtual.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })
  const horaFormatada = dataAtual.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  })

  // Calcular valores para exibição
  const valorAplicado = ativo.valorAplicado || ativo.precoMedio * ativo.quantidade || 0
  const totalBruto = ativo.valorAtual || 0
  const valorizacao = totalBruto - valorAplicado
  const percentualValorizacao = valorAplicado > 0 ? (valorizacao / valorAplicado) * 100 : 0
  const impostos = totalBruto * 0.15 // Simulação de imposto de 15%
  const totalLiquido = totalBruto - impostos

  // Determinar se houve valorização positiva
  const isPositivo = valorizacao >= 0

  // Função para renderizar tooltip
  const renderTooltip = (texto) => {
    return (
      <div className="group relative inline-block">
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
          className="text-[#aaa] ml-1 cursor-help"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M12 16v-4" />
          <path d="M12 8h.01" />
        </svg>
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-2 bg-[#1a1a1a] text-white text-xs rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
          {texto}
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-[#1a1a1a]"></div>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Modal lateral */}
      <div
        className={`fixed inset-y-0 right-0 w-96 bg-[#2a2a2a] shadow-lg z-50 border-l border-[#404040] transition-transform duration-300 ease-in-out ${
          isVisible ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Cabeçalho */}
        <div className="flex justify-between items-center p-4 border-b border-[#404040] bg-[#353535]">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-white truncate">{ativo.codigo || "RDB Resgate Diário"}</h3>
            <p className="text-sm text-[#aaa] truncate">{ativo.nome || "Banco XYZ S.A."}</p>
          </div>
          <button
            className="bg-[#444] hover:bg-[#555] text-white p-2 rounded-full transition-colors ml-2"
            onClick={onClose}
            title="Fechar detalhes"
          >
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
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Conteúdo com scroll */}
        <div className="overflow-y-auto h-full pb-24">
          {/* Bloco de Total Bruto */}
          <div className="p-4 border-b border-[#404040]">
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-sm font-semibold text-[#aaa] uppercase">Total Bruto</h4>
              <div className="text-xs text-[#888]">
                Atualizado hoje às {horaFormatada} ({dataFormatada})
              </div>
            </div>

            <div className="text-2xl font-bold text-white mb-2">{formatCurrency(totalBruto)}</div>

            <div className="flex items-center">
              <div className={`flex items-center ${isPositivo ? "text-[#21dd74]" : "text-[#d32f2f]"}`}>
                {isPositivo ? (
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
                    className="mr-1"
                  >
                    <path d="m18 15-6-6-6 6" />
                  </svg>
                ) : (
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
                    className="mr-1"
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                )}
                <span className="font-medium">
                  {formatCurrency(Math.abs(valorizacao))} ({percentualValorizacao.toFixed(2).replace(".", ",")}%)
                </span>
              </div>
              <span className="text-xs text-[#888] ml-2">nos últimos 12 meses</span>
            </div>
          </div>

          {/* Bloco de Meu Investimento */}
          <div className="p-4 border-b border-[#404040] bg-[#2e2e2e]">
            <h4 className="text-sm font-semibold text-[#aaa] uppercase mb-3">Meu Investimento</h4>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-[#888] mb-1">Valor Aplicado</div>
                <div className="font-medium">{formatCurrency(valorAplicado)}</div>
              </div>

              <div>
                <div className="text-xs text-[#888] mb-1 flex items-center">
                  Valorização
                  {renderTooltip("Diferença entre o total bruto e o valor que você aplicou")}
                </div>
                <div className={`font-medium ${isPositivo ? "text-[#21dd74]" : "text-[#d32f2f]"}`}>
                  {isPositivo ? "+" : "-"}
                  {formatCurrency(Math.abs(valorizacao))}
                </div>
              </div>

              <div>
                <div className="text-xs text-[#888] mb-1">Total Bruto</div>
                <div className="font-medium">{formatCurrency(totalBruto)}</div>
              </div>

              <div>
                <div className="text-xs text-[#888] mb-1 flex items-center">
                  Impostos no Resgate
                  {renderTooltip("Estimativa de impostos a serem pagos no resgate total")}
                </div>
                <div className="font-medium text-[#d32f2f]">-{formatCurrency(impostos)}</div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-[#404040]">
              <div className="flex justify-between items-center">
                <div className="text-xs text-[#888]">Total Líquido</div>
                <div className="text-lg font-bold">{formatCurrency(totalLiquido)}</div>
              </div>
            </div>
          </div>

          {/* Bloco de Rendabilidade */}
          <div className="p-4 border-b border-[#404040]">
            <h4 className="text-sm font-semibold text-[#aaa] uppercase mb-3">Rendabilidade Contratada</h4>

            <div className="bg-[#2e2e2e] p-3 rounded-lg border border-[#404040]">
              <div className="flex justify-between">
                <div className="text-xs text-[#888]">Taxa</div>
                <div className="font-medium">120% do CDI</div>
              </div>
              <div className="flex justify-between mt-2">
                <div className="text-xs text-[#888]">Rentabilidade anual</div>
                <div className="font-medium">13,20% a.a.</div>
              </div>
            </div>
          </div>

          {/* Links de navegação */}
          <div className="border-b border-[#404040]">
            <button
              className="w-full p-4 flex justify-between items-center hover:bg-[#353535] transition-colors"
              onClick={() => setShowDepositos(!showDepositos)}
            >
              <div className="font-medium">Detalhes dos depósitos</div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`transition-transform ${showDepositos ? "rotate-90" : ""}`}
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>

            {showDepositos && (
              <div className="p-4 bg-[#2e2e2e]">
                <div className="mb-3">
                  <div className="text-xs text-[#888] mb-1">Data de aplicação</div>
                  <div className="font-medium">10/03/2025</div>
                </div>
                <div className="mb-3">
                  <div className="text-xs text-[#888] mb-1">Valor inicial</div>
                  <div className="font-medium">{formatCurrency(valorAplicado)}</div>
                </div>
                <div>
                  <div className="text-xs text-[#888] mb-1">Depósitos adicionais</div>
                  <div className="font-medium">Nenhum</div>
                </div>
              </div>
            )}

            <button
              className="w-full p-4 flex justify-between items-center hover:bg-[#353535] transition-colors"
              onClick={() => setShowCondicoes(!showCondicoes)}
            >
              <div className="font-medium">Condições de vencimento</div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`transition-transform ${showCondicoes ? "rotate-90" : ""}`}
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>

            {showCondicoes && (
              <div className="p-4 bg-[#2e2e2e]">
                <div className="mb-3">
                  <div className="text-xs text-[#888] mb-1">Data de vencimento</div>
                  <div className="font-medium">Sem vencimento (resgate diário)</div>
                </div>
                <div>
                  <div className="text-xs text-[#888] mb-1">Liquidez</div>
                  <div className="font-medium">D+0 (mesmo dia)</div>
                </div>
              </div>
            )}
          </div>

          {/* Informações de resgate e aplicações */}
          <div className="p-4 border-b border-[#404040]">
            <h4 className="text-sm font-semibold text-[#aaa] uppercase mb-3">Informações de Resgate e Aplicações</h4>

            <div className="space-y-3">
              <div>
                <div className="text-xs text-[#888] mb-1">Resgate</div>
                <div className="font-medium">Dias úteis até às 15:00h</div>
              </div>

              <div>
                <div className="text-xs text-[#888] mb-1">Aplicação mínima</div>
                <div className="font-medium">{formatCurrency(1000)}</div>
              </div>

              <div>
                <div className="text-xs text-[#888] mb-1">Prazo para rentabilizar</div>
                <div className="font-medium">D+0 (mesmo dia)</div>
              </div>
            </div>
          </div>

          {/* Sobre o RDB */}
          <div className="p-4 border-b border-[#404040]">
            <h4 className="text-sm font-semibold text-[#aaa] uppercase mb-3">Sobre o RDB</h4>

            <div className="space-y-3">
              <div>
                <div className="text-xs text-[#888] mb-1">Classe de ativo</div>
                <div className="font-medium">Renda Fixa</div>
              </div>

              <div>
                <div className="text-xs text-[#888] mb-1">Emissor</div>
                <div className="flex items-center">
                  <div className="font-medium">Banco XYZ S.A.</div>
                  <a href="#" className="text-[#058CE1] text-xs ml-2">
                    Saiba mais
                  </a>
                </div>
              </div>

              {/* Acordeões */}
              <div className="mt-4">
                <button
                  className="w-full py-2 flex justify-between items-center border-t border-[#404040]"
                  onClick={() => setShowGarantias(!showGarantias)}
                >
                  <div className="font-medium">Garantido pelo FGC</div>
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
                    className={`transition-transform ${showGarantias ? "rotate-180" : ""}`}
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </button>

                {showGarantias && (
                  <div className="py-2 px-3 text-sm text-[#aaa]">
                    Este investimento é garantido pelo Fundo Garantidor de Créditos (FGC) até o limite de R$ 250.000,00
                    por CPF e por instituição financeira.
                  </div>
                )}

                <button
                  className="w-full py-2 flex justify-between items-center border-t border-[#404040]"
                  onClick={() => setShowImpostos(!showImpostos)}
                >
                  <div className="font-medium">Impostos Regressivos</div>
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
                    className={`transition-transform ${showImpostos ? "rotate-180" : ""}`}
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </button>

                {showImpostos && (
                  <div className="py-2 px-3 text-sm text-[#aaa]">
                    <p className="mb-2">Tabela regressiva de Imposto de Renda:</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Até 180 dias: 22,5%</li>
                      <li>De 181 a 360 dias: 20%</li>
                      <li>De 361 a 720 dias: 17,5%</li>
                      <li>Acima de 720 dias: 15%</li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Rodapé com botões de ação */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-[#2a2a2a] border-t border-[#404040]">
          <div className="flex justify-between gap-3">
            <button
              className="bg-[#FDAA1A] hover:bg-[#F09800] text-white px-4 py-3 rounded-lg font-bold flex-1 transition-colors uppercase text-sm"
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
              className="bg-[#058CE1] hover:bg-[#006FB5] text-white px-4 py-3 rounded-lg font-bold flex-1 transition-colors uppercase text-sm"
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
        </div>
      </div>

      {/* Overlay para fechar o modal quando clicar fora */}
      {(isVisible || isAnimating) && (
        <div
          className={`fixed inset-0 bg-black z-40 transition-opacity duration-300 ${
            isVisible ? "bg-opacity-50" : "bg-opacity-0"
          }`}
          onClick={onClose}
        ></div>
      )}
    </>
  )
}
