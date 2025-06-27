"use client"

import { useState, useEffect, useRef } from "react"

const SysUsers = ({ isOpen, onClose, onSelectUser }) => {
  // Lista de usuários disponíveis com tipo adicionado
  const users = [
    {
      id: "11105",
      name: "Equipe de Desenvolvimento",
      initials: "ED",
      color: "#F7941E",
      description: "Usuário atual",
      isCurrent: true,
      type: "admin", // Tipo de usuário: admin, gestor, user
    },
    {
      id: "11106",
      name: "Administrador",
      initials: "AD",
      color: "#00AEEF",
      description: "Perfil administrativo",
      isCurrent: false,
      type: "gestor",
    },
    {
      id: "11107",
      name: "Teste",
      initials: "TE",
      color: "#8CC63F",
      description: "Ambiente de testes",
      isCurrent: false,
      type: "user",
    },
    {
      id: "11108",
      name: "Suporte Técnico",
      initials: "ST",
      color: "#9B59B6",
      description: "Equipe de suporte",
      isCurrent: false,
      type: "gestor",
    },
    {
      id: "11109",
      name: "Financeiro",
      initials: "FI",
      color: "#E74C3C",
      description: "Departamento financeiro",
      isCurrent: false,
      type: "user",
    },
    {
      id: "11110",
      name: "Marketing",
      initials: "MK",
      color: "#FF6B6B",
      description: "Equipe de marketing",
      isCurrent: false,
      type: "user",
    },
    {
      id: "11111",
      name: "Vendas",
      initials: "VE",
      color: "#4ECDC4",
      description: "Departamento de vendas",
      isCurrent: false,
      type: "gestor",
    },
    {
      id: "11112",
      name: "Recursos Humanos",
      initials: "RH",
      color: "#45B7D1",
      description: "Gestão de pessoas",
      isCurrent: false,
      type: "admin",
    },
    {
      id: "11113",
      name: "Operações",
      initials: "OP",
      color: "#96CEB4",
      description: "Controle operacional",
      isCurrent: false,
      type: "gestor",
    },
    {
      id: "11114",
      name: "Compliance",
      initials: "CP",
      color: "#FFEAA7",
      description: "Conformidade e auditoria",
      isCurrent: false,
      type: "admin",
    },
  ]

  const [activeTab, setActiveTab] = useState("favoritos") // Favoritos como primeira aba
  const [favorites, setFavorites] = useState(["11105", "11106"]) // IDs dos favoritos
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedIndex, setSelectedIndex] = useState(0) // Índice do item selecionado para navegação por teclado
  const contentRef = useRef(null)

  // Função para obter a cor do badge baseado no tipo de usuário
  const getTypeBadgeColor = (type) => {
    switch (type) {
      case "admin":
        return "bg-red-500"
      case "gestor":
        return "bg-blue-500"
      case "user":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  // Função para obter o texto do tipo de usuário formatado
  const getTypeText = (type) => {
    switch (type) {
      case "admin":
        return "Admin"
      case "gestor":
        return "Gestor"
      case "user":
        return "Usuário"
      default:
        return type
    }
  }

  const handleSelectUser = (userId, userName) => {
    if (onSelectUser) {
      onSelectUser(userId, userName)
    }
    onClose()
  }

  // Função para alternar favoritos (usado para o botão de estrela)
  const toggleFavorite = (userId, e) => {
    e?.stopPropagation()
    setFavorites((prev) => (prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]))
  }

  // Função para adicionar aos favoritos (usado com a seta direita)
  const addToFavorites = (userId) => {
    if (!favorites.includes(userId)) {
      setFavorites((prev) => [...prev, userId])
    }
  }

  // Função para remover dos favoritos (usado com a seta esquerda)
  const removeFromFavorites = (userId) => {
    if (favorites.includes(userId)) {
      setFavorites((prev) => prev.filter((id) => id !== userId))
    }
  }

  const getFilteredUsers = () => {
    let filtered = users

    // Filtrar por aba
    if (activeTab === "favoritos") {
      filtered = filtered.filter((user) => favorites.includes(user.id))
    }

    // Filtrar por termo de busca
    if (searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (user) =>
          user.name.toLowerCase().includes(term) ||
          user.id.includes(term) ||
          user.description.toLowerCase().includes(term),
      )
    }

    return filtered
  }

  // Resetar scroll quando mudar de aba
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = 0
    }
    setSelectedIndex(0) // Resetar seleção quando mudar de aba
  }, [activeTab])

  // Resetar índice selecionado quando a lista filtrada mudar
  useEffect(() => {
    const filteredUsers = getFilteredUsers()
    if (selectedIndex >= filteredUsers.length) {
      setSelectedIndex(Math.max(0, filteredUsers.length - 1))
    }
  }, [searchTerm, activeTab, favorites])

  // Adicionar event listener para a tecla ESC e navegação por teclado
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose()
        return
      }

      const filteredUsers = getFilteredUsers()
      if (filteredUsers.length === 0) return

      switch (event.key) {
        case "ArrowDown":
          event.preventDefault()
          setSelectedIndex((prev) => (prev + 1) % filteredUsers.length)
          break
        case "ArrowUp":
          event.preventDefault()
          setSelectedIndex((prev) => (prev - 1 + filteredUsers.length) % filteredUsers.length)
          break
        case "ArrowRight":
          event.preventDefault()
          // Adicionar aos favoritos (sem remover se já estiver)
          if (filteredUsers[selectedIndex]) {
            addToFavorites(filteredUsers[selectedIndex].id)
          }
          break
        case "ArrowLeft":
          event.preventDefault()
          // Remover dos favoritos (sem efeito se não estiver)
          if (filteredUsers[selectedIndex]) {
            removeFromFavorites(filteredUsers[selectedIndex].id)
          }
          break
        case "Enter":
          event.preventDefault()
          // Selecionar usuário
          if (filteredUsers[selectedIndex]) {
            handleSelectUser(filteredUsers[selectedIndex].id, filteredUsers[selectedIndex].name)
          }
          break
      }
    }

    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown)
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [isOpen, onClose, selectedIndex, favorites, searchTerm, activeTab])

  // Scroll automático para o item selecionado
  useEffect(() => {
    if (contentRef.current && isOpen) {
      const selectedElement = contentRef.current.children[selectedIndex]
      if (selectedElement) {
        selectedElement.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        })
      }
    }
  }, [selectedIndex, isOpen])

  if (!isOpen) return null

  const filteredUsers = getFilteredUsers()

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center" onClick={onClose}>
      <div
        className="bg-[#2a2a2a] rounded-lg w-[500px] h-[600px] border border-[#404040] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-[#404040] flex justify-between items-center">
          <h3 className="text-lg font-bold text-white">Troca de Perfil</h3>
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#aaa]">Shift+U</span>
            <button className="text-[#aaa] hover:text-white" onClick={onClose}>
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
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>

        {/* Barra de pesquisa */}
        <div className="px-4 pt-4 pb-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar usuário..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#353535] border border-[#404040] rounded px-3 py-2 text-white focus:outline-none focus:border-[#F7941E]"
            />
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
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#aaa]"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          </div>
        </div>

        {/* Sistema de Abas */}
        <div className="px-4">
          <div className="flex border-b border-[#404040]">
            <button
              className={`px-4 py-2 text-sm font-semibold transition-colors relative ${
                activeTab === "favoritos" ? "text-[#F7941E]" : "text-[#aaa] hover:text-white"
              }`}
              onClick={() => setActiveTab("favoritos")}
            >
              Favoritos
              {favorites.length > 0 && (
                <span className="ml-1 bg-[#F7941E] text-white text-xs px-1.5 py-0.5 rounded-full">
                  {favorites.length}
                </span>
              )}
              {activeTab === "favoritos" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#F7941E]"></div>}
            </button>
            <button
              className={`px-4 py-2 text-sm font-semibold transition-colors relative ${
                activeTab === "contas" ? "text-[#F7941E]" : "text-[#aaa] hover:text-white"
              }`}
              onClick={() => setActiveTab("contas")}
            >
              Contas
              {activeTab === "contas" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#F7941E]"></div>}
            </button>
          </div>
        </div>

        {/* Instruções de navegação */}
        <div className="px-4 py-2 bg-[#1a1a1a] border-b border-[#404040]">
          <div className="text-xs text-[#666] flex items-center justify-center gap-4">
            <span>↑↓ Navegar</span>
            <span>→ Favoritar</span>
            <span>← Desfavoritar</span>
            <span>Enter Selecionar</span>
            <span>Esc Fechar</span>
          </div>
        </div>

        {/* Conteúdo com scroll */}
        <div ref={contentRef} className="flex-1 overflow-y-auto p-4 space-y-3">
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user, index) => (
              <div
                key={user.id}
                className={`p-3 rounded cursor-pointer transition-colors ${
                  user.isCurrent
                    ? "bg-[#1a1a1a] border-l-4 border-[#F7941E]"
                    : index === selectedIndex
                      ? "bg-[#404040] border-l-4 border-[#F7941E]"
                      : "bg-[#353535] hover:bg-[#404040]"
                }`}
                onClick={() => handleSelectUser(user.id, user.name)}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{
                      backgroundColor: user.isCurrent ? user.color : "#666666",
                    }}
                  >
                    <span className="text-white text-sm font-bold">{user.initials}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="font-bold text-white truncate">{user.name}</div>
                        {user.isCurrent && (
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-[#F7941E] flex-shrink-0"
                            title="Usuário atual"
                          >
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => toggleFavorite(user.id, e)}
                          className="text-[#aaa] hover:text-[#F7941E] transition-colors"
                          title={favorites.includes(user.id) ? "Remover dos favoritos" : "Adicionar aos favoritos"}
                        >
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill={favorites.includes(user.id) ? "#F7941E" : "none"}
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
                          </svg>
                        </button>
                        <span
                          className={`text-xs text-white px-2 py-0.5 rounded font-medium ${getTypeBadgeColor(user.type)}`}
                        >
                          {getTypeText(user.type)}
                        </span>
                      </div>
                    </div>
                    <div className="text-xs text-[#aaa] mt-1">
                      {user.id} - {user.description}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              {searchTerm ? (
                <>
                  <svg
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mx-auto mb-3 text-[#666]"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.35-4.35" />
                  </svg>
                  <p className="text-[#666] text-sm">Nenhum resultado encontrado</p>
                  <p className="text-[#888] text-xs mt-1">Tente buscar por outro termo ou verifique a ortografia</p>
                </>
              ) : (
                <>
                  <svg
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mx-auto mb-3 text-[#666]"
                  >
                    <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
                  </svg>
                  <p className="text-[#666] text-sm">Nenhuma conta favoritada</p>
                  <p className="text-[#888] text-xs mt-1">
                    Clique na estrela ao lado de uma conta para adicioná-la aos favoritos
                  </p>
                </>
              )}
            </div>
          )}
        </div>

        {/* Footer fixo */}
        <div className="p-4 border-t border-[#404040] bg-[#2a2a2a] flex justify-end gap-2">
          <button
            className="px-4 py-2 bg-[#444] hover:bg-[#555] rounded transition-colors text-white"
            onClick={onClose}
          >
            Cancelar
          </button>
          <button
            className="px-4 py-2 bg-[#F7941E] hover:bg-[#e8850e] rounded transition-colors text-white"
            onClick={() => {
              if (filteredUsers[selectedIndex]) {
                handleSelectUser(filteredUsers[selectedIndex].id, filteredUsers[selectedIndex].name)
              }
            }}
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  )
}

export default SysUsers
