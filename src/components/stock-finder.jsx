"use client"
import { useState, useEffect, useRef } from "react"

const StockFinder = ({ isOpen, onClose, onSelectStock, initialMercadoFilter = null, initialOrigemFilter = null }) => {
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(3)
  const [totalPages, setTotalPages] = useState(10)
  const [mercadoFilter, setMercadoFilter] = useState(initialMercadoFilter ? [initialMercadoFilter] : [])
  const [origemFilter, setOrigemFilter] = useState(initialOrigemFilter ? [initialOrigemFilter] : [])
  const [showMercadoDropdown, setShowMercadoDropdown] = useState(false)
  const [showOrigemDropdown, setShowOrigemDropdown] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const [showSearchResults, setShowSearchResults] = useState(true) // Sempre mostrar resultados
  const [destaqueTab, setDestaqueTab] = useState("altas")
  const [favoriteStocks, setFavoriteStocks] = useState(new Set(["MGLU3", "PETR4", "VALE3"])) // Alguns favoritos iniciais
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false)
  const searchInputRef = useRef(null)
  const tableBodyRef = useRef(null)

  // Dados simulados baseados na imagem
  const allStocks = [
    {
      id: "1",
      codigo: "SOJA1",
      descricao: "SOJA MERCANTIL",
      mercado: "VISTA",
      origem: "BOV",
      ultimoPreco: 45.32,
      variacao: 0.15,
      percentualVariacao: 0.33,
      volume: 1250000,
    },
    {
      id: "2",
      codigo: "SOJA2",
      descricao: "SOJA MERCANTIL FRACIONÁRIO",
      mercado: "FRACIONÁRIO",
      origem: "BOV",
      ultimoPreco: 45.35,
      variacao: 0.18,
      percentualVariacao: 0.4,
      volume: 850000,
    },
    {
      id: "3",
      codigo: "SOJA3",
      descricao: "SOJA MERCANTIL TERMO",
      mercado: "TERMO",
      origem: "BOV",
      ultimoPreco: 45.28,
      variacao: 0.11,
      percentualVariacao: 0.24,
      volume: 650000,
    },
    {
      id: "4",
      codigo: "SOJA4",
      descricao: "SOJA MERCANTIL VOLUME",
      mercado: "VOLUME",
      origem: "BOV",
      ultimoPreco: 45.4,
      variacao: 0.23,
      percentualVariacao: 0.51,
      volume: 2100000,
    },
    {
      id: "5",
      codigo: "SOJAF",
      descricao: "SOJA FUTURES",
      mercado: "OUTROS",
      origem: "BOV",
      ultimoPreco: 45.25,
      variacao: 0.08,
      percentualVariacao: 0.18,
      volume: 450000,
    },
    {
      id: "6",
      codigo: "SOJB",
      descricao: "SOJA BRASIL",
      mercado: "VISTA",
      origem: "BOV",
      ultimoPreco: 45.38,
      variacao: 0.21,
      percentualVariacao: 0.46,
      volume: 980000,
    },
    {
      id: "7",
      codigo: "SOJA.N",
      descricao: "SOJA NASDAQ",
      mercado: "VISTA",
      origem: "NASDAQ",
      ultimoPreco: 45.42,
      variacao: 0.25,
      percentualVariacao: 0.55,
      volume: 1800000,
    },
    {
      id: "8",
      codigo: "SOJA.SR",
      descricao: "SOJA SAFRAS",
      mercado: "VISTA",
      origem: "SR",
      ultimoPreco: 45.3,
      variacao: 0.13,
      percentualVariacao: 0.29,
      volume: 720000,
    },
    {
      id: "9",
      codigo: "SOJC",
      descricao: "SOJA COMMODITY",
      mercado: "OUTROS",
      origem: "BOV",
      ultimoPreco: 45.35,
      variacao: 0.18,
      percentualVariacao: 0.4,
      volume: 560000,
    },
    {
      id: "10",
      codigo: "SOJD",
      descricao: "SOJA DERIVATIVOS",
      mercado: "OUTROS",
      origem: "BOV",
      ultimoPreco: 45.33,
      variacao: 0.16,
      percentualVariacao: 0.35,
      volume: 890000,
    },
    {
      id: "11",
      codigo: "MGLU3",
      descricao: "MAGAZ LUIZA ON ED NM",
      mercado: "VISTA",
      origem: "BOV",
      ultimoPreco: 25.8,
      variacao: 0.29,
      percentualVariacao: 1.14,
      volume: 15600000,
    },
    {
      id: "12",
      codigo: "MGLUF",
      descricao: "MAGAZ LUIZA ON ED NM FRACIONÁRIO",
      mercado: "FRACIONÁRIO",
      origem: "BOV",
      ultimoPreco: 25.82,
      variacao: 0.31,
      percentualVariacao: 1.22,
      volume: 2400000,
    },
    {
      id: "13",
      codigo: "PETR4",
      descricao: "PETROBRAS PN N2",
      mercado: "VISTA",
      origem: "BOV",
      ultimoPreco: 32.45,
      variacao: -0.15,
      percentualVariacao: -0.46,
      volume: 28900000,
    },
    {
      id: "14",
      codigo: "PETR3",
      descricao: "PETROBRAS ON N2",
      mercado: "VISTA",
      origem: "BOV",
      ultimoPreco: 31.8,
      variacao: -0.12,
      percentualVariacao: -0.38,
      volume: 18700000,
    },
    {
      id: "15",
      codigo: "PETRF",
      descricao: "PETROBRAS PN N2 FRACIONÁRIO",
      mercado: "FRACIONÁRIO",
      origem: "BOV",
      ultimoPreco: 32.47,
      variacao: -0.13,
      percentualVariacao: -0.4,
      volume: 3200000,
    },
    {
      id: "16",
      codigo: "VALE3",
      descricao: "VALE ON NM",
      mercado: "VISTA",
      origem: "BOV",
      ultimoPreco: 68.9,
      variacao: 0.85,
      percentualVariacao: 1.25,
      volume: 22100000,
    },
    {
      id: "17",
      codigo: "ITUB4",
      descricao: "ITAUUNIBANCO PN N1",
      mercado: "VISTA",
      origem: "BOV",
      ultimoPreco: 28.75,
      variacao: 0.42,
      percentualVariacao: 1.48,
      volume: 19800000,
    },
    {
      id: "18",
      codigo: "BBDC4",
      descricao: "BRADESCO PN N1",
      mercado: "VISTA",
      origem: "BOV",
      ultimoPreco: 15.25,
      variacao: 0.18,
      percentualVariacao: 1.2,
      volume: 12300000,
    },
    {
      id: "19",
      codigo: "ABEV3",
      descricao: "AMBEV S/A ON",
      mercado: "VISTA",
      origem: "BOV",
      ultimoPreco: 14.85,
      variacao: -0.05,
      percentualVariacao: -0.34,
      volume: 8900000,
    },
    {
      id: "20",
      codigo: "WEGE3",
      descricao: "WEG ON NM",
      mercado: "VISTA",
      origem: "BOV",
      ultimoPreco: 42.15,
      variacao: 0.65,
      percentualVariacao: 1.57,
      volume: 5600000,
    },
  ]

  // Opções para os filtros
  const mercadoOptions = ["VISTA", "FRACIONÁRIO", "TERMO", "VOLUME", "OUTROS"]
  const origemOptions = ["BOV", "NASDAQ", "SR"]

  // Filtrar os ativos com base nos filtros selecionados
  const filteredStocks = allStocks.filter((stock) => {
    const matchesSearch =
      stock.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stock.descricao.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesMercado = mercadoFilter.length > 0 ? mercadoFilter.includes(stock.mercado) : true
    const matchesOrigem = origemFilter.length > 0 ? origemFilter.includes(stock.origem) : true
    const matchesFavorites = showOnlyFavorites ? favoriteStocks.has(stock.codigo) : true

    return matchesSearch && matchesMercado && matchesOrigem && matchesFavorites
  })

  // Função para selecionar um ativo diretamente
  const selectSingleStock = (stock) => {
    onSelectStock(stock)
    onClose()
  }

  // Função para favoritar/desfavoritar um ativo
  const toggleFavorite = (codigo, e) => {
    e.stopPropagation() // Evitar que clique na linha
    const newFavorites = new Set(favoriteStocks)
    if (newFavorites.has(codigo)) {
      newFavorites.delete(codigo)
    } else {
      newFavorites.add(codigo)
    }
    setFavoriteStocks(newFavorites)
  }

  // Função para navegar para a página anterior
  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  // Função para navegar para a próxima página
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  // Função para fazer scroll até o item destacado
  const scrollToHighlightedItem = (index) => {
    if (tableBodyRef.current && index >= 0) {
      const rows = tableBodyRef.current.querySelectorAll("tr")
      if (rows[index]) {
        rows[index].scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        })
      }
    }
  }

  // Função para lidar com navegação por teclado
  const handleKeyNavigation = (e) => {
    if (filteredStocks.length === 0) return

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault()
        const nextIndex = highlightedIndex < filteredStocks.length - 1 ? highlightedIndex + 1 : 0
        setHighlightedIndex(nextIndex)
        scrollToHighlightedItem(nextIndex)
        break

      case "ArrowUp":
        e.preventDefault()
        const prevIndex = highlightedIndex > 0 ? highlightedIndex - 1 : filteredStocks.length - 1
        setHighlightedIndex(prevIndex)
        scrollToHighlightedItem(prevIndex)
        break

      case "ArrowRight":
        e.preventDefault()
        if (highlightedIndex >= 0 && highlightedIndex < filteredStocks.length) {
          // Favoritar o ativo destacado
          const stockCode = filteredStocks[highlightedIndex].codigo
          if (!favoriteStocks.has(stockCode)) {
            const newFavorites = new Set(favoriteStocks)
            newFavorites.add(stockCode)
            setFavoriteStocks(newFavorites)
          }
        }
        break

      case "ArrowLeft":
        e.preventDefault()
        if (highlightedIndex >= 0 && highlightedIndex < filteredStocks.length) {
          // Remover dos favoritos o ativo destacado
          const stockCode = filteredStocks[highlightedIndex].codigo
          if (favoriteStocks.has(stockCode)) {
            const newFavorites = new Set(favoriteStocks)
            newFavorites.delete(stockCode)
            setFavoriteStocks(newFavorites)
          }
        }
        break

      case "Enter":
        e.preventDefault()
        if (highlightedIndex >= 0 && highlightedIndex < filteredStocks.length) {
          const selectedStock = filteredStocks[highlightedIndex]
          selectSingleStock(selectedStock)
        }
        break

      default:
        break
    }
  }

  // Função para realizar a busca
  const handleSearch = () => {
    if (searchInputRef.current) {
      searchInputRef.current.focus()
    }
    // Aqui você pode adicionar lógica adicional para a busca se necessário
  }

  // Resetar o índice destacado quando os filtros mudarem
  useEffect(() => {
    setHighlightedIndex(-1)
  }, [searchTerm, mercadoFilter, origemFilter, showOnlyFavorites])

  // Focar no campo de busca quando o componente abrir - SEMPRE
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus()
      }, 100)
    }
  }, [isOpen])

  // Fechar o componente ao pressionar ESC
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose()
      } else {
        handleKeyNavigation(e)
      }
    }

    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown)
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [isOpen, onClose, highlightedIndex, filteredStocks])

  // Fechar dropdowns quando clicar fora
  useEffect(() => {
    const handleClickOutside = () => {
      setShowMercadoDropdown(false)
      setShowOrigemDropdown(false)
    }

    if (isOpen) {
      document.addEventListener("click", handleClickOutside)
    }

    return () => {
      document.removeEventListener("click", handleClickOutside)
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[10000] flex items-center justify-center" onClick={onClose}>
      <div
        className="bg-[#2a2a2a] rounded-lg w-[1000px] max-h-[75vh] overflow-hidden shadow-xl border border-[#404040] relative z-[10001]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#1e1e1e] px-3 py-2 border-b border-[#404040] rounded-t-lg flex justify-between items-center">
          <div className="flex items-center flex-1">
            {/* Input de busca com filtros integrados - 100% width */}
            <div className="relative flex-1">
              <div className="relative flex-1">
                {/* Ícone de lupa integrado ao input */}
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
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
                    className="text-[#aaa]"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.35-4.35" />
                  </svg>
                </div>

                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-[#353535] border border-[#404040] text-white text-sm rounded-lg block w-full pl-10 pr-32 p-1.5 focus:outline-none focus:ring-1 focus:ring-[#F7941E]"
                  placeholder="Buscar ativo..."
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSearch()
                    }
                  }}
                />

                {/* Filtros no lado direito do input */}
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 gap-1">
                  {/* Filtro MERCADO integrado */}
                  <div className="relative">
                    <button
                      className="flex items-center gap-1 px-2 py-0.5 bg-[#444] hover:bg-[#555] text-white text-xs rounded transition-colors"
                      onClick={(e) => {
                        e.stopPropagation()
                        setShowMercadoDropdown(!showMercadoDropdown)
                        setShowOrigemDropdown(false)
                      }}
                    >
                      <span>MERCADO</span>
                      {mercadoFilter.length > 0 && (
                        <span className="bg-[#F7941E] text-white px-1 rounded text-[10px]">{mercadoFilter.length}</span>
                      )}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="10"
                        height="10"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className={`transition-transform ${showMercadoDropdown ? "rotate-180" : ""}`}
                      >
                        <path d="m6 9 6 6 6-6" />
                      </svg>
                    </button>

                    {showMercadoDropdown && (
                      <div className="absolute top-full right-0 mt-1 w-44 bg-[#353535] rounded-lg shadow-lg z-[10002] border border-[#404040]">
                        <div className="p-2">
                          {/* Opções de seleção em massa */}
                          <div className="flex gap-1 mb-2 pb-2 border-b border-[#404040]">
                            <button
                              className="flex-1 text-xs px-2 py-1 bg-[#444] hover:bg-[#555] text-white rounded transition-colors"
                              onClick={() => setMercadoFilter([...mercadoOptions])}
                            >
                              Todos
                            </button>
                            <button
                              className="flex-1 text-xs px-2 py-1 bg-[#444] hover:bg-[#555] text-white rounded transition-colors"
                              onClick={() => setMercadoFilter([])}
                            >
                              Limpar
                            </button>
                          </div>

                          {/* Checkboxes para cada opção */}
                          {mercadoOptions.map((mercado) => (
                            <label
                              key={mercado}
                              className="flex items-center px-2 py-1 hover:bg-[#404040] rounded cursor-pointer"
                            >
                              <input
                                type="checkbox"
                                checked={mercadoFilter.includes(mercado)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setMercadoFilter([...mercadoFilter, mercado])
                                  } else {
                                    setMercadoFilter(mercadoFilter.filter((m) => m !== mercado))
                                  }
                                }}
                                className="mr-2 accent-[#F7941E]"
                              />
                              <span className="text-xs text-white">{mercado}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Filtro ORIGEM integrado */}
                  <div className="relative">
                    <button
                      className="flex items-center gap-1 px-2 py-0.5 bg-[#444] hover:bg-[#555] text-white text-xs rounded transition-colors"
                      onClick={(e) => {
                        e.stopPropagation()
                        setShowOrigemDropdown(!showOrigemDropdown)
                        setShowMercadoDropdown(false)
                      }}
                    >
                      <span>ORIGEM</span>
                      {origemFilter.length > 0 && (
                        <span className="bg-[#F7941E] text-white px-1 rounded text-[10px]">{origemFilter.length}</span>
                      )}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="10"
                        height="10"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className={`transition-transform ${showOrigemDropdown ? "rotate-180" : ""}`}
                      >
                        <path d="m6 9 6 6 6-6" />
                      </svg>
                    </button>

                    {showOrigemDropdown && (
                      <div className="absolute top-full right-0 mt-1 w-36 bg-[#353535] rounded-lg shadow-lg z-[10002] border border-[#404040]">
                        <div className="p-2">
                          {/* Opções de seleção em massa */}
                          <div className="flex gap-1 mb-2 pb-2 border-b border-[#404040]">
                            <button
                              className="flex-1 text-xs px-2 py-1 bg-[#444] hover:bg-[#555] text-white rounded transition-colors"
                              onClick={() => setOrigemFilter([...origemOptions])}
                            >
                              Todas
                            </button>
                            <button
                              className="flex-1 text-xs px-2 py-1 bg-[#444] hover:bg-[#555] text-white rounded transition-colors"
                              onClick={() => setOrigemFilter([])}
                            >
                              Limpar
                            </button>
                          </div>

                          {/* Checkboxes para cada opção */}
                          {origemOptions.map((origem) => (
                            <label
                              key={origem}
                              className="flex items-center px-2 py-1 hover:bg-[#404040] rounded cursor-pointer"
                            >
                              <input
                                type="checkbox"
                                checked={origemFilter.includes(origem)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setOrigemFilter([...origemFilter, origem])
                                  } else {
                                    setOrigemFilter(origemFilter.filter((o) => o !== origem))
                                  }
                                }}
                                className="mr-2 accent-[#F7941E]"
                              />
                              <span className="text-xs text-white">{origem}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <button className="ml-3 p-1 hover:bg-[#3a3a3a] rounded transition-colors" onClick={onClose} title="Fechar">
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
              className="text-[#aaa] hover:text-white"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Paginação */}
        <div className="bg-[#353535] px-3 py-1.5 border-b border-[#404040] flex justify-between items-center">
          <div className="flex items-center gap-2 text-xs text-[#aaa]">
            <button
              className="p-0.5 hover:bg-[#404040] rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={goToPreviousPage}
              disabled={currentPage <= 1}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={currentPage <= 1 ? "text-[#555]" : "text-[#aaa]"}
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
            </button>

            <span className="text-xs">
              {currentPage} de {totalPages}
            </span>

            <button
              className="p-0.5 hover:bg-[#404040] rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={goToNextPage}
              disabled={currentPage >= totalPages}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={currentPage >= totalPages ? "text-[#555]" : "text-[#aaa]"}
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>
          </div>

          <div className="text-xs text-[#aaa]">
            {filteredStocks.length} resultado{filteredStocks.length !== 1 ? "s" : ""}
          </div>
        </div>

        {/* Instruções de uso */}
        <div className="bg-[#2e2e2e] px-3 py-1.5 border-b border-[#404040] flex justify-between items-center">
          <div className="text-xs text-[#aaa] flex items-center gap-3">
            <span>💡 ↑↓ Navegar</span>
            <span>→ Favoritar</span>
            <span>← Desfavoritar</span>
            <span>Enter Selecionar</span>
            <span>Esc Fechar</span>
          </div>

          {/* Botão Favoritos */}
          <button
            className={`flex items-center gap-1.5 px-2 py-1 text-xs rounded transition-colors ${
              showOnlyFavorites ? "bg-[#F7941E] text-white" : "bg-[#353535] hover:bg-[#404040] text-white"
            }`}
            onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
            title={showOnlyFavorites ? "Mostrar todos os ativos" : "Mostrar apenas favoritos"}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill={showOnlyFavorites ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
            </svg>
            <span>Favoritos</span>
            {favoriteStocks.size > 0 && (
              <span className="bg-[#555] text-white px-1 py-0.5 rounded-full text-[10px]">{favoriteStocks.size}</span>
            )}
          </button>
        </div>

        {/* Tabela de ativos */}
        <div className="overflow-y-auto max-h-[45vh]">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-[#aaa] uppercase bg-[#2e2e2e] sticky top-0">
              <tr>
                <th scope="col" className="px-2 py-2 w-8">
                  ⭐
                </th>
                <th scope="col" className="px-2 py-2">
                  ATIVO
                </th>
                <th scope="col" className="px-2 py-2 text-right">
                  PREÇO
                </th>
                <th scope="col" className="px-2 py-2 text-right">
                  VARIAÇÃO
                </th>
                <th scope="col" className="px-2 py-2 text-right">
                  VOLUME
                </th>
                <th scope="col" className="px-2 py-2">
                  DESCRIÇÃO
                </th>
                <th scope="col" className="px-2 py-2">
                  MERCADO
                </th>
                <th scope="col" className="px-2 py-2">
                  ORIGEM
                </th>
              </tr>
            </thead>
            <tbody ref={tableBodyRef}>
              {filteredStocks.map((stock, index) => {
                const isHighlighted = index === highlightedIndex
                const isFavorite = favoriteStocks.has(stock.codigo)

                return (
                  <tr
                    key={stock.id}
                    className={`border-b border-[#404040] cursor-pointer transition-colors ${
                      isHighlighted ? "bg-[#F7941E] text-black" : "bg-[#2a2a2a] hover:bg-[#353535]"
                    }`}
                    onClick={() => selectSingleStock(stock)}
                  >
                    <td className="px-2 py-2">
                      <button
                        onClick={(e) => toggleFavorite(stock.codigo, e)}
                        className={`p-0.5 rounded hover:bg-[#404040] transition-colors ${
                          isHighlighted ? "hover:bg-black/20" : ""
                        }`}
                        title={isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill={isHighlighted ? (isFavorite ? "black" : "none") : isFavorite ? "#F7941E" : "none"}
                          stroke={isHighlighted ? "black" : isFavorite ? "#F7941E" : "#aaa"}
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
                        </svg>
                      </button>
                    </td>
                    <td className={`px-2 py-2 font-bold ${isHighlighted ? "text-black" : "text-white"}`}>
                      {stock.codigo}
                    </td>
                    <td className={`px-2 py-2 text-right font-bold ${isHighlighted ? "text-black" : "text-white"}`}>
                      {stock.ultimoPreco.toFixed(2)}
                    </td>
                    <td
                      className={`px-2 py-2 text-right ${isHighlighted ? "text-black" : stock.variacao >= 0 ? "text-green-400" : "text-red-400"}`}
                    >
                      <div className="flex flex-col items-end">
                        <span className="font-bold text-xs">
                          {stock.variacao >= 0 ? "+" : ""}
                          {stock.variacao.toFixed(2)}
                        </span>
                        <span className="text-[10px]">
                          {stock.percentualVariacao >= 0 ? "+" : ""}
                          {stock.percentualVariacao.toFixed(2)}%
                        </span>
                      </div>
                    </td>
                    <td className={`px-2 py-2 text-right text-xs ${isHighlighted ? "text-black" : "text-[#ccc]"}`}>
                      {(stock.volume / 1000000).toFixed(1)}M
                    </td>
                    <td
                      className={`px-2 py-2 text-xs ${isHighlighted ? "text-black" : "text-[#ddd]"} truncate max-w-[200px]`}
                    >
                      {stock.descricao}
                    </td>
                    <td className={`px-2 py-2 text-xs ${isHighlighted ? "text-black" : "text-[#aaa]"}`}>
                      {stock.mercado}
                    </td>
                    <td className={`px-2 py-2 text-xs ${isHighlighted ? "text-black" : "text-[#aaa]"}`}>
                      {stock.origem}
                    </td>
                  </tr>
                )
              })}

              {filteredStocks.length === 0 && (
                <tr className="bg-[#2a2a2a]">
                  <td colSpan={8} className="px-4 py-6 text-center text-[#aaa]">
                    <div className="flex flex-col items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mb-2"
                      >
                        {showOnlyFavorites ? (
                          <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
                        ) : (
                          <>
                            <circle cx="11" cy="11" r="8" />
                            <path d="m21 21-4.35-4.35" />
                          </>
                        )}
                      </svg>
                      <div className="text-sm">
                        {showOnlyFavorites
                          ? "Nenhum ativo favoritado"
                          : searchTerm
                            ? `Nenhum ativo encontrado para "${searchTerm}"`
                            : "Nenhum ativo encontrado"}
                      </div>
                      <div className="text-xs mt-1">
                        {showOnlyFavorites
                          ? "Favorite alguns ativos clicando na estrela"
                          : "Tente ajustar os filtros ou termo de busca"}
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default StockFinder
