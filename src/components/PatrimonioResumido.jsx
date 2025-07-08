"use client"

import { useEffect, useRef, useState, useCallback } from "react"
// Importação direta do Recharts - ADICIONANDO mais tipos de gráfico
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Sector,
  Tooltip,
  RadialBarChart,
  RadialBar,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
} from "recharts"

// Importando todos os arquivos de dados
import { patrimonioResumido as patrimonioNivel1 } from "../data/patrimonioResumido"
import { rfPrivadaData } from "../data/dataRFPrivada"
import { fundosData } from "../data/dataFundos"
import { rendaVariavel } from "../data/dataRendaVariavel"
import { dataTesouro } from "../data/dataTesouro"
import { dataSaldoAttachment } from "../data/dataSaldo"
import { garantiasData } from "../data/dataGarantias"

// Importando funções auxiliares
import { formatCurrency } from "../utils/formatCurrency"

// Importando o contexto
import { usePatrimonio } from "../context/patrimonioContext"
import { rfPublicaData } from "../data/dataRFPublica"

// Estilos CSS customizados para animações
const legendAnimationStyles = `
  .legend-enter {
    opacity: 0;
    transform: translateX(20px);
    transition: all 0.3s ease-in-out;
  }
  
  .legend-enter-active {
    opacity: 1;
    transform: translateX(0);
  }
  
  .legend-exit {
    opacity: 1;
    transform: translateX(0);
    transition: all 0.2s ease-in-out;
  }
  
  .legend-exit-active {
    opacity: 0;
    transform: translateX(20px);
  }
  
  .legend-container {
    transition: width 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    overflow: hidden;
  }
  
  .chart-container {
    transition: width 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .refresh-button {
    transition: all 0.2s ease;
  }
  
  .refresh-button:hover {
    transform: scale(1.05);
  }
  
  .refresh-button.spinning {
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`

// Adicione o componente de estilo no início da função PatrimonioResumido:
const StyleSheet = () => <style dangerouslySetInnerHTML={{ __html: legendAnimationStyles }} />

// MAPEAMENTO CORRETO - AGORA COM TODAS AS 7 CATEGORIAS
const patrimonioNivel2 = {
  rendaVariavel: rendaVariavel,
  rfPublica: rfPublicaData,
  rfPrivada: rfPrivadaData,
  fundos: fundosData,
  saldoConta: dataSaldoAttachment,
  garantias: garantiasData,
  tesouroDireto: dataTesouro,
}

// Mapeamento das cores do Tailwind por categoria
const getCategoryTailwindColor = (categoryId) => {
  const colorMap = {
    rendaVariavel: "#eab308", // yellow-500 (Amarelo)
    rfPublica: "#22c55e", // green-500 (Verde)
    rfPrivada: "#3b82f6", // blue-500 (Azul)
    fundos: "#ec4899", // pink-500 (Rosa)
    saldoConta: "#8b5cf6", // violet-500 (Roxo)
    garantias: "#f97316", // orange-500 (Laranja)
    tesouroDireto: "#ef4444", // red-500 (Vermelho)
  }
  return colorMap[categoryId] || "#6b7280" // gray-500 como fallback
}

// Debug para verificar se temos todas as categorias
console.log("=== VERIFICAÇÃO DAS 7 CATEGORIAS ===")
console.log("patrimonioNivel1 length:", patrimonioNivel1.length)
console.log(
  "Categorias disponíveis:",
  patrimonioNivel1.map((item) => `${item.id}: ${item.label}`),
)
console.log("Dados mapeados:", Object.keys(patrimonioNivel2))

// Função para gerar variações de cor baseada em cores do Tailwind
function generateColorVariation(baseColor, index, total) {
  const r = Number.parseInt(baseColor.slice(1, 3), 16)
  const g = Number.parseInt(baseColor.slice(3, 5), 16)
  const b = Number.parseInt(baseColor.slice(5, 7), 16)

  const rNorm = r / 255
  const gNorm = g / 255
  const bNorm = b / 255

  const max = Math.max(rNorm, gNorm, bNorm)
  const min = Math.min(rNorm, gNorm, bNorm)

  let h, s
  const l = (max + min) / 2

  if (max === min) {
    h = s = 0
  } else {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)

    switch (max) {
      case rNorm:
        h = (gNorm - bNorm) / d + (gNorm < bNorm ? 6 : 0)
        break
      case gNorm:
        h = (bNorm - rNorm) / d + 2
        break
      case bNorm:
        h = (rNorm - gNorm) / d + 4
        break
    }

    h /= 6
  }

  const newL = Math.min(0.9, l + (index / total) * 0.5)
  const newS = Math.max(0.3, s - (index / total) * 0.3)

  function hue2rgb(p, q, t) {
    if (t < 0) t += 1
    if (t > 1) t -= 1
    if (t < 1 / 6) return p + (q - p) * 6 * t
    if (t < 1 / 2) return q
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
    return p
  }

  let r1, g1, b1

  if (newS === 0) {
    r1 = g1 = b1 = newL
  } else {
    const q = newL < 0.5 ? newL * (1 + newS) : newL + newS - newL * newS
    const p = 2 * newL - q

    r1 = hue2rgb(p, q, h + 1 / 3)
    g1 = hue2rgb(p, q, h)
    b1 = hue2rgb(p, q, h - 1 / 3)
  }

  const rHex = Math.round(r1 * 255)
    .toString(16)
    .padStart(2, "0")
  const gHex = Math.round(g1 * 255)
    .toString(16)
    .padStart(2, "0")
  const bHex = Math.round(b1 * 255)
    .toString(16)
    .padStart(2, "0")

  return `#${rHex}${gHex}${bHex}`
}

// Função para verificar se um item deve ser excluído do patrimônio total
const isExcludedFromTotal = (item) => {
  if (!item) return false

  const label = item.label ? item.label.toLowerCase() : ""
  const id = item.id ? item.id.toLowerCase() : ""
  const tipo = item.tipo ? item.tipo.toLowerCase() : ""

  // Verificar se contém palavras-chave que indicam exclusão
  const excludedKeywords = ["futuros", "termo", "termos", "aluguel", "aluguer"]

  return excludedKeywords.some((keyword) => label.includes(keyword) || id.includes(keyword) || tipo.includes(keyword))
}

// Função para calcular o total do patrimônio (excluindo Futuros, Termos e Aluguel)
const calcularTotalPatrimonio = () => {
  return patrimonioNivel1.filter((item) => !isExcludedFromTotal(item)).reduce((total, item) => total + item.rawValue, 0)
}

// Função para renderizar o texto central
const CenterText = ({ title, value, hideValues }) => {
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        pointerEvents: "none",
        zIndex: 10,
      }}
    >
      <div
        style={{
          padding: "4px 10px",
          borderRadius: "4px",
          backgroundColor: "bg-gray-800",
          textAlign: "center",
        }}
      ><div className="text-neutral-400 text-base mb-1">{title}</div>
        <div className="text-white text-xl font-bold">{hideValues ? "••••••" : value}</div>
      </div>
    </div>
  )
}

// Componente para renderizar uma forma ativa personalizada com mais detalhes
const CustomActiveShapePieChart = (props) => {
  const RADIAN = Math.PI / 180
  const {
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    percent,
    value,
    category,
    hideValues,
  } = props

  const sin = Math.sin(-RADIAN * midAngle)
  const cos = Math.cos(-RADIAN * midAngle)

  const sx = cx + (outerRadius + 5) * cos
  const sy = cy + (outerRadius + 5) * sin
  const mx = cx + (outerRadius + 30) * cos
  const my = cy + (outerRadius + 30) * sin

  const maxDistance = Math.min(cx * 0.8, 90)
  const textDistance = Math.min(maxDistance, outerRadius + 40)
  const ex = cx + textDistance * cos
  const ey = my

  const textAnchor = cos >= 0 ? "start" : "end"

  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 3}
        outerRadius={outerRadius + 7}
        fill={fill}
      />
      <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text zIndex="9999" x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey + (cos >= 2 ) * 12} textAnchor={textAnchor} className="bg-neutral-500" fill="#FFF" fontSize={12}>
        {category}
      </text>
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#FFF" fontSize={12}>
        {hideValues ? "••••••" : formatCurrency(value)} ({(percent * 100).toFixed(2)}%)
      </text>
    </g>
  )
}

// Componente para renderizar o tooltip customizado
const CustomTooltip = ({ active, payload, hideValues }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    return (
      <div className="bg-neutral-800 p-2 rounded shadow-lg border border-neutral-600 text-white">
        <p className="font-bold">{data.category}</p>
        <p>
          {hideValues ? "••••••" : formatCurrency(data.value)} ({data.percent.toFixed(2)}%)
        </p>
      </div>
    )
  }
  return null
}

// Função para obter o título da categoria selecionada
const getCategoryTitle = (categoryId) => {
  if (!categoryId) return ""

  // Mapeamento direto para evitar problemas
  const titleMap = {
    rendaVariavel: "Renda Variável",
    rfPublica: "Renda Fixa Pública",
    rfPrivada: "Renda Fixa Privada",
    fundos: "Fundos",
    saldoConta: "Saldo em Conta",
    garantias: "Garantias",
    tesouroDireto: "Tesouro Direto",
  }

  return titleMap[categoryId] || categoryId
}

// Componente Dropdown customizado
const CustomDropdown = ({ chartType, setChartType, showLegend, setShowLegend }) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  // Fechar dropdown quando clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Função para obter o ícone do tipo de gráfico (usando SVG)
  const getChartIcon = (type) => {
    switch (type) {
      case "pie":
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"
            />
          </svg>
        )
      case "radial":
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
            <circle cx="12" cy="12" r="6" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
            <circle cx="12" cy="12" r="2" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
          </svg>
        )
      case "bar":
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
        )
      case "line":
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        )
      default:
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"
            />
          </svg>
        )
    }
  }

  // Função para obter o nome do tipo de gráfico
  const getChartTypeName = (type) => {
    switch (type) {
      case "pie":
        return "Pizza"
      case "radial":
        return "Radial"
      case "bar":
        return "Barras"
      case "line":
        return "Linhas"
      default:
        return "Pizza"
    }
  }

  const chartOptions = [
    { value: "pie", label: "Pizza", icon: getChartIcon("pie") },
    { value: "radial", label: "Radial", icon: getChartIcon("radial") },
    { value: "bar", label: "Barras", icon: getChartIcon("bar") },
    { value: "line", label: "Linhas", icon: getChartIcon("line") },
  ]

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Botão do dropdown */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-[#444] hover:bg-[#555] text-white p-2 rounded transition-colors relative"
      >
        {/* Ícone de 3 pontinhos */}
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
          />
        </svg>
      </button>

      {/* Menu dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-neutral-800 border border-neutral-600 rounded-md shadow-lg z-50">
          {/* Cabeçalho */}
          <div className="px-3 py-2 text-sm font-medium text-neutral-400 border-b border-neutral-600">
            Tipo de Visualização
          </div>

          {/* Opções de gráfico */}
          {chartOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                setChartType(option.value)
                setIsOpen(false)
              }}
              className={`w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-neutral-700 transition-colors ${chartType === option.value ? "bg-neutral-700 text-blue-400" : "text-neutral-200"
                }`}
            >
              {option.icon}
              <span>{option.label}</span>
              {chartType === option.value && <span className="ml-auto text-blue-400">✓</span>}
            </button>
          ))}

          {/* Separador */}
          <div className="border-t border-neutral-600 my-1"></div>

          {/* Seção Legenda */}
          <div className="px-3 py-2 text-sm font-medium text-neutral-400 border-b border-neutral-600">Legenda</div>

          {/* Switch da legenda */}
          <div className="px-3 py-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-neutral-300">Exibir Legenda</span>
              {/* Switch customizado */}
              <button
                onClick={() => setShowLegend(!showLegend)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${showLegend ? "bg-blue-600" : "bg-neutral-600"
                  }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${showLegend ? "translate-x-6" : "translate-x-1"
                    }`}
                />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// NOVO: Componente do botão de refresh
const RefreshButton = ({ onRefresh, isRefreshing }) => {
  return (
    <button
      onClick={onRefresh}
      disabled={isRefreshing}
      className={`
        flex items-center justify-center gap-2 
        bg-[#444] hover:bg-[#555] disabled:bg-[#333] 
        disabled:cursor-not-allowed text-white p-2 rounded 
        transition-colors min-w-[32px] min-h-[32px]
      `}
      title={isRefreshing ? "Atualizando dados..." : "Atualizar dados do patrimônio"}
    >
      {isRefreshing ? (
        // Spinner Tailwind
        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
      ) : (
        // Ícone de refresh normal
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
      )}
    </button>
  )
}

export default function PatrimonioResumido({ type = "light" }) {
  // Estados
  const [openDialog, setOpenDialog] = useState(false)
  const [hiddenSeries, setHiddenSeries] = useState([])
  const [activeIndex, setActiveIndex] = useState(null)
  const [activeDetailIndex, setActiveDetailIndex] = useState(null)
  const [contentHeight, setContentHeight] = useState(0)
  const headerRef = useRef(null)
  const [viewMode, setViewMode] = useState("chart")
  const [classificacao, setClassificacao] = useState("classeAtivo")
  // NOVO: Estado para tipo do gráfico com mais opções
  const [chartType, setChartType] = useState("pie")
  // NOVO: Estado para controlar visibilidade da legenda
  const [showLegend, setShowLegend] = useState(true)
  // NOVO: Estados para hover nas barras
  const [activeBarIndex, setActiveBarIndex] = useState(null)
  const [activeDetailBarIndex, setActiveDetailBarIndex] = useState(null)
  // NOVO: Estados para o refresh
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [lastRefreshTime, setLastRefreshTime] = useState(new Date())

  // Usando o contexto compartilhado
  const {
    selectedCategory: contextSelectedCategory,
    setSelectedCategory: contextSetSelectedCategory,
    selectedSubcategory: contextSelectedSubcategory,
    setSelectedSubcategory: contextSetSelectedSubcategory,
    hideValues,
  } = usePatrimonio()

  // Verificar se é versão full
  const isFullVersion = type === "full"

  // NOVO: Função para lidar com o refresh
  const handleRefresh = useCallback(async () => {
    if (isRefreshing) return

    setIsRefreshing(true)

    try {
      console.log("=== INICIANDO REFRESH DOS DADOS ===")

      // Simular chamada da API (substituir por chamada real)
      await new Promise(resolve => setTimeout(resolve, 1500))

      // Aqui você faria a chamada real da API
      // Exemplo:
      // const response = await fetch('/api/patrimonio/resumo')
      // const newData = await response.json()
      // updatePatrimonioData(newData)

      setLastRefreshTime(new Date())
      console.log("=== REFRESH CONCLUÍDO ===")

      // Opcional: Mostrar toast de sucesso
      // showSuccessToast("Dados atualizados com sucesso!")

    } catch (error) {
      console.error("Erro ao atualizar dados:", error)
      // Opcional: Mostrar toast de erro
      // showErrorToast("Erro ao atualizar dados. Tente novamente.")
    } finally {
      setIsRefreshing(false)
    }
  }, [isRefreshing])

  // Calcular o valor total do patrimônio (excluindo Futuros, Termos e Aluguel)
  const totalPatrimonio = calcularTotalPatrimonio()
  const formattedTotal = formatCurrency(totalPatrimonio)

  // Preparar dados para o Recharts usando cores do Tailwind
  const totalCompleto = patrimonioNivel1.reduce((total, item) => total + item.rawValue, 0)

  const chartData = patrimonioNivel1.map((item) => ({
    category: item.label,
    value: item.rawValue,
    id: item.id,
    color: getCategoryTailwindColor(item.id), // ← Usando cores do Tailwind
    percent: (item.rawValue / totalCompleto) * 100,
    change: item.change || "+0,0%",
    up: item.up !== undefined ? item.up : true,
    isExcluded: isExcludedFromTotal(item),
  }))

  // NOVO: Preparar dados específicos para RadialBarChart
  const radialChartData = chartData.map((item, index) => ({
    ...item,
    name: item.category,
    fill: item.color,
    uv: item.percent,
  }))

  // NOVO: Preparar dados específicos para BarChart e LineChart
  const barChartData = chartData.map((item, index) => ({
    name: item.category.length > 15 ? item.category.substring(0, 15) + "..." : item.category,
    value: item.value,
    percent: item.percent,
    fill: item.color,
    id: item.id,
    category: item.category,
  }))

  const lineChartData = chartData.map((item, index) => ({
    name: item.category.length > 10 ? item.category.substring(0, 10) + "..." : item.category,
    value: item.value,
    percent: item.percent,
  }))

  console.log("=== DADOS DO GRÁFICO ===")
  console.log("Total Patrimônio (sem excluídos):", totalPatrimonio)
  console.log("Total Completo (com todos):", totalCompleto)
  console.log("chartData length:", chartData.length)
  console.log(
    "Itens excluídos:",
    chartData.filter((item) => item.isExcluded),
  )

  // Função para obter dados de detalhes
  const getDetailChartData = (categoryId) => {
    console.log("=== getDetailChartData ===")
    console.log("categoryId:", categoryId)

    if (!categoryId) {
      console.error("categoryId é undefined ou null")
      return []
    }

    const categoryData = patrimonioNivel2[categoryId]
    if (!categoryData) {
      console.error(`Dados não encontrados para categoria: ${categoryId}`)
      console.log("Categorias disponíveis:", Object.keys(patrimonioNivel2))
      return []
    }

    console.log(`Dados encontrados para ${categoryId}:`, categoryData)

    if (!categoryData.items || !Array.isArray(categoryData.items) || categoryData.items.length === 0) {
      console.error(`Categoria ${categoryId} não tem itens válidos`)
      return []
    }

    // Filtrar itens de detalhes também (excluir Futuros, Termos, Aluguel)
    const validDetailItems = categoryData.items.filter((item) => !isExcludedFromTotal(item))

    const total = validDetailItems.reduce((sum, item) => sum + (item.rawValue || 0), 0)
    const mainColor = getCategoryTailwindColor(categoryId) // ← Usando cores do Tailwind

    console.log(`Processando ${validDetailItems.length} itens válidos para ${categoryId}`)

    return validDetailItems.map((item, index) => {
      const itemColor = generateColorVariation(mainColor, index, validDetailItems.length)

      return {
        category: item.label,
        value: item.rawValue || 0,
        id: item.id,
        color: itemColor,
        percent: (item.rawValue / total) * 100,
        change: item.change || "0%",
        up: item.up !== undefined ? item.up : true,
      }
    })
  }

  const detailChartData = contextSelectedCategory ? getDetailChartData(contextSelectedCategory) : []

  // NOVO: Função para renderizar gráfico baseado no tipo selecionado
  const renderMainChart = () => {
    const filteredData = chartData.filter((_, index) => !hiddenSeries.includes(index))
    const filteredRadialData = radialChartData.filter((_, index) => !hiddenSeries.includes(index))
    const filteredBarData = barChartData.filter((_, index) => !hiddenSeries.includes(index))

    if (chartType === "radial") {
      return (
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart
            cx="50%"
            cy="50%"
            innerRadius="10%"
            outerRadius="90%"
            data={filteredRadialData}
            startAngle={90}
            endAngle={450}
          >
            <RadialBar
              dataKey="uv"
              cornerRadius={3}
              fill="#8884d8"
              animationBegin={0}
              animationDuration={800}
              animationEasing="ease-out"
              onClick={isFullVersion ? handlePieClick : undefined}
              cursor={isFullVersion ? "pointer" : "default"}
            />

            <Tooltip content={<CustomTooltip hideValues={hideValues} />} />
          </RadialBarChart>
        </ResponsiveContainer>
      )
    }

    if (chartType === "bar") {
      return (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={filteredBarData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            onMouseMove={(state) => {
              if (state.activeTooltipIndex !== undefined) {
                setActiveBarIndex(state.activeTooltipIndex)
              }
            }}
            onMouseLeave={() => setActiveBarIndex(null)}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="name" stroke="#9CA3AF" fontSize={12} angle={-45} textAnchor="end" height={80} />
            <YAxis stroke="#9CA3AF" fontSize={12} />
            <Tooltip cursor={false} content={<CustomTooltip hideValues={hideValues} />} />

            <Bar
              dataKey="value"
              onClick={isFullVersion ? handleBarClick : undefined}
              cursor={isFullVersion ? "pointer" : "default"}
              animationBegin={0}
              animationDuration={800}
              animationEasing="ease-out"
            >
              {filteredBarData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )
    }

    if (chartType === "line") {
      return (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={lineChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="name" stroke="#9CA3AF" fontSize={12} angle={-45} textAnchor="end" height={80} />
            <YAxis stroke="#9CA3AF" fontSize={12} />
            <Tooltip content={<CustomTooltip hideValues={hideValues} />} />

            <Line
              type="monotone"
              dataKey="value"
              stroke="#EF4444"
              strokeWidth={3}
              dot={{ fill: "#EF4444", strokeWidth: 2, r: 6 }}
              onClick={isFullVersion ? handlePieClick : undefined}
              cursor={isFullVersion ? "pointer" : "default"}
              animationBegin={0}
              animationDuration={800}
              animationEasing="ease-out"
            />
          </LineChart>
        </ResponsiveContainer>
      )
    }

    // Gráfico Pie original
    return (
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={filteredData}
            cx="50%"
            cy="50%"
            innerRadius="60%"
            outerRadius="85%"
            dataKey="value"
            nameKey="category"
            paddingAngle={1}
            onClick={isFullVersion ? handlePieClick : undefined}
            activeIndex={activeIndex}
            activeShape={
              isFullVersion ? (props) => <CustomActiveShapePieChart {...props} hideValues={hideValues} /> : undefined
            }
            cursor={isFullVersion ? "pointer" : "default"}
            animationBegin={0}
            animationDuration={800}
            animationEasing="ease-out"
          >
            {filteredData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
            ))}
          </Pie>

          <Tooltip content={<CustomTooltip hideValues={hideValues} />} />
        </PieChart>
      </ResponsiveContainer>
    )
  }

  // NOVO: Função para renderizar gráfico de detalhes
  const renderDetailChart = () => {
    if (!contextSelectedCategory || detailChartData.length === 0) return null

    const detailRadialData = detailChartData.map((item, index) => ({
      ...item,
      name: item.category,
      fill: item.color,
      uv: item.percent,
    }))

    const detailBarData = detailChartData.map((item, index) => ({
      name: item.category.length > 15 ? item.category.substring(0, 15) + "..." : item.category,
      value: item.value,
      percent: item.percent,
      fill: item.color,
      id: item.id,
      category: item.category,
    }))

    const detailLineData = detailChartData.map((item, index) => ({
      name: item.category.length > 10 ? item.category.substring(0, 10) + "..." : item.category,
      value: item.value,
      percent: item.percent,
    }))

    if (chartType === "radial") {
      return (
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart
            cx="50%"
            cy="50%"
            innerRadius="20%"
            outerRadius="90%"
            data={detailRadialData}
            startAngle={90}
            endAngle={450}
          >
            <RadialBar
              dataKey="uv"
              cornerRadius={2}
              onClick={handleDetailPieClick}
              cursor="pointer"
              animationBegin={0}
              animationDuration={800}
              animationEasing="ease-out"
            />

            <Tooltip content={<CustomTooltip hideValues={hideValues} />} />
          </RadialBarChart>
        </ResponsiveContainer>
      )
    }

    if (chartType === "bar") {
      return (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={detailBarData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            onMouseMove={(state) => {
              if (state.activeTooltipIndex !== undefined) {
                setActiveDetailBarIndex(state.activeTooltipIndex)
              }
            }}
            onMouseLeave={() => setActiveDetailBarIndex(null)}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="name" stroke="#9CA3AF" fontSize={12} angle={-45} textAnchor="end" height={80} />
            <YAxis stroke="#9CA3AF" fontSize={12} />
            <Tooltip cursor={false} content={<CustomTooltip hideValues={hideValues} />} />

            <Bar
              dataKey="value"
              onClick={handleDetailBarClick}
              cursor="pointer"
              animationBegin={0}
              animationDuration={800}
              animationEasing="ease-out"
            >
              {detailBarData.map((entry, index) => (
                <Cell key={`cell-detail-${index}`} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )
    }

    if (chartType === "line") {
      return (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={detailLineData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="name" stroke="#9CA3AF" fontSize={12} angle={-45} textAnchor="end" height={80} />
            <YAxis stroke="#9CA3AF" fontSize={12} />
            <Tooltip content={<CustomTooltip hideValues={hideValues} />} />

            <Line
              type="monotone"
              dataKey="value"
              stroke="#EF4444"
              strokeWidth={3}
              dot={{ fill: "#EF4444", strokeWidth: 2, r: 6 }}
              onClick={handleDetailPieClick}
              cursor="pointer"
              animationBegin={0}
              animationDuration={800}
              animationEasing="ease-out"
            />
          </LineChart>
        </ResponsiveContainer>
      )
    }

    // Gráfico Pie de detalhes original
    return (
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={detailChartData}
            cx="50%"
            cy="50%"
            innerRadius="60%"
            outerRadius="85%"
            dataKey="value"
            nameKey="category"
            paddingAngle={1}
            onClick={handleDetailPieClick}
            activeIndex={activeDetailIndex}
            activeShape={(props) => <CustomActiveShapePieChart {...props} hideValues={hideValues} />}
            cursor="pointer"
            animationBegin={0}
            animationDuration={800}
            animationEasing="ease-out"
          >
            {detailChartData.map((entry, index) => (
              <Cell key={`cell-detail-${index}`} fill={entry.color} stroke="none" />
            ))}
          </Pie>

          <Tooltip content={<CustomTooltip hideValues={hideValues} />} />
        </PieChart>
      </ResponsiveContainer>
    )
  }

  // Função para renderizar a legenda do gráfico de detalhes
  const renderizarLegendaDetalhes = () => {
    if (!contextSelectedCategory) return null

    const categoryData = patrimonioNivel2[contextSelectedCategory]
    const categoryTitle = getCategoryTitle(contextSelectedCategory)

    console.log("=== renderizarLegendaDetalhes ===")
    console.log("contextSelectedCategory:", contextSelectedCategory)
    console.log("categoryData:", categoryData)

    if (!categoryData || !categoryData.items || categoryData.items.length === 0) {
      return (
        <div className="bg-neutral-800 text-white h-full flex items-center justify-center min-h-0">
          <div className="text-center p-4 text-neutral-400">
            <p className="mb-2">
              Dados detalhados para <strong>{categoryTitle}</strong> ainda não estão disponíveis.
            </p>
            <p>Por favor, importe os dados para esta categoria ou selecione outra categoria.</p>
          </div>
        </div>
      )
    }

    // Filtrar itens válidos e informativos
    const validDetailItems = categoryData.items.filter((item) => !isExcludedFromTotal(item))
    const mainColor = getCategoryTailwindColor(contextSelectedCategory) // ← Usando cores do Tailwind
    const validTotal = validDetailItems.reduce((sum, item) => sum + (item.rawValue || 0), 0)

    return (
      <div className="h-full bg-neutral-800 flex flex-col min-h-0">
        <div className="bg-neutral-800 m-2 p-2 rounded-lg flex-1">
          <h3 className="text-sm font-medium text-neutral-400 uppercase mb-2 border-b border-neutral-600 pb-1">
            Detalhes: {categoryTitle}
          </h3>
          <div className="overflow-y-auto max-h-[250px]">
            {/* Adicionar opção "Todos" no topo da legenda */}
            <div
              className={`flex items-center justify-between p-1 border-b border-neutral-600 cursor-pointer hover:bg-neutral-700 transition-colors transition-all duration-300 relative group ${contextSelectedSubcategory === null ? "bg-neutral-700 border-l-4" : ""
                }`}
              style={contextSelectedSubcategory === null ? { borderLeftColor: mainColor } : {}}
              onClick={() => {
                contextSetSelectedSubcategory(null)
                setActiveDetailIndex(null)
              }}
              title="Clique para ver todos os itens"
            >
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: mainColor }}></div>
                <div>
                  <div
                    className={`text-sm font-bold group-hover:text-opacity-80`}
                    style={{ color: contextSelectedSubcategory === null ? mainColor : "#ffffff" }}
                  >
                    Todos <span className="text-xs font-normal text-neutral-400">100%</span>
                  </div>
                </div>
              </div>
              <div className="text-xs text-neutral-400 text-right">
                {hideValues ? "••••••" : formatCurrency(validTotal)}
              </div>
            </div>

            {/* Itens válidos da legenda */}
            {validDetailItems.map((item, index) => {
              const itemColor = generateColorVariation(mainColor, index, validDetailItems.length)

              return (
                <div
                  key={index}
                  className={`flex items-center justify-between p-1 border-b border-neutral-600 cursor-pointer hover:bg-neutral-700 transition-colors transition-all duration-300 relative group ${contextSelectedSubcategory === item.id ? "bg-neutral-700 border-l-4" : ""
                    }`}
                  style={contextSelectedSubcategory === item.id ? { borderLeftColor: itemColor } : {}}
                  onClick={() => {
                    contextSetSelectedSubcategory(item.id)
                    setActiveDetailIndex(index)
                  }}
                  title="Clique para ver detalhes"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: itemColor }}></div>
                    <div>
                      <div
                        className={`text-sm font-bold group-hover:text-opacity-80`}
                        style={{ color: contextSelectedSubcategory === item.id ? itemColor : "#ffffff" }}
                      >
                        {item.label}{" "}
                        <span className="text-xs font-normal text-neutral-400">
                          {typeof item.percent === "number"
                            ? item.percent.toFixed(2)
                            : ((item.rawValue / validTotal) * 100).toFixed(2)}
                          %
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-neutral-400 text-right">{hideValues ? "••••••" : item.value}</div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  // Efeito para calcular a altura disponível para o conteúdo
  useEffect(() => {
    const calculateHeight = () => {
      if (headerRef.current) {
        const headerHeight = headerRef.current.offsetHeight
        const containerHeight = headerRef.current.parentElement.offsetHeight
        setContentHeight(containerHeight - headerHeight)
      }
    }

    calculateHeight()
    window.addEventListener("resize", calculateHeight)
    return () => window.removeEventListener("resize", calculateHeight)
  }, [])

  // Efeito para atualizar o activeIndex quando selectedCategory mudar
  useEffect(() => {
    if (contextSelectedCategory) {
      const index = chartData.findIndex((data) => data.id === contextSelectedCategory)
      setActiveIndex(index >= 0 ? index : null)
    } else {
      setActiveIndex(null)
      contextSetSelectedSubcategory(null)
    }
  }, [contextSelectedCategory, chartData, contextSetSelectedSubcategory])

  // Efeito para atualizar o activeDetailIndex quando selectedSubcategory mudar
  useEffect(() => {
    if (contextSelectedSubcategory && detailChartData.length > 0) {
      const index = detailChartData.findIndex((data) => data.id === contextSelectedSubcategory)
      setActiveDetailIndex(index >= 0 ? index : null)
    } else {
      setActiveDetailIndex(null)
    }
  }, [contextSelectedSubcategory, detailChartData])

  // Função para lidar com o clique na fatia do gráfico
  const handlePieClick = (data, index) => {
    if (!isFullVersion) return

    console.log("=== handlePieClick ===")
    console.log("data:", data)
    console.log("index:", index)

    const newIndex = index === activeIndex ? null : index
    setActiveIndex(newIndex)

    const newCategory = newIndex !== null ? chartData[index].id : null
    console.log("Selecionando categoria:", newCategory)

    contextSetSelectedCategory(newCategory)
  }

  // NOVO: Função para lidar com o clique nas barras
  const handleBarClick = (data, index) => {
    if (!isFullVersion) return

    console.log("=== handleBarClick ===")
    console.log("data:", data)
    console.log("index:", index)

    const barData = barChartData[index]
    if (barData) {
      const categoryIndex = chartData.findIndex((item) => item.id === barData.id)
      const newIndex = categoryIndex === activeIndex ? null : categoryIndex
      setActiveIndex(newIndex)

      const newCategory = newIndex !== null ? barData.id : null
      console.log("Selecionando categoria:", newCategory)

      contextSetSelectedCategory(newCategory)
    }
  }

  // NOVO: Função para lidar com o clique nas barras de detalhes
  const handleDetailBarClick = (data, index) => {
    if (!data || index === undefined) return

    console.log("=== handleDetailBarClick ===")
    console.log("data:", data)
    console.log("index:", index)

    setActiveDetailIndex(index === activeDetailIndex ? null : index)

    const detailBarData = detailChartData.map((item, idx) => ({
      name: item.category.length > 15 ? item.category.substring(0, 15) + "..." : item.category,
      value: item.value,
      percent: item.percent,
      fill: item.color,
      id: item.id,
      category: item.category,
    }))

    const newSubcategory = index === activeDetailIndex ? null : detailBarData[index]?.id
    console.log("Selecionando subcategoria:", newSubcategory)

    contextSetSelectedSubcategory(newSubcategory)
  }

  // Função para lidar com o clique na fatia do gráfico de detalhes
  const handleDetailPieClick = useCallback(
    (data, index) => {
      if (!data || index === undefined) return

      console.log("=== handleDetailPieClick ===")
      console.log("data:", data)
      console.log("index:", index)

      setActiveDetailIndex(index === activeDetailIndex ? null : index)

      const newSubcategory = index === activeDetailIndex ? null : detailChartData[index]?.id
      console.log("Selecionando subcategoria:", newSubcategory)

      contextSetSelectedSubcategory(newSubcategory)
    },
    [activeDetailIndex, detailChartData, contextSetSelectedSubcategory],
  )

  // Função para lidar com o clique na legenda
  const handleLegendClick = (item) => {
    if (isFullVersion) {
      console.log("=== handleLegendClick ===")
      console.log("item:", item)

      contextSetSelectedCategory(item.id)
      setActiveIndex(chartData.findIndex((data) => data.id === item.id))
    }
  }

  // Função para alternar visibilidade das séries
  const toggleSeriesVisibility = (index) => {
    if (hiddenSeries.includes(index)) {
      setHiddenSeries(hiddenSeries.filter((i) => i !== index))
    } else {
      setHiddenSeries([...hiddenSeries, index])
    }
  }

  // Função para formatar o timestamp da última atualização  
  const formatLastRefreshTime = (date) => {
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  return (
    <div className="bg-dark-200 text-neutral-200 h-full flex flex-col overflow-hidden">
      <StyleSheet />
      {/* Cabeçalho com acordeão */}
      <div ref={headerRef} className="sticky top-0 z-[1100] bg-dark-200">
        <div className="bg-dark-100 ">
          <div className="flex justify-between items-center p-1 pl-2">
            <div className="flex-1">
              <div>Patrimônio Resumido</div>
             
            </div>
            {/* Botões de ação no cabeçalho */}
            <div className="flex items-center gap-2">
              {/* Botão de refresh - sempre visível */}
              <RefreshButton onRefresh={handleRefresh} isRefreshing={isRefreshing} />

              {/* Dropdown customizado apenas na versão full */}
              {isFullVersion && (
                <CustomDropdown
                  chartType={chartType}
                  setChartType={setChartType}
                  showLegend={showLegend}
                  setShowLegend={setShowLegend}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo principal */}
      {isFullVersion ? (
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Cards de resumo - Usando cores do Tailwind */}
          <div className="bg-neutral-800 p-2 grid grid-cols-3 gap-2">
            <div className="bg-dark-100 rounded-lg p-2 shadow-md border-l-4 transition-transform hover:scale-[1.02]">
              <div className="flex justify-between items-center">
                <div className="text-xs uppercase text-neutral-400 mb-1">Patrimônio Total</div>
              </div>
              <div className="text-lg font-bold text-white">{hideValues ? "••••••" : formattedTotal}</div>
              <div className="text-xs text-neutral-400">Excluindo Futuros/Termo e Aluguel</div>
            </div>
            <div className="bg-dark-100 rounded-lg p-2 shadow-md border-l-4 transition-transform hover:scale-[1.02]">
              <div className="flex justify-between items-center">
                <div className="text-xs uppercase text-neutral-400 mb-1">Saldo em Conta</div>
              </div>
              <div className="text-lg font-bold text-white">{hideValues ? "••••••" : "R$ 10.000,00"}</div>
              <div className="text-xs text-neutral-400">10,00% do patrimônio</div>
            </div>
            <div className="bg-dark-100 rounded-lg p-2 shadow-md border-l-4 transition-transform hover:scale-[1.02]">
              <div className="flex justify-between items-center">
                <div className="text-xs uppercase text-neutral-400 mb-1">Carteira Total</div>
              </div>
              <div className="text-lg font-bold text-white">{hideValues ? "••••••" : "R$ 90.000,00"}</div>
              <div className="text-xs text-neutral-400">90,00% do patrimônio</div>
            </div>
          </div>

          {/* Versão Full - Gráficos */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Gráfico principal e legenda */}
            <div className="flex-1 flex flex-row min-h-0">
              <div className={`chart-container h-full min-h-0 ${showLegend ? "w-1/2" : "w-full"}`}>
                {/* Gráfico principal */}
                <div className="relative bg-neutral-800 h-full min-h-0" style={{ position: "relative" }}>
                  <button
                    className="absolute top-2.5 right-2.5 bg-neutral-600 text-white p-1 rounded-full hover:bg-neutral-500 transition-colors z-10"
                    onClick={() => setOpenDialog(true)}
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
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 16v-4" />
                      <path d="M12 8h.01" />
                    </svg>
                  </button>
                  <div className="w-full h-full min-h-0">
                    {renderMainChart()}
                    {chartType === "pie" && <CenterText title="Total" value={formattedTotal} hideValues={hideValues} />}
                  </div>
                </div>
              </div>

              {/* Legenda do gráfico principal - Com animação */}
              <div
                className={`legend-container h-full bg-neutral-800 min-h-0 ${showLegend ? "w-1/2 legend-enter-active" : "w-0 legend-exit-active"}`}
              >
                {showLegend && (
                  <div className="bg-neutral-800 m-2 p-2 rounded-lg h-full opacity-100 transform translate-x-0 transition-all duration-300">
                    <h3 className="text-sm font-medium text-neutral-400 uppercase mb-2 border-b border-neutral-600 pb-1">
                      Visão Geral
                    </h3>
                    <div className="overflow-y-auto" style={{ maxHeight: "calc(100% - 60px)" }}>
                      {chartData.map((item, index) => (
                        <div
                          key={index}
                          className={`flex items-center justify-between p-1 border-b border-neutral-600 cursor-pointer hover:bg-neutral-700 transition-colors transition-all duration-300 relative group ${contextSelectedCategory === item.id ? "bg-neutral-700 border-l-4" : ""
                            }`}
                          style={contextSelectedCategory === item.id ? { borderLeftColor: item.color } : {}}
                          onClick={() => handleLegendClick(item)}
                          title="Clique para ver detalhes"
                        >
                          <div className="flex items-center gap-2">
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{
                                backgroundColor: item.color,
                              }}
                            ></div>
                            <div>
                              <div
                                className={`text-sm font-bold group-hover:text-opacity-80`}
                                style={{ color: contextSelectedCategory === item.id ? item.color : "#ffffff" }}
                              >
                                {item.category}{" "}
                                <span className="text-xs font-normal text-neutral-400">
                                  {typeof item.percent === "number" ? item.percent.toFixed(2) : item.percent}%
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="text-xs text-neutral-400 text-right">
                            {hideValues ? "••••••" : formatCurrency(item.value)}
                          </div>
                        </div>
                      ))}

                      {/* Seção informativa para itens excluídos do patrimônio total */}
                      {chartData.filter((item) => item.isExcluded).length > 0 && (
                        <div className="mt-4 p-3 bg-dark-100 rounded-lg border-l-4 border-yellow-500">
                          <h4 className="text-sm font-semibold text-yellow-400 mb-2">
                            ⚠️ Atenção: Itens não inclusos no patrimônio total
                          </h4>
                          <div className="space-y-1">
                            {chartData
                              .filter((item) => item.isExcluded)
                              .map((item, index) => (
                                <div key={`info-${index}`} className="flex justify-between items-center text-xs">
                                  <span className="text-neutral-300">{item.category}:</span>
                                  <span className="text-yellow-400">
                                    {hideValues ? "••••••" : formatCurrency(item.value)}
                                  </span>
                                </div>
                              ))}
                          </div>
                          <p className="text-xs text-neutral-500 mt-2">
                            * Os itens acima são exibidos na legenda mas NÃO são somados ao patrimônio total
                          </p>
                        </div>
                      )}

                      {/* Patrimônio total com cores do Tailwind */}
                      <div className="flex items-center mt-4">
                        <div className="w-3 h-3 bg-gradient-to-r from-orange-500 to-blue-500 rounded-lg mr-2"></div>
                        <strong className="text-white text-sm">
                          Patrimônio Total: {hideValues ? "••••••" : formattedTotal}
                        </strong>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Gráfico de detalhes ou instrução */}
            <div className="flex-1 flex flex-row min-h-0">
              {contextSelectedCategory && detailChartData.length > 0 ? (
                <>
                  <div
                    className={`chart-container h-full bg-neutral-800 min-h-0 ${showLegend ? "w-1/2" : "w-full"}`}
                    style={{ position: "relative" }}
                  >
                    {/* Gráfico de detalhes */}
                    {renderDetailChart()}
                    {(chartType === "pie" || chartType === "radial") &&
                      contextSelectedCategory &&
                      detailChartData.length > 0 && (
                        <CenterText
                          title={getCategoryTitle(contextSelectedCategory)}
                          value={formatCurrency(detailChartData.reduce((sum, item) => sum + item.value, 0))}
                          hideValues={hideValues}
                        />
                      )}
                  </div>

                  {/* Legenda do gráfico de detalhes - Com animação */}
                  <div
                    className={`bg-neutral-800 legend-container h-full min-h-0 ${showLegend ? "w-1/2 legend-enter-active" : "w-0 legend-exit-active"}`}
                  >
                    {showLegend && (
                      <div className="opacity-100 transform translate-x-0 transition-all duration-300">
                        {renderizarLegendaDetalhes()}
                      </div>
                    )}
                  </div>
                </>
              ) : contextSelectedCategory ? (
                <div className="w-full h-full bg-neutral-800 flex items-center justify-center text-center text-sm text-neutral-400 min-h-0">
                  <div>
                    <p>Carregando dados para {getCategoryTitle(contextSelectedCategory)}...</p>
                    <p className="text-xs mt-2">
                      Categoria: {contextSelectedCategory} | Dados disponíveis: {detailChartData.length}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="w-full h-full bg-neutral-800 flex items-center justify-center text-center text-sm text-neutral-400 min-h-0">
                  <p>Clique em uma categoria no gráfico ou na legenda acima para ver detalhes</p>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Versão Light */}
          <div className="relative bg-neutral-800 h-2/3">
            <button
              className="absolute top-2.5 right-2.5 bg-neutral-600 text-white p-1 rounded-full hover:bg-neutral-500 transition-colors z-10"
              onClick={() => setOpenDialog(true)}
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
                <circle cx="12" cy="12" r="10" />
                <path d="M12 16v-4" />
                <path d="M12 8h.01" />
              </svg>
            </button>

            {/* Container do gráfico Recharts */}
            <div className="w-full h-full">
              {renderMainChart()}
              {(chartType === "pie" || chartType === "radial") && (
                <CenterText title="Total" value={formattedTotal} hideValues={hideValues} />
              )}
            </div>
          </div>

          {/* Botões de ação - Cores do Tailwind */}
          <div className="bg-neutral-800 p-1">
            <div className="flex gap-2 items-center justify-center">
              <button className="uppercase bg-blue-600 hover:bg-blue-700 text-white font-bold py-1 rounded w-[125px] text-center cursor-pointer transition-colors">
                Comprar
              </button>
              <button className="uppercase bg-orange-500 hover:bg-orange-600 text-white font-bold py-1 rounded w-[125px] text-center cursor-pointer transition-colors">
                Vender
              </button>
            </div>
          </div>

          {/* Legenda externa - Versão Light */}
          <div className="bg-neutral-800 p-2 text-white h-1/3 overflow-y-auto">
            <div className="bg-neutral-800 m-2 p-2 rounded-lg">
              <h3 className="text-sm font-medium text-neutral-400 uppercase mb-2 border-b border-neutral-600 pb-1">
                Visão Geral ({chartData.length} categorias)
              </h3>
              {chartData.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-1 border-b border-neutral-600 cursor-pointer hover:bg-neutral-700 transition-colors"
                  onClick={() => toggleSeriesVisibility(index)}
                >
                  <div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: item.color, opacity: hiddenSeries.includes(index) ? 0.5 : 1 }}
                  ></div>
                  <div className="flex-1">
                    <div className="text-sm font-bold">
                      {typeof item.percent === "number" ? item.percent.toFixed(2) : item.percent}% {item.category}
                    </div>
                  </div>
                  <div className="text-xs text-neutral-400">{hideValues ? "••••••" : formatCurrency(item.value)}</div>
                </div>
              ))}

              {/* Seção informativa para itens excluídos */}
              {chartData.filter((item) => item.isExcluded).length > 0 && (
                <div className="mt-4 p-3 bg-dark-100 rounded-lg border-l-4 border-yellow-500">
                  <h4 className="text-sm font-semibold text-yellow-400 mb-2">
                    ⚠️ Atenção: Itens não inclusos no patrimônio total
                  </h4>
                  <div className="space-y-1">
                    {chartData
                      .filter((item) => item.isExcluded)
                      .map((item, index) => (
                        <div key={`info-${index}`} className="flex justify-between items-center text-xs">
                          <span className="text-neutral-300">{item.category}:</span>
                          <span className="text-yellow-400">{hideValues ? "••••••" : formatCurrency(item.value)}</span>
                        </div>
                      ))}
                  </div>
                  <p className="text-xs text-neutral-500 mt-2">
                    * Os itens acima são exibidos na legenda mas NÃO são somados ao patrimônio total
                  </p>
                </div>
              )}

              {/* Patrimônio total com cores do Tailwind */}
              <div className="flex items-center mt-4 pt-4 border-t border-neutral-600">
                <div className="w-2.5 h-2.5 bg-gradient-to-r from-orange-500 to-blue-500 rounded mr-2"></div>
                <strong className="text-white text-sm">
                  Patrimônio Total: {hideValues ? "••••••" : formattedTotal}
                </strong>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Dialog de informações */}
      {openDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-dark-200 text-white p-4 rounded max-w-md">
            <p>
              Este gráfico representa a distribuição percentual da sua carteira.
              <br />
              {chartType === "pie" && "O valor total também está exibido no centro."}
              {chartType === "radial" && "Os valores são exibidos como barras radiais."}
              {chartType === "bar" && "Os valores são exibidos como barras verticais."}
              {chartType === "line" && "Os valores são exibidos como gráfico de linha."}
              {isFullVersion && (
                <>
                  <br />
                  <br />
                  Na versão completa, você pode:
                  <br />• Alternar entre visualização em Pizza, Radial, Barras e Linha
                  <br />• Controlar a exibição da legenda
                  <br />• Clicar em uma categoria no gráfico ou na legenda para ver detalhes da sua composição
                  <br />• Atualizar os dados a qualquer momento clicando no botão de refresh
                </>
              )}
              <br />
              <br />
              <strong>Nota:</strong> Ativos do tipo "Futuros", "Termos" e "Aluguel" não são incluídos no cálculo do
              patrimônio total, sendo exibidos apenas como informação adicional.
            </p>
            <div className="flex justify-end mt-4">
              <button
                className="bg-neutral-600 hover:bg-neutral-500 text-white px-4 py-2 rounded transition-colors"
                onClick={() => setOpenDialog(false)}
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}