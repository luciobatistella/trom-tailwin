"use client"
import { useState, useEffect } from "react"
import { usePatrimonio } from "../context/patrimonioContext"
import { useAlarme } from "../context/alarmeContext"
import { formatCurrency } from "../utils/formatCurrency"
import Boleta from "./Boleta"
import SysUsers from "./sys-users"
import AlarmIcon from "./alarm-icon"
import AlarmManager from "./alarm-manager"
import Yzzy from "./yzzy"

const Header = () => {
  // Usando o contexto para acessar o estado global de hideValues e updatePatrimonio
  const { hideValues, setHideValues, updatePatrimonio, lastUpdated } = usePatrimonio()

  // Usando o contexto de alarmes
  const { alarms, setAlarms, openAlarmManager, setOpenAlarmManager } = useAlarme()

  // Estados para controlar dropdown e modal
  const [openDropdown, setOpenDropdown] = useState(false)
  const [openUserModal, setOpenUserModal] = useState(false)
  const [openMovimentacaoDropdown, setOpenMovimentacaoDropdown] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)

  // NOVO: Estado para controlar o modal da YZZY
  const [openYzzyModal, setOpenYzzyModal] = useState(false)

  // NOVO: Sistema de múltiplas boletas
  const [boletas, setBoletas] = useState([])
  const MAX_BOLETAS = 3
const RefreshButton = () => {
  return (
    <button
      
      className={`
        flex items-center justify-center gap-2 
        bg-[#444] hover:bg-[#555] disabled:bg-[#333] 
        disabled:cursor-not-allowed text-white p-2 rounded 
        transition-colors min-w-[32px] min-h-[32px]
      `}
    >
     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
    </button>
  )
}

  // Estado para o usuário atual
  const [currentUser, setCurrentUser] = useState({
    id: "11105",
    name: "Equipe de Desenvolvimento",
    type: "admin", // Adicionar tipo do usuário
  })

  // Estado para dados do patrimônio
  const [patrimonioData, setPatrimonioData] = useState({
    total: 100000,
    saldoConta: 10000,
    carteiraTotal: 90000,
    rendaVariavel: 25000,
    rendaFixaPublica: 30000,
    rendaFixaPrivada: 20000,
    fundos: 15000,
  })

  // NOVA: Função para abrir nova boleta
  const abrirNovaBoleta = (tipoOperacao) => {
    if (boletas.length >= MAX_BOLETAS) {
      console.warn(`Máximo de ${MAX_BOLETAS} boletas abertas simultaneamente`)
      return
    }

    const novaBoleta = {
      id: Date.now(),
      tipoOperacao,
      position: { x: boletas.length * 40, y: boletas.length * 40 },
      zIndex: 10000 + boletas.length,
      createdAt: new Date(),
    }

    setBoletas(prev => [...prev, novaBoleta])
  }

  // NOVA: Função para fechar boleta específica
  const fecharBoleta = (boletaId) => {
    setBoletas(prev => prev.filter(boleta => boleta.id !== boletaId))
  }

  // NOVA: Função para trazer boleta para frente
  const trazerBoletaParaFrente = (boletaId) => {
    setBoletas(prev => {
      const maxZ = Math.max(...prev.map(b => b.zIndex), 9999)
      return prev.map(boleta => 
        boleta.id === boletaId 
          ? { ...boleta, zIndex: maxZ + 1 }
          : boleta
      )
    })
  }

  // NOVA: Função para organizar boletas em cascata
  const organizarBoletas = () => {
    setBoletas(prev => prev.map((boleta, index) => ({
      ...boleta,
      position: { x: index * 40, y: index * 40 },
      zIndex: 10000 + index
    })))
  }

  // NOVA: Função para fechar todas as boletas
  const fecharTodasBoletas = () => {
    setBoletas([])
  }

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
        return "bg-neutral-500"
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

  // Função para atualizar patrimônio
  const handleUpdatePatrimonio = async () => {
    setIsUpdating(true)

    try {
      // Simular chamada de API
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Simular novos dados (com pequenas variações)
      const variacao = (Math.random() - 0.5) * 0.1 // Variação de -5% a +5%
      const novoTotal = patrimonioData.total * (1 + variacao)

      const novosDados = {
        total: Math.round(novoTotal),
        saldoConta: Math.round(patrimonioData.saldoConta * (1 + (Math.random() - 0.5) * 0.2)),
        carteiraTotal: Math.round(novoTotal * 0.9),
        rendaVariavel: Math.round(novoTotal * 0.25 * (1 + (Math.random() - 0.5) * 0.1)),
        rendaFixaPublica: Math.round(novoTotal * 0.3 * (1 + (Math.random() - 0.5) * 0.1)),
        rendaFixaPrivada: Math.round(novoTotal * 0.2 * (1 + (Math.random() - 0.5) * 0.1)),
        fundos: Math.round(novoTotal * 0.15 * (1 + (Math.random() - 0.5) * 0.1)),
      }

      // Atualizar dados locais
      setPatrimonioData(novosDados)

      // Atualizar contexto global para que os módulos sejam atualizados
      updatePatrimonio(novosDados)

      console.log("Patrimônio atualizado com sucesso!")
    } catch (error) {
      console.error("Erro ao atualizar patrimônio:", error)
    } finally {
      setIsUpdating(false)
    }
  }

  const movimentacaoData = [
    {
      id: 1,
      tipo: "ENTRADA",
      descricao: "Dividendos ITUB4",
      valor: 125.5,
      data: "27/01/2025 14:30",
      status: "Processado",
      statusColor: "green",
    },
    {
      id: 2,
      tipo: "SAÍDA",
      descricao: "Compra PETR4 - 100 cotas",
      valor: -3678.0,
      data: "27/01/2025 10:15",
      status: "Executado",
      statusColor: "blue",
    },
    {
      id: 3,
      tipo: "ENTRADA",
      descricao: "Venda VALE3 - 50 cotas",
      valor: 3446.0,
      data: "26/01/2025 16:45",
      status: "Liquidado",
      statusColor: "green",
    },
    {
      id: 4,
      tipo: "ENTRADA",
      descricao: "Juros sobre Capital BBDC4",
      valor: 89.3,
      data: "26/01/2025 09:00",
      status: "Processado",
      statusColor: "green",
    },
    {
      id: 5,
      tipo: "SAÍDA",
      descricao: "Taxa de Corretagem",
      valor: -15.9,
      data: "25/01/2025 18:20",
      status: "Debitado",
      statusColor: "orange",
    },
  ]

  // Função para lidar com a seleção de usuário
  const handleSelectUser = (userId, userName) => {
    // Buscar o tipo do usuário baseado no ID (simulação)
    const userTypes = {
      11105: "admin",
      11106: "gestor",
      11107: "user",
      11108: "gestor",
      11109: "user",
      11110: "user",
      11111: "gestor",
      11112: "admin",
      11113: "gestor",
      11114: "admin",
    }

    setCurrentUser({
      id: userId,
      name: userName,
      type: userTypes[userId] || "user",
    })
    console.log(`Usuário alterado para: ${userId} - ${userName}`)
  }

  // NOVO: Indicador de boletas abertas
  const renderIndicadorBoletas = () => {
    if (boletas.length === 0) return null
    
    return (
      <div className="flex items-center gap-2 ml-2">
        <div className="bg-orange-500 text-white px-2 py-1 rounded text-xs font-bold">
          {boletas.length} Boleta{boletas.length > 1 ? 's' : ''}
        </div>
        
        {boletas.length > 1 && (
          <button
            onClick={organizarBoletas}
            className="bg-neutral-600 hover:bg-neutral-500 text-white px-2 py-1 rounded text-xs"
            title="Organizar boletas (Ctrl+Shift+O)"
          >
            📐
          </button>
        )}
        
        <button
          onClick={fecharTodasBoletas}
          className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded text-xs"
          title="Fechar todas (Ctrl+Shift+C)"
        >
          ✕
        </button>
      </div>
    )
  }

  // MODIFICADO: useEffect com atalhos para múltiplas boletas
  useEffect(() => {
    const handleKeyDown = (event) => {
      // F5 - Nova boleta de compra
      if (event.key === "F5") {
        event.preventDefault()
        abrirNovaBoleta("comprar")
      }
      // F9 - Nova boleta de venda  
      else if (event.key === "F9") {
        event.preventDefault()
        abrirNovaBoleta("vender")
      }
      // Shift + U - Abrir modal de usuários
      else if (event.shiftKey && event.key === "U") {
        event.preventDefault()
        setOpenUserModal(true)
      }
      // Ctrl + Shift + C - Fechar todas as boletas
      else if (event.ctrlKey && event.shiftKey && event.key === "C") {
        event.preventDefault()
        fecharTodasBoletas()
      }
      // Ctrl + Shift + O - Organizar boletas
      else if (event.ctrlKey && event.shiftKey && event.key === "O") {
        event.preventDefault()
        organizarBoletas()
      }
      // NOVO: Ctrl + Y - Abrir YZZY
      else if (event.ctrlKey && event.key === "y") {
        event.preventDefault()
        setOpenYzzyModal(true)
      }
      // F1-F3 - Focar em boleta específica
      else if (["F1", "F2", "F3"].includes(event.key)) {
        event.preventDefault()
        const index = parseInt(event.key.slice(1)) - 1
        if (boletas[index]) {
          trazerBoletaParaFrente(boletas[index].id)
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [boletas])

  // NOVA: Persistência de estado (opcional)
  useEffect(() => {
    localStorage.setItem('boletas_abertas', JSON.stringify(boletas))
  }, [boletas])

  // NOVA: Recuperar boletas ao carregar (opcional)
  useEffect(() => {
    const boletasSalvas = localStorage.getItem('boletas_abertas')
    if (boletasSalvas) {
      try {
        const parsed = JSON.parse(boletasSalvas)
        setBoletas(parsed)
      } catch (error) {
        console.error('Erro ao recuperar boletas:', error)
      }
    }
  }, [])

  return (
    <div className="bg-neutral-700/50 text-white relative">
      {/* Header principal */}
      <div className="grid grid-cols-3 items-center px-4 py-2">
        {/* Coluna da esquerda - Usuário */}
        <div className="flex items-center justify-start">
          <div className="flex items-center">
            <span
              className="cursor-pointer flex items-center hover:bg-neutral-700 rounded px-2 py-1 transition-colors duration-200"
              onClick={() => setOpenUserModal(true)}
            >
              <div className="flex items-center">
                <span id="textUser" className="flex items-center">
                  <span className="user-icon mr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 29.744 29.744">
                      <path
                        d="M299.875,40a14.872,14.872,0,1,0,14.872,14.872A14.889,14.889,0,0,0,299.875,40Zm8.575,23.068v-.587c0-2.028-2.343-2.768-3.6-3.3-.454-.194-1.31-.605-2.189-1.034a1.2,1.2,0,0,1-.6-.86l-.1-.962a4.13,4.13,0,0,0,1.38-2.469h.152a.51.51,0,0,0,.5-.4l.238-1.469a.487.487,0,0,0-.5-.5c.005-.031.011-.063.015-.089a5.078,5.078,0,0,0,.06-.513c.015-.134.027-.272.033-.415a3.327,3.327,0,0,0-.286-1.64,3.884,3.884,0,0,0-.915-1.332c-1.162-1.1-2.509-1.528-3.658-.644a2.658,2.658,0,0,0-2.384,1.009,3.128,3.128,0,0,0-.693,1.4,4.449,4.449,0,0,0-.16,1.061,4.3,4.3,0,0,0,.108,1.166.491.491,0,0,0-.458.5l.237,1.469a.511.511,0,0,0,.5.4h.136a4.932,4.932,0,0,0,1.392,2.515l-.094.929a1.2,1.2,0,0,1-.6.861c-.85.415-1.686.814-2.187,1.02-1.18.486-3.6,1.276-3.6,3.3v.459a11.876,11.876,0,1,1,17.267.127Z"
                        transform="translate(-285.003 -40.003)"
                        fill="#F59E0B"
                      />
                    </svg>
                  </span>
                  <span className="user-label text-sm">
                    <span className="code font-bold">{currentUser.id}</span> - {currentUser.name}
                  </span>
                  <span
                    className={`text-xs text-white px-2 py-0.5 rounded font-medium ml-2 ${getTypeBadgeColor(currentUser.type)}`}
                  >
                    {getTypeText(currentUser.type)}
                  </span>
                </span>
              </div>
              <span className="ml-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  viewBox="0 0 20 20"
                  className="fill-current"
                >
                  <g transform="translate(-245 -155)">
                    <rect width="20" height="20" transform="translate(245 155)" fill="none"></rect>
                    <path
                      d="M176.1,9.366,166.089.245a.844.844,0,0,0-1.189,0,.834.834,0,0,0,0,1.184L174.3,10l-9.4,8.571a.834.834,0,0,0,0,1.184.844.844,0,0,0,1.189,0L176.1,10.634a.824.824,0,0,0,.238-.633A.831.831,0,0,0,176.1,9.366Z"
                      transform="translate(265 -5.654) rotate(90)"
                    ></path>
                  </g>
                </svg>
              </span>
            </span>
          </div>
          {/* NOVO: Indicador de boletas abertas */}
          {renderIndicadorBoletas()}
        </div>

        {/* Coluna do centro - Patrimônio Total */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="total-value flex items-center">
              <span
                className={`value text-sm cursor-pointer rounded px-2 py-1 transition-colors flex items-center min-w-[280px] ${
                  openDropdown ? "bg-neutral-600 text-white" : "hover:bg-neutral-700"
                }`}
                onClick={() => setOpenDropdown(!openDropdown)}
              >
                <div className="flex flex-col leading-tight">
                  <div className="flex items-center">
                    <label className="font-bold mr-1">PATRIMÔNIO TOTAL</label>-{" "}
                    {hideValues ? "••••••" : formatCurrency(patrimonioData.total)}
                  </div>
                  <div className="text-xs text-neutral-400 leading-none">Últ. Atualização: {lastUpdated}</div>
                </div>
                <span
                  className={`ml-3 transform transition-transform duration-200 ${openDropdown ? "rotate-180" : ""}`}
                >
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
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </span>
              </span>

              {/* Botões de Visibilidade e YZZY */}
              <div className="flex items-center gap-2 ml-3">
                {/* Botão de Visibilidade (Olho) */}
                <button
                  className="bg-neutral-600 hover:bg-neutral-500 text-white p-2 rounded transition-colors relative"
                  onClick={() => setHideValues(!hideValues)}
                  title={hideValues ? "Mostrar valores" : "Ocultar valores"}
                >
                  {hideValues ? (
                    // Quando valores estão ocultos, mostrar ícone de olho fechado
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
                    // Quando valores estão visíveis, mostrar ícone de olho aberto
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

                {/* NOVO: Botão da YZZY */}
                <button
                  className="hide bg-gradient-to-r from-[#F7941E] to-[#FF6B35] hover:from-[#e8851a] hover:to-[#e55a2b] text-white p-2 rounded transition-all duration-200 relative group"
                  onClick={() => setOpenYzzyModal(true)}
                  title="Abrir YZZY - Assistente de Investimentos (Ctrl+Y)"
                  hidden
                >
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
                    className="group-hover:scale-110 transition-transform"
                  >
                    {/* Ícone de IA/Robô */}
                    <rect x="3" y="11" width="18" height="10" rx="2" ry="2"/>
                    <circle cx="12" cy="5" r="2"/>
                    <path d="m12 7.01v4"/>
                    <path d="M8 16h.01"/>
                    <path d="M16 16h.01"/>
                    <path d="m9 9-1-1"/>
                    <path d="m15 9 1-1"/>
                  </svg>
                </button>
              </div>
            </div>

            {/* Dropdown com informações do patrimônio */}
            {openDropdown && (
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-80 bg-neutral-700 rounded-lg shadow-lg z-[1200] border border-neutral-600">
                <div className="p-4">
                  <div className="flex flex-col gap-2">
                    {/* Título da seção sem badge */}
                    <div className="flex justify-between items-center mb-0">
                      <div className="text-xs uppercase text-neutral-400 font-bold">Visão Geral</div>
                      
                      <RefreshButton />
                    </div>

                    {/* Data de última atualização */}
                    <div className="text-xs text-neutral-400 mb-2 pb-1 border-b border-neutral-600">
                      Últ. Atualização: {lastUpdated}
                    </div>

                    {/* Patrimônio Total */}
                    <div className="flex justify-between py-1">
                      <div className="text-xs uppercase text-neutral-300">Patrimônio Total</div>
                      <div className="text-xs uppercase font-bold min-w-[100px] text-right">
                        {hideValues ? "••••••" : formatCurrency(patrimonioData.total)}
                      </div>
                    </div>
                    <div className="border-t border-neutral-600"></div>

                    {/* Saldo em conta */}
                    <div className="flex justify-between py-1">
                      <div className="text-xs uppercase text-neutral-300">Saldo em conta</div>
                      <div className="text-xs uppercase font-bold min-w-[120px] text-right">
                        {hideValues
                          ? "••••••"
                          : `${formatCurrency(patrimonioData.saldoConta)} (${((patrimonioData.saldoConta / patrimonioData.total) * 100).toFixed(2)}%)`}
                      </div>
                    </div>
                    <div className="border-t border-neutral-600"></div>

                    {/* Carteira total */}
                    <div className="flex justify-between py-1">
                      <div className="text-xs uppercase text-neutral-300">Carteira total</div>
                      <div className="text-xs uppercase font-bold min-w-[120px] text-right">
                        {hideValues
                          ? "••••••"
                          : `${formatCurrency(patrimonioData.carteiraTotal)} (${((patrimonioData.carteiraTotal / patrimonioData.total) * 100).toFixed(2)}%)`}
                      </div>
                    </div>
                    <div className="border-t border-neutral-600"></div>

                    {/* Renda Variável */}
                    <div className="flex justify-between items-center py-1">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                        <div className="text-xs uppercase text-neutral-300">Renda Variável</div>
                      </div>
                      <div className="text-xs uppercase font-bold min-w-[140px] text-right">
                        {hideValues
                          ? "••••••"
                          : `${formatCurrency(patrimonioData.rendaVariavel)} (${((patrimonioData.rendaVariavel / patrimonioData.total) * 100).toFixed(0)}%)`}
                      </div>
                    </div>
                    <div className="border-t border-neutral-600"></div>

                    {/* Renda Fixa Pública */}
                    <div className="flex justify-between items-center py-1">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        <div className="text-xs uppercase text-neutral-300">Renda Fixa Pública</div>
                      </div>
                      <div className="text-xs uppercase font-bold min-w-[140px] text-right">
                        {hideValues
                          ? "••••••"
                          : `${formatCurrency(patrimonioData.rendaFixaPublica)} (${((patrimonioData.rendaFixaPublica / patrimonioData.total) * 100).toFixed(0)}%)`}
                      </div>
                    </div>
                    <div className="border-t border-neutral-600"></div>

                    {/* Renda Fixa Privada */}
                    <div className="flex justify-between items-center py-1">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                        <div className="text-xs uppercase text-neutral-300">Renda Fixa Privada</div>
                      </div>
                      <div className="text-xs uppercase font-bold min-w-[140px] text-right">
                        {hideValues
                          ? "••••••"
                          : `${formatCurrency(patrimonioData.rendaFixaPrivada)} (${((patrimonioData.rendaFixaPrivada / patrimonioData.total) * 100).toFixed(0)}%)`}
                      </div>
                    </div>
                    <div className="border-t border-neutral-600"></div>

                    {/* Fundos */}
                    <div className="flex justify-between items-center py-1">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-pink-500"></div>
                        <div className="text-xs uppercase text-neutral-300">Fundos</div>
                      </div>
                      <div className="text-xs uppercase font-bold min-w-[140px] text-right">
                        {hideValues
                          ? "••••••"
                          : `${formatCurrency(patrimonioData.fundos)} (${((patrimonioData.fundos / patrimonioData.total) * 100).toFixed(0)}%)`}
                      </div>
                    </div>
                    <div className="border-t border-neutral-600"></div>

                    {/* Saldo em Conta */}
                    <div className="flex justify-between items-center py-1">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                        <div className="text-xs uppercase text-neutral-300">Saldo em Conta</div>
                      </div>
                      <div className="text-xs uppercase font-bold min-w-[140px] text-right">
                        {hideValues
                          ? "••••••"
                          : `${formatCurrency(patrimonioData.saldoConta)} (${((patrimonioData.saldoConta / patrimonioData.total) * 100).toFixed(0)}%)`}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Coluna da direita - Botões de ação */}
        <div className="flex items-center justify-end gap-2 relative">
          {/* MODIFICADO: Botão Comprar */}
          <button
            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded text-xs uppercase font-bold transition-colors flex items-center gap-1"
            onClick={() => abrirNovaBoleta("comprar")}
          >
            <span>Comprar</span>
            <span className="text-[10px] opacity-70">F5</span>
          </button>

          {/* MODIFICADO: Botão Vender */}
          <button
            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded text-xs uppercase font-bold transition-colors flex items-center gap-1"
            onClick={() => abrirNovaBoleta("vender")}
          >
            <span>Vender</span>
            <span className="text-[10px] opacity-70">F9</span>
          </button>

          {/* Componente de Alarme */}
          <AlarmIcon alarms={alarms} onOpenAlarmManager={() => setOpenAlarmManager(true)} />

          {/* Botão de Movimentação */}
          <div className="relative">
            <button
              className="bg-neutral-600 hover:bg-neutral-500 text-white p-2 rounded transition-colors relative"
              onClick={() => setOpenMovimentacaoDropdown(!openMovimentacaoDropdown)}
              title="Movimentação"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="feather feather-file-text"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
            </button>

            {/* Dropdown de Movimentação */}
            {openMovimentacaoDropdown && (
              <div className="absolute top-full right-0 mt-2 w-96 bg-neutral-700 rounded-lg shadow-lg z-[1200] border border-neutral-600">
                <div className="p-4">
                  <div className="flex flex-col gap-2">
                    {/* Título da seção */}
                    <div className="text-xs uppercase text-neutral-400 font-bold mb-2 border-b border-neutral-600 pb-2">
                      Movimentação Recente
                    </div>

                    {movimentacaoData.map((movimento) => (
                      <div
                        key={movimento.id}
                        className={`bg-neutral-600 rounded p-3 border-l-4 ${
                          movimento.statusColor === 'green' ? 'border-l-green-500' :
                          movimento.statusColor === 'blue' ? 'border-l-blue-500' :
                          movimento.statusColor === 'orange' ? 'border-l-orange-500' :
                          'border-l-neutral-500'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-xs font-bold px-2 py-1 rounded ${
                                movimento.tipo === "ENTRADA" ? "bg-green-600" : "bg-red-600"
                              }`}
                            >
                              {movimento.tipo}
                            </span>
                            <div className="font-bold text-white">{movimento.descricao}</div>
                          </div>
                          <div className={`font-bold ${movimento.valor > 0 ? "text-green-400" : "text-red-400"}`}>
                            {movimento.valor > 0 ? "+" : ""}
                            {formatCurrency(Math.abs(movimento.valor))}
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="text-xs text-neutral-400">{movimento.data}</div>
                          <div
                            className={`text-xs font-bold px-2 py-1 rounded ${
                              movimento.statusColor === 'green' ? 'text-green-400 bg-green-900/20' :
                              movimento.statusColor === 'blue' ? 'text-blue-400 bg-blue-900/20' :
                              movimento.statusColor === 'orange' ? 'text-orange-400 bg-orange-900/20' :
                              'text-neutral-400 bg-neutral-900/20'
                            }`}
                          >
                            {movimento.status}
                          </div>
                        </div>
                      </div>
                    ))}

                    {movimentacaoData.length === 0 && (
                      <div className="text-center py-4 text-neutral-400">Nenhuma movimentação recente</div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Componente SysUsers para troca de usuário */}
      <SysUsers isOpen={openUserModal} onClose={() => setOpenUserModal(false)} onSelectUser={handleSelectUser} />

      {/* NOVO: Renderizar múltiplas boletas */}
      {boletas.map((boleta, index) => (
        <Boleta
          key={boleta.id}
          isOpen={true}
          onClose={() => fecharBoleta(boleta.id)}
          tipoOperacao={boleta.tipoOperacao}
          initialPosition={boleta.position}
          zIndex={boleta.zIndex}
          boletaId={boleta.id}
          isMultiple={boletas.length > 1}
          index={index}
          onBringToFront={trazerBoletaParaFrente}
        />
      ))}

      {/* Componente AlarmManager */}
      <AlarmManager
        isOpen={openAlarmManager}
        onClose={() => setOpenAlarmManager(false)}
        alarms={alarms}
        onAlarmsChange={setAlarms}
      />

      {/* NOVO: Componente YZZY */}
      <Yzzy
        isOpen={openYzzyModal}
        onClose={() => setOpenYzzyModal(false)}
      />

      {/* Overlay para fechar dropdown quando clicar fora */}
      {openDropdown && <div className="fixed inset-0 z-[1150]" onClick={() => setOpenDropdown(false)}></div>}

      {/* Overlay para fechar dropdown de movimentação quando clicar fora */}
      {openMovimentacaoDropdown && (
        <div className="fixed inset-0 z-[1150]" onClick={() => setOpenMovimentacaoDropdown(false)}></div>
      )}
    </div>
  )
}

export default Header