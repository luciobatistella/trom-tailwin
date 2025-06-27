"use client"
import { useState, useEffect, useRef } from "react"
import { useToast } from "../components/toast"
import StockFinder from "./stock-finder"

const Boleta = ({ isOpen, onClose, tipoOperacao = "comprar" }) => {
  const { addToast } = useToast()
  const [ativo, setAtivo] = useState("MGLU3")
  const [quantidade, setQuantidade] = useState(100)
  const [preco, setPreco] = useState(25.8)
  const [precoFracionado, setPrecoFracionado] = useState(25.82) // Preço ligeiramente diferente para fracionado
  const [tipoPreco, setTipoPreco] = useState("limitada")
  const [validade, setValidade] = useState("dia")
  const [dataValidade, setDataValidade] = useState("05/01/2020")
  const [assinatura, setAssinatura] = useState("")
  const [tipoAtual, setTipoAtual] = useState(tipoOperacao)
  const [abaAtiva, setAbaAtiva] = useState("Simples")
  const [ativoSelecionado, setAtivoSelecionado] = useState(false) // Mudar para false para testar sem ativo
  const [showStockFinder, setShowStockFinder] = useState(false)
  const [showFavoritesDropdown, setShowFavoritesDropdown] = useState(false)
  const [favoritesDropdownRef, setFavoritesDropdownRef] = useState(useRef(null))

  // Estado de confirmação
  const [confirmationState, setConfirmationState] = useState({
    showConfirmation: false,
    assinatura: "",
    salvarSenha: false,
    accordionLotePadraoOpen: false,
    accordionLoteFracionadoOpen: false,
  })

  // Estado de posicionamento
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [position, setPosition] = useState({ x: 0, y: 0 })

  // Refs para controlar os intervalos e inputs
  const quantidadeIntervalRef = useRef(null)
  const precoIntervalRef = useRef(null)
  const quantidadeTimeoutRef = useRef(null)
  const precoTimeoutRef = useRef(null)
  const quantidadeInputRef = useRef(null)
  const precoInputRef = useRef(null)
  const confirmationInputRef = useRef(null)

  // Dados do ativo (simulados)
  const dadosAtivo = {
    codigo: "MGLU3",
    nome: "MAGAZ LUIZA ON ED NM",
    precoAtual: 25.8,
    variacao: 0.29,
    percentual: 0.29,
    minimo: 36.16,
    maximo: 46.16,
    abertura: 46.16,
    fechamento: 36.16,
    data: "20/10/2020 15:50:20",
  }

  // Favoritos simulados (normalmente viriam do StockFinder)
  const favoritos = [
    { codigo: "PETR4", nome: "PETROBRAS PN N2", preco: 28.45 },
    { codigo: "VALE3", nome: "VALE ON NM", preco: 65.32 },
    { codigo: "ITUB4", nome: "ITAUUNIBANCO PN N1", preco: 25.18 },
    { codigo: "BBDC4", nome: "BRADESCO PN N1", preco: 13.89 },
    { codigo: "ABEV3", nome: "AMBEV S/A ON", preco: 11.76 },
  ]

  // Calcular quantidades para lote padrão e fracionário
  const lotesPadraoQtd = Math.floor(quantidade / 100) * 100
  const loteFracionadoQtd = quantidade % 100

  // Calcular totais
  const totalLotePadrao = lotesPadraoQtd * preco
  const totalLoteFracionado = loteFracionadoQtd * precoFracionado
  const totalGeral = totalLotePadrao + totalLoteFracionado
  const taxaLotePadrao = lotesPadraoQtd > 0 ? 2.5 : 0
  const taxaLoteFracionado = loteFracionadoQtd > 0 ? 2.5 : 0
  const totalTaxas = taxaLotePadrao + taxaLoteFracionado
  const totalComTaxas = totalGeral + totalTaxas

  // Função para formatar data para hoje
  const getToday = () => {
    const today = new Date()
    const day = String(today.getDate()).padStart(2, "0")
    const month = String(today.getMonth() + 1).padStart(2, "0")
    const year = today.getFullYear()
    return `${day}/${month}/${year}`
  }

  // Função para abrir calendário (simulação)
  const handleCalendarClick = () => {
    setDataValidade(getToday())
  }

  // Funções para controlar quantidade com pressão contínua
  const startQuantidadeChange = (increment, e) => {
    const step = e?.shiftKey ? 1 : 100

    // Primeira mudança imediata
    if (increment) {
      setQuantidade((prev) => prev + step)
    } else {
      setQuantidade((prev) => Math.max(1, prev - step))
    }

    // Aguarda 500ms antes de começar a repetir
    quantidadeTimeoutRef.current = setTimeout(() => {
      quantidadeIntervalRef.current = setInterval(() => {
        if (increment) {
          setQuantidade((prev) => prev + step)
        } else {
          setQuantidade((prev) => Math.max(1, prev - step))
        }
      }, 100) // Repete a cada 100ms
    }, 500)
  }

  const stopQuantidadeChange = () => {
    if (quantidadeTimeoutRef.current) {
      clearTimeout(quantidadeTimeoutRef.current)
    }
    if (quantidadeIntervalRef.current) {
      clearInterval(quantidadeIntervalRef.current)
    }
  }

  // Funções para controlar preço com pressão contínua
  const startPrecoChange = (increment, e) => {
    const step = e?.shiftKey ? 0.01 : 1.0

    // Primeira mudança imediata
    if (increment) {
      setPreco((prev) => Number((prev + step).toFixed(2)))
    } else {
      setPreco((prev) => Math.max(0, Number((prev - step).toFixed(2))))
    }

    // Aguarda 500ms antes de começar a repetir
    precoTimeoutRef.current = setTimeout(() => {
      precoIntervalRef.current = setInterval(() => {
        if (increment) {
          setPreco((prev) => Number((prev + step).toFixed(2)))
        } else {
          setPreco((prev) => Math.max(0, Number((prev - step).toFixed(2))))
        }
      }, 100) // Repete a cada 100ms
    }, 500)
  }

  const stopPrecoChange = () => {
    if (precoTimeoutRef.current) {
      clearTimeout(precoTimeoutRef.current)
    }
    if (precoIntervalRef.current) {
      clearInterval(precoIntervalRef.current)
    }
  }

  // Função para lidar com mudanças na quantidade
  const handleQuantidadeChange = (e) => {
    const value = Number.parseInt(e.target.value) || 0
    setQuantidade(Math.max(1, value))
  }

  // Função para lidar com mudanças no preço
  const handlePrecoChange = (e) => {
    const value = Number.parseFloat(e.target.value) || 0
    setPreco(Math.max(0, Number(value.toFixed(2))))
    // Atualiza o preço fracionado com uma pequena diferença
    setPrecoFracionado(Number((value * 1.001).toFixed(2)))
  }

  // Função para lidar com teclas no input de quantidade
  const handleQuantidadeKeyDown = (e) => {
    const increment = e.shiftKey ? 1 : 100

    if (e.key === "ArrowUp") {
      e.preventDefault()
      setQuantidade((prev) => prev + increment)
    } else if (e.key === "ArrowDown") {
      e.preventDefault()
      setQuantidade((prev) => Math.max(1, prev - increment))
    }
  }

  // Função para lidar com teclas no input de preço
  const handlePrecoKeyDown = (e) => {
    const increment = e.shiftKey ? 0.01 : 1.0

    if (e.key === "ArrowUp") {
      e.preventDefault()
      setPreco((prev) => Number((prev + increment).toFixed(2)))
      setPrecoFracionado(Number((preco * 1.001).toFixed(2)))
    } else if (e.key === "ArrowDown") {
      e.preventDefault()
      setPreco((prev) => Math.max(0, Number((prev - increment).toFixed(2))))
      setPrecoFracionado(Number((preco * 1.001).toFixed(2)))
    }
  }

  // Função para lidar com scroll do mouse na quantidade
  const handleQuantidadeWheel = (e) => {
    e.preventDefault() // Prevenir scroll da página
    const increment = e.shiftKey ? 1 : 100

    if (e.deltaY < 0) {
      // Scroll para cima = aumentar
      setQuantidade((prev) => prev + increment)
    } else {
      // Scroll para baixo = diminuir
      setQuantidade((prev) => Math.max(1, prev - increment))
    }
  }

  // Função para lidar com scroll do mouse no preço
  const handlePrecoWheel = (e) => {
    e.preventDefault() // Prevenir scroll da página
    const increment = e.shiftKey ? 0.01 : 1.0

    if (e.deltaY < 0) {
      // Scroll para cima = aumentar
      setPreco((prev) => Number((prev + increment).toFixed(2)))
      setPrecoFracionado(Number((preco * 1.001).toFixed(2)))
    } else {
      // Scroll para baixo = diminuir
      setPreco((prev) => Math.max(0, Number((prev - increment).toFixed(2))))
      setPrecoFracionado(Number((preco * 1.001).toFixed(2)))
    }
  }

  // Função para mostrar a tela de confirmação
  const showConfirmationScreen = () => {
    setConfirmationState({
      ...confirmationState,
      showConfirmation: true,
      assinatura: "",
    })
  }

  // Função para executar a ordem
  const executarOrdem = () => {
    // Verificar se a assinatura está correta (simulação)
    if (confirmationState.assinatura.length < 4) {
      addToast("Assinatura eletrônica inválida", "error")
      return
    }

    // Executar a ordem
    console.log(`${tipoAtual.toUpperCase()} executado:`, {
      ativo,
      lotesPadraoQtd,
      loteFracionadoQtd,
      preco,
      precoFracionado,
      totalComTaxas,
    })

    // Mostrar toast de sucesso
    addToast(
      `${tipoAtual === "comprar" ? "Compra" : "Venda"} de ${quantidade} ${ativo} a ${preco.toFixed(2)} executada com sucesso!`,
      "success",
    )

    // Fechar confirmação e resetar
    setConfirmationState({
      ...confirmationState,
      showConfirmation: false,
      assinatura: "",
    })
    onClose() // Fechar a boleta completamente
  }

  // Voltar para a tela de boleta
  const voltarParaBoleta = () => {
    setConfirmationState({
      ...confirmationState,
      showConfirmation: false,
      assinatura: "",
    })
  }

  // Atualizar tipo de operação quando a prop mudar
  useEffect(() => {
    setTipoAtual(tipoOperacao)
  }, [tipoOperacao])

  // Função para selecionar um ativo do StockFinder
  const handleSelectStock = (stock) => {
    setAtivo(stock.codigo)
    setAtivoSelecionado(true)
    // Simular preço aleatório para o novo ativo
    const randomPrice = (Math.random() * 100 + 10).toFixed(2)
    setPreco(Number(randomPrice))
    setPrecoFracionado(Number((Number(randomPrice) * 1.001).toFixed(2)))

    // Atualizar dados do ativo
    dadosAtivo.codigo = stock.codigo
    dadosAtivo.nome = stock.descricao

    // Focar no campo quantidade após selecionar o ativo
    setTimeout(() => {
      if (quantidadeInputRef.current) {
        quantidadeInputRef.current.focus()
        quantidadeInputRef.current.select()
      }
    }, 100)
  }

  // Função para selecionar um favorito
  const handleSelectFavorite = (favorito) => {
    setAtivo(favorito.codigo)
    setAtivoSelecionado(true)
    setPreco(favorito.preco)
    setPrecoFracionado(Number((favorito.preco * 1.001).toFixed(2)))
    setShowFavoritesDropdown(false)

    // Atualizar dados do ativo
    dadosAtivo.codigo = favorito.codigo
    dadosAtivo.nome = favorito.nome
    dadosAtivo.precoAtual = favorito.preco
  }

  // Toggle para salvar senha
  const toggleSalvarSenha = () => {
    setConfirmationState({
      ...confirmationState,
      salvarSenha: !confirmationState.salvarSenha,
    })
  }

  // Toggle para dropdown de favoritos
  const toggleFavoritesDropdown = (e) => {
    e.stopPropagation()
    setShowFavoritesDropdown(!showFavoritesDropdown)
  }

  // Adicionar listener para ESC e Ctrl + Enter
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        if (confirmationState.showConfirmation) {
          voltarParaBoleta()
        } else {
          onClose()
        }
      }
      // Modificar funcionalidade Ctrl + Enter para abrir confirmação ou executar
      if (event.ctrlKey && event.key === "Enter") {
        event.preventDefault()
        if (!confirmationState.showConfirmation) {
          showConfirmationScreen()
        } else {
          executarOrdem()
        }
      }

      // Adicionar suporte para barra de espaço para abrir o StockFinder
      if (event.key === " " && !confirmationState.showConfirmation) {
        event.preventDefault()
        setShowStockFinder(true)
      }
    }

    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown)
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [isOpen, onClose, confirmationState.showConfirmation])

  // Auto-focus no campo quantidade quando a boleta abrir
  useEffect(() => {
    if (isOpen) {
      setPosition({ x: 0, y: 0 }) // Resetar posição

      if (confirmationState.showConfirmation) {
        // Focar imediatamente no campo de assinatura
        setTimeout(() => {
          confirmationInputRef.current?.focus()
        }, 50) // Reduzir o timeout para ser mais rápido
      } else if (quantidadeInputRef.current) {
        setTimeout(() => {
          quantidadeInputRef.current?.focus()
          quantidadeInputRef.current?.select()
        }, 100)
      }
    }
  }, [isOpen, confirmationState.showConfirmation])

  // Cleanup dos intervalos quando o componente desmonta
  useEffect(() => {
    return () => {
      stopQuantidadeChange()
      stopPrecoChange()
    }
  }, [])

  // Fechar dropdown de favoritos quando clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (favoritesDropdownRef.current && !favoritesDropdownRef.current.contains(event.target)) {
        setShowFavoritesDropdown(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Gerenciar o arrastar da boleta
  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)

      return () => {
        document.removeEventListener("mousemove", handleMouseMove)
        document.removeEventListener("mouseup", handleMouseUp)
      }
    }
  }, [isDragging, dragOffset])

  // Função para iniciar o drag
  const handleMouseDown = (e) => {
    setIsDragging(true)
    const rect = e.currentTarget.closest(".modal-container").getBoundingClientRect()
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
  }

  // Função para mover durante o drag
  const handleMouseMove = (e) => {
    if (!isDragging) return

    const newX = e.clientX - dragOffset.x
    const newY = e.clientY - dragOffset.y

    // Limitar para não sair da tela
    const maxX = window.innerWidth - 420 // largura da boleta
    const maxY = window.innerHeight - 600 // altura aproximada da boleta

    setPosition({
      x: Math.max(0, Math.min(newX, maxX)),
      y: Math.max(0, Math.min(newY, maxY)),
    })
  }

  // Função para parar o drag
  const handleMouseUp = () => {
    setIsDragging(false)
  }

  // Calcular estilo de posicionamento
  const getPositionStyle = () => {
    if (position.x === 0 && position.y === 0) {
      return {
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
      }
    } else {
      return {
        position: "absolute",
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: "none",
      }
    }
  }

  // Toggle para os acordeões
  const toggleAccordion = (type) => {
    if (type === "padrao") {
      setConfirmationState({
        ...confirmationState,
        accordionLotePadraoOpen: !confirmationState.accordionLotePadraoOpen,
      })
    } else {
      setConfirmationState({
        ...confirmationState,
        accordionLoteFracionadoOpen: !confirmationState.accordionLoteFracionadoOpen,
      })
    }
  }

  // Função para lidar com mudanças na assinatura
  const handleAssinaturaChange = (e) => {
    setConfirmationState({
      ...confirmationState,
      assinatura: e.target.value,
    })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[9999]" onClick={onClose}>
      <div
        className="bg-[#2a2a2a] rounded-lg w-[420px] max-h-[85vh] overflow-y-auto shadow-xl border border-[#404040] relative z-[10000] modal-container"
        style={getPositionStyle()}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header da Boleta */}
        <div
          className="bg-[#1e1e1e] px-4 py-2 border-b border-[#404040] cursor-move rounded-t-lg"
          onMouseDown={handleMouseDown}
        >
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-bold text-white">
              {confirmationState.showConfirmation
                ? `Confirmar ${tipoAtual === "comprar" ? "Compra" : "Venda"}`
                : "Boleta de Negociação"}
            </h2>
            <div className="flex items-center gap-2">
              {/* Botão de buscar - só aparece na tela principal */}
              {!confirmationState.showConfirmation && (
                <button
                  className="p-1 hover:bg-[#3a3a3a] rounded transition-colors"
                  title="Buscar ativo"
                  onClick={() => setShowStockFinder(true)}
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
                    className="text-[#aaa] hover:text-white"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.35-4.35" />
                  </svg>
                </button>
              )}
              {/* Botão de fechar */}
              <button className="p-1 hover:bg-[#3a3a3a] rounded transition-colors" onClick={onClose} title="Fechar">
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
                  className="text-[#aaa] hover:text-white"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Conteúdo da Boleta - Condicional baseado em showConfirmation */}
        {!confirmationState.showConfirmation ? (
          <>
            {/* Sistema de Abas */}
            <div className="bg-[#2e2e2e]">
              <div className="flex border-b border-[#404040]">
                {["Simples", "Stop", "Stop Gain/Loss", "Móvel", "OCO"].map((aba) => (
                  <button
                    key={aba}
                    className={`flex-1 px-1 py-2 text-xs font-semibold transition-colors relative whitespace-nowrap ${
                      abaAtiva === aba
                        ? "text-[#F7941E] bg-[#2a2a2a]"
                        : "text-[#aaa] hover:text-white hover:bg-[#3a3a3a]"
                    }`}
                    onClick={() => setAbaAtiva(aba)}
                  >
                    {aba}
                    {/* Linha embaixo da aba ativa */}
                    {abaAtiva === aba && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#F7941E]"></div>}
                  </button>
                ))}
              </div>
            </div>

            {/* Header com dados do ativo */}
            {ativoSelecionado ? (
              <div className="bg-[#353535] p-3 border-b border-[#404040]">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-xs text-[#aaa] mb-1">BOV</div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg font-bold text-white">{dadosAtivo.codigo}</span>
                      <span
                        className="text-[10px] bg-orange-500 text-white px-1 rounded cursor-help font-bold"
                        title="Day Trade"
                      >
                        DT
                      </span>
                      <div className="relative" ref={favoritesDropdownRef.current}>
                        <button
                          onClick={toggleFavoritesDropdown}
                          className="text-[#aaa] cursor-pointer hover:text-white transition-colors"
                          title="Favoritos"
                        >
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            className={`transition-transform ${showFavoritesDropdown ? "rotate-180" : ""}`}
                          >
                            <path d="m6 9 6 6 6-6" />
                          </svg>
                        </button>

                        {/* Dropdown de Favoritos */}
                        {showFavoritesDropdown && (
                          <div className="absolute top-full left-0 mt-1 bg-[#2a2a2a] rounded-lg shadow-lg border border-[#404040] w-64 z-[10001] max-h-60 overflow-y-auto">
                            <div className="p-2">
                              <div className="text-xs text-[#aaa] font-semibold mb-2 border-b border-[#404040] pb-1 flex items-center gap-1">
                                <svg
                                  width="12"
                                  height="12"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
                                </svg>
                                FAVORITOS
                              </div>

                              {favoritos.length > 0 ? (
                                favoritos.map((favorito) => (
                                  <button
                                    key={favorito.codigo}
                                    className="w-full text-left p-2 hover:bg-[#3a3a3a] rounded transition-colors border-b border-[#404040] last:border-b-0"
                                    onClick={() => handleSelectFavorite(favorito)}
                                  >
                                    <div className="flex justify-between items-center">
                                      <div className="text-sm font-bold text-white">{favorito.codigo}</div>
                                      <div className="bg-[#555] text-white px-2 py-1 rounded text-xs font-bold">
                                        {favorito.preco.toFixed(2)}
                                      </div>
                                    </div>
                                  </button>
                                ))
                              ) : (
                                <div className="p-3 text-center text-xs text-[#666]">Nenhum favorito encontrado</div>
                              )}

                              <div className="border-t border-[#404040] mt-2 pt-2">
                                <button
                                  className="w-full text-xs text-[#aaa] hover:text-white transition-colors flex items-center justify-center gap-1 py-1"
                                  onClick={() => {
                                    setShowFavoritesDropdown(false)
                                    setShowStockFinder(true)
                                  }}
                                >
                                  <svg
                                    width="12"
                                    height="12"
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
                                  Buscar mais ativos
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-xs text-[#aaa]">{dadosAtivo.nome}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-[#aaa]">{dadosAtivo.data}</div>
                    <div className="text-xl font-bold text-white">{dadosAtivo.precoAtual.toFixed(2)}</div>
                    <div className="flex items-center gap-1 text-green-400 text-sm">
                      <span>▲ {dadosAtivo.variacao.toFixed(2)}</span>
                      <span className="bg-green-600 text-white px-1 rounded text-xs">
                        ▲ {dadosAtivo.percentual.toFixed(2)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-[#353535] p-3 border-b border-[#404040]">
                <div className="text-center py-4">
                  <div className="text-[#aaa] mb-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="32"
                      height="32"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mx-auto mb-2"
                    >
                      <circle cx="11" cy="11" r="8" />
                      <path d="m21 21-4.35-4.35" />
                    </svg>
                  </div>
                  <div className="text-sm text-[#aaa] mb-1">Nenhum ativo selecionado</div>
                  <div className="text-xs text-[#666]">
                    Use o botão de busca ou aperte barra de espaço para selecionar
                  </div>
                </div>
              </div>
            )}

            {/* Seção de preços */}
            {ativoSelecionado && (
              <div className="p-1 border-b border-[#404040] bg-[#2e2e2e]">
                <div className="grid grid-cols-4 gap-1 text-center">
                  <div>
                    <div className="text-[10px] text-[#aaa]">MÍNIMO</div>
                    <div className="font-semibold text-white text-xs">{dadosAtivo.minimo.toFixed(2)}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-[#aaa]">MÁXIMO</div>
                    <div className="font-semibold text-white text-xs">{dadosAtivo.maximo.toFixed(2)}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-[#aaa]">ABERTURA</div>
                    <div className="font-semibold text-white text-xs">{dadosAtivo.abertura.toFixed(2)}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-[#aaa]">FECHAMENTO</div>
                    <div className="font-semibold text-white text-xs">{dadosAtivo.fechamento.toFixed(2)}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Formulário - Layout horizontal: label + campo */}
            <div className="">
              {/* Conta */}
              <div className="flex items-center border-b border-[#404040]">
                <label className="w-1/2 text-xs font-semibold text-[#aaa] pl-3">CONTA</label>
                <div className="w-1/2 bg-[#353535] py-1 pr-1">
                  <select className="w-full bg-[#353535] border-0 px-3 py-1 text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#F7941E]">
                    <option>Lorem</option>
                  </select>
                </div>
              </div>

              {/* Tipo - Botões lado a lado */}
              <div className="flex items-center border-b border-[#404040]">
                <label className="w-1/2 text-xs font-semibold text-[#aaa] pl-3">TIPO</label>
                <div className="w-1/2 bg-[#353535] py-1 flex gap-1 px-1">
                  <button
                    className={`flex-1 py-1 px-2 font-semibold text-xs transition-colors ${
                      tipoAtual === "comprar" ? "bg-green-600 text-white" : "bg-[#444] text-[#aaa] hover:bg-[#555]"
                    }`}
                    onClick={() => setTipoAtual("comprar")}
                  >
                    COMPRAR
                  </button>
                  <button
                    className={`flex-1 py-1 px-2 font-semibold text-xs transition-colors ${
                      tipoAtual === "vender" ? "bg-red-600 text-white" : "bg-[#444] text-[#aaa] hover:bg-[#555]"
                    }`}
                    onClick={() => setTipoAtual("vender")}
                  >
                    VENDER
                  </button>
                </div>
              </div>

              {/* Quantidade */}
              <div className="flex items-center border-b border-[#404040]">
                <label className="w-1/2 text-xs font-semibold text-[#aaa] pl-3">QUANTIDADE</label>
                <div className="w-1/2 bg-[#353535] py-1 flex items-center justify-between px-1">
                  <input
                    ref={quantidadeInputRef}
                    type="number"
                    value={quantidade}
                    onChange={handleQuantidadeChange}
                    onKeyDown={handleQuantidadeKeyDown}
                    onWheel={handleQuantidadeWheel}
                    className="flex-1 bg-[#353535] border-0 px-0 py-1 text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#F7941E] mr-2 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    min="1"
                  />
                  <div className="flex gap-1">
                    <button
                      className="px-2 py-1 bg-[#444] hover:bg-[#555] text-white transition-colors text-xs select-none"
                      onMouseDown={(e) => startQuantidadeChange(false, e)}
                      onMouseUp={stopQuantidadeChange}
                      onMouseLeave={stopQuantidadeChange}
                      onTouchStart={(e) => startQuantidadeChange(false, e)}
                      onTouchEnd={stopQuantidadeChange}
                    >
                      −
                    </button>
                    <button
                      className="px-2 py-1 bg-[#444] hover:bg-[#555] text-white transition-colors text-xs select-none"
                      onMouseDown={(e) => startQuantidadeChange(true, e)}
                      onMouseUp={stopQuantidadeChange}
                      onMouseLeave={stopQuantidadeChange}
                      onTouchStart={(e) => startQuantidadeChange(true, e)}
                      onTouchEnd={stopQuantidadeChange}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Tipo de Preço */}
              <div className="flex items-center border-b border-[#404040]">
                <label className="w-1/2 text-xs font-semibold text-[#aaa] pl-3">TIPO DE PREÇO</label>
                <div className="w-1/2 bg-[#353535] py-1 pr-1">
                  <select
                    value={tipoPreco}
                    onChange={(e) => setTipoPreco(e.target.value)}
                    className="w-full bg-[#353535] border-0 px-3 py-1 text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#F7941E]"
                  >
                    <option value="limitada">Limitada</option>
                    <option value="mercado">A Mercado</option>
                    <option value="stop">Stop</option>
                  </select>
                </div>
              </div>

              {/* Preço */}
              <div className="flex items-center border-b border-[#404040]">
                <label className="w-1/2 text-xs font-semibold text-[#aaa] pl-3">PREÇO</label>
                <div className="w-1/2 bg-[#353535] py-1 flex items-center justify-between px-1">
                  <input
                    ref={precoInputRef}
                    type="number"
                    value={ativoSelecionado ? preco.toFixed(2) : ""}
                    onChange={handlePrecoChange}
                    onKeyDown={handlePrecoKeyDown}
                    onWheel={handlePrecoWheel}
                    placeholder={ativoSelecionado ? "" : "Selecione um ativo"}
                    disabled={!ativoSelecionado}
                    className="flex-1 bg-[#353535] border-0 px-0 py-1 text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#F7941E] mr-2 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none disabled:text-[#666] placeholder:text-[#666]"
                    min="0"
                    step="0.01"
                  />
                  <div className="flex gap-1">
                    <button
                      className="px-2 py-1 bg-[#444] hover:bg-[#555] text-white transition-colors text-xs select-none disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={!ativoSelecionado}
                      onMouseDown={(e) => startPrecoChange(false, e)}
                      onMouseUp={stopPrecoChange}
                      onMouseLeave={stopPrecoChange}
                      onTouchStart={(e) => startPrecoChange(false, e)}
                      onTouchEnd={stopPrecoChange}
                    >
                      −
                    </button>
                    <button
                      className="px-2 py-1 bg-[#444] hover:bg-[#555] text-white transition-colors text-xs select-none disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={!ativoSelecionado}
                      onMouseDown={(e) => startPrecoChange(true, e)}
                      onMouseUp={stopPrecoChange}
                      onMouseLeave={stopPrecoChange}
                      onTouchStart={(e) => startPrecoChange(true, e)}
                      onTouchEnd={stopPrecoChange}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Validade */}
              <div className="flex items-center border-b border-[#404040]">
                <label className="w-1/2 text-xs font-semibold text-[#aaa] pl-3">VALIDADE</label>
                <div className="w-1/2 bg-[#353535] py-1 flex gap-1 px-1">
                  <select
                    value={validade}
                    onChange={(e) => setValidade(e.target.value)}
                    className="w-16 bg-[#353535] border-0 px-1 py-1 text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#F7941E]"
                  >
                    <option value="dia">Dia</option>
                    <option value="gtc">GTC</option>
                    <option value="ioc">IOC</option>
                  </select>
                  <div className="flex-1 bg-[#353535] px-2 py-1 text-xs text-white text-center">{dataValidade}</div>
                  <button
                    className="w-6 px-1 py-1 bg-[#444] hover:bg-[#555] text-white transition-colors text-xs"
                    onClick={handleCalendarClick}
                    title="Definir data de hoje"
                  >
                    📅
                  </button>
                </div>
              </div>

              {/* Total */}
              <div className="flex items-center border-b border-[#404040]">
                <label className="w-1/2 text-xs font-semibold text-[#aaa] pl-3">TOTAL</label>
                <div className="w-1/2 bg-[#353535] py-1 px-3">
                  <div className="text-sm font-bold text-white">{ativoSelecionado ? totalGeral.toFixed(2) : "--"}</div>
                </div>
              </div>

              {/* Botões de ação */}
              <div className="flex justify-end gap-2 p-3">
                <button
                  className="px-3 py-1 bg-[#444] hover:bg-[#555] text-white transition-colors text-xs"
                  onClick={onClose}
                >
                  Cancelar
                </button>
                <button
                  className={`w-20 px-3 py-1 transition-colors font-semibold text-xs disabled:opacity-50 disabled:cursor-not-allowed ${
                    tipoAtual === "comprar"
                      ? "bg-green-600 hover:bg-green-700 text-white disabled:hover:bg-green-600"
                      : "bg-red-600 hover:bg-red-700 text-white disabled:hover:bg-red-600"
                  }`}
                  disabled={!ativoSelecionado}
                  onClick={showConfirmationScreen}
                  title={ativoSelecionado ? "Ctrl + Enter para executar rapidamente" : "Selecione um ativo primeiro"}
                >
                  {tipoAtual === "comprar" ? "COMPRAR" : "VENDER"}
                </button>
              </div>
            </div>
          </>
        ) : (
          /* TELA DE CONFIRMAÇÃO */
          <div className="p-4">
            <div className="mb-4">
              <div className="text-center mb-4">
                <div className="text-xs text-[#aaa] mb-1">Você está prestes a</div>
                <div className={`text-lg font-bold ${tipoAtual === "comprar" ? "text-green-500" : "text-red-500"}`}>
                  {tipoAtual === "comprar" ? "COMPRAR" : "VENDER"}
                </div>
              </div>

              {/* Acordeon para Lote Padrão - só aparece se tiver lote padrão */}
              {lotesPadraoQtd > 0 && (
                <div className="mb-3">
                  <div className="border border-[#404040] rounded">
                    <button
                      className="w-full px-3 py-2 bg-[#353535] hover:bg-[#404040] transition-colors flex justify-between items-center text-left rounded-t"
                      onClick={() => toggleAccordion("padrao")}
                    >
                      <span className="text-sm font-semibold text-white">
                        {lotesPadraoQtd} - {ativo}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="bg-[#555] text-white px-2 py-1 rounded text-xs font-bold">
                          {totalLotePadrao.toFixed(2)}
                        </span>
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          className={`text-[#aaa] transition-transform ${confirmationState.accordionLotePadraoOpen ? "rotate-180" : ""}`}
                        >
                          <path d="m6 9 6 6 6-6" />
                        </svg>
                      </div>
                    </button>

                    {confirmationState.accordionLotePadraoOpen && (
                      <div className="p-3 bg-[#2e2e2e] border-t border-[#404040] rounded-b">
                        <div className="bg-[#353535] p-3 rounded">
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="flex justify-between">
                              <span className="text-[#aaa]">Quantidade:</span>
                              <span className="text-white font-bold">{lotesPadraoQtd}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-[#aaa]">Preço:</span>
                              <span className="text-white font-bold">{preco.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-[#aaa]">Subtotal:</span>
                              <span className="text-white font-bold">{totalLotePadrao.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-[#aaa]">Taxa:</span>
                              <span className="text-white font-bold">{taxaLotePadrao.toFixed(2)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Acordeon para Lote Fracionário - só aparece se tiver lote fracionário */}
              {loteFracionadoQtd > 0 && (
                <div className="mb-3">
                  <div className="border border-[#404040] rounded">
                    <button
                      className="w-full px-3 py-2 bg-[#353535] hover:bg-[#404040] transition-colors flex justify-between items-center text-left rounded-t"
                      onClick={() => toggleAccordion("fracionado")}
                    >
                      <span className="text-sm font-semibold text-white">
                        {loteFracionadoQtd} - {ativo}F
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="bg-[#555] text-white px-2 py-1 rounded text-xs font-bold">
                          {totalLoteFracionado.toFixed(2)}
                        </span>
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          className={`text-[#aaa] transition-transform ${confirmationState.accordionLoteFracionadoOpen ? "rotate-180" : ""}`}
                        >
                          <path d="m6 9 6 6 6-6" />
                        </svg>
                      </div>
                    </button>

                    {confirmationState.accordionLoteFracionadoOpen && (
                      <div className="p-3 bg-[#2e2e2e] border-t border-[#404040] rounded-b">
                        <div className="bg-[#353535] p-3 rounded">
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="flex justify-between">
                              <span className="text-[#aaa]">Quantidade:</span>
                              <span className="text-white font-bold">{loteFracionadoQtd}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-[#aaa]">Preço:</span>
                              <span className="text-white font-bold">{precoFracionado.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-[#aaa]">Subtotal:</span>
                              <span className="text-white font-bold">{totalLoteFracionado.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-[#aaa]">Taxa:</span>
                              <span className="text-white font-bold">{taxaLoteFracionado.toFixed(2)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Resumo da Operação - Card Unificado */}
              <div className="bg-[#353535] p-3 rounded mb-4 border-b border-[#404040]">
                <div className="flex justify-between mb-2">
                  <div className="text-xs text-[#aaa]">Tipo de Preço:</div>
                  <div className="text-xs font-bold text-white">{tipoPreco}</div>
                </div>
                <div className="flex justify-between mb-2">
                  <div className="text-xs text-[#aaa]">Validade:</div>
                  <div className="text-xs font-bold text-white">{validade}</div>
                </div>
                <div className="flex justify-between mb-3">
                  <div className="text-xs text-[#aaa]">Data:</div>
                  <div className="text-xs font-bold text-white">{dataValidade}</div>
                </div>

                {/* Adicionar esta nova linha */}
                <div className="flex justify-between mb-3">
                  <div className="text-xs text-[#aaa]">Total de Ativos:</div>
                  <div className="text-xs font-bold text-white">{quantidade}</div>
                </div>

                {/* Linha separadora */}
                <div className="border-b border-[#404040] mb-3"></div>

                {/* Total Geral */}
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-bold text-white">TOTAL GERAL</span>
                  <span className="text-lg font-bold text-white">{totalComTaxas.toFixed(2)}</span>
                </div>
                <div className="text-xs text-[#aaa]">
                  Valor da operação: {totalGeral.toFixed(2)} + Taxas: {totalTaxas.toFixed(2)}
                </div>
              </div>

              {/* Assinatura Eletrônica */}
              <div className="mb-4">
                <label className="block text-xs font-semibold text-[#aaa] mb-1">ASSINATURA ELETRÔNICA</label>
                <div className="relative">
                  <div className="relative flex items-center">
                    <input
                      ref={confirmationInputRef}
                      type="password"
                      value={confirmationState.assinatura}
                      onChange={handleAssinaturaChange}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && e.ctrlKey) {
                          e.preventDefault()
                          executarOrdem()
                        }
                      }}
                      className="w-full bg-[#353535] border border-[#404040] rounded px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#F7941E] pr-16"
                      placeholder="Digite sua assinatura eletrônica"
                    />
                    <div className="absolute right-2 flex items-center">
                      <div className="flex items-center gap-1">
                        <span className="text-[10px] text-[#aaa] mr-1">Salvar</span>
                        <button
                          type="button"
                          onClick={toggleSalvarSenha}
                          className={`relative inline-flex h-3.5 w-6 items-center rounded-full transition-colors focus:outline-none focus:ring-1 focus:ring-[#F7941E] ${
                            confirmationState.salvarSenha ? "bg-[#F7941E]" : "bg-[#555]"
                          }`}
                          aria-pressed={confirmationState.salvarSenha}
                          aria-labelledby="salvar-senha-label"
                        >
                          <span
                            className={`inline-block h-2.5 w-2.5 transform rounded-full bg-white transition-transform ${
                              confirmationState.salvarSenha ? "translate-x-3" : "translate-x-0.5"
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-[#666] mt-1 text-right">
                    Pressione Ctrl + Enter para confirmar rapidamente
                  </div>
                </div>
              </div>

              {/* Botões de ação */}
              <div className="flex justify-end gap-2">
                <button
                  className="px-3 py-1 bg-[#444] hover:bg-[#555] text-white transition-colors text-xs"
                  onClick={voltarParaBoleta}
                >
                  Voltar
                </button>
                <button
                  className={`px-3 py-1 transition-colors font-semibold text-xs ${
                    tipoAtual === "comprar"
                      ? "bg-green-600 hover:bg-green-700 text-white"
                      : "bg-red-600 hover:bg-red-700 text-white"
                  }`}
                  onClick={executarOrdem}
                >
                  Confirmar {tipoAtual === "comprar" ? "Compra" : "Venda"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Componente StockFinder */}
      <StockFinder
        isOpen={showStockFinder}
        onClose={() => setShowStockFinder(false)}
        onSelectStock={handleSelectStock}
      />
    </div>
  )
}

export default Boleta
