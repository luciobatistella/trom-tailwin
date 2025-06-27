"use client"

import React from "react"

import { useState, useEffect, useCallback } from "react"
// CORRIGINDO TODAS AS IMPORTAÇÕES
import { patrimonioResumido as patrimonioNivel1 } from "../data/patrimonioResumido"
import { rfPrivadaData } from "../data/dataRFPrivada"
import { fundosData } from "../data/dataFundos"
import { rendaVariavel } from "../data/dataRendaVariavel"
import { rfPublicaData } from "../data/dataRFPublica"
import { dataSaldoAttachment } from "../data/dataSaldo"
import { dataTesouro } from "../data/dataTesouro"
import { garantiasData } from "../data/dataGarantias"

// Importando funções auxiliares
import { formatCurrency } from "../utils/formatCurrency"
// Importando o contexto
import { usePatrimonio } from "../context/patrimonioContext"
// Importando o componente de detalhes
import DetalhesDarteira from "./detalhes-dashboard"
// Importando o novo componente MeusAtivosGrid
import MeusAtivosGrid from "./meus-ativos-grid"
import DetalhesDashboard from "./detalhes-dashboard"

// Mapeamento das cores do Tailwind por categoria
const getCategoryTailwindColor = (categoryId) => {
  const colorMap = {
    rendaVariavel: '#eab308',     // yellow-500 (Amarelo)
    rfPublica: '#22c55e',         // green-500 (Verde)
    rfPrivada: '#3b82f6',         // blue-500 (Azul)
    fundos: '#ec4899',            // pink-500 (Rosa)
    saldoConta: '#8b5cf6',        // violet-500 (Roxo)
    garantias: '#f97316',         // orange-500 (Laranja)
    tesouroDireto: '#ef4444',     // red-500 (Vermelho)
  }
  return colorMap[categoryId] || '#6b7280' // gray-500 como fallback
}

// Função para calcular o total do patrimônio
const calcularTotalPatrimonio = () => {
  return patrimonioNivel1.reduce((total, item) => total + item.rawValue, 0)
}

// CORRIGINDO O OBJETO patrimonioNivel2 - MAPEAMENTO CORRETO DOS IDs
const patrimonioNivel2 = {
  rendaVariavel: rendaVariavel,
  rfPublica: rfPublicaData,
  rfPrivada: rfPrivadaData,
  fundos: fundosData,
  saldoConta: dataSaldoAttachment,
  garantias: garantiasData,
  tesouroDireto: dataTesouro,
}

// Função para gerar variações de cor baseada em cores do Tailwind
function generateColorVariation(baseColor, index, total) {
  const r = parseInt(baseColor.slice(1, 3), 16)
  const g = parseInt(baseColor.slice(3, 5), 16)
  const b = parseInt(baseColor.slice(5, 7), 16)

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

// Adicione este log logo após a definição do objeto:
console.log("DADOS DISPONÍVEIS (FULL):", {
  rendaVariavel: !!rendaVariavel,
  rfPublica: !!rfPublicaData,
  rfPrivada: !!rfPrivadaData,
  fundos: !!fundosData,
  saldoConta: !!dataSaldoAttachment,
  garantias: !!garantiasData,
})
console.log("ESTRUTURA rfPublicaData (FULL):", rfPublicaData)
console.log("ESTRUTURA garantiasData (FULL):", garantiasData)

// Debug do mapeamento
console.log("=== DEBUG PatrimonioResumidoFull ===")
console.log(
  "patrimonioNivel1 IDs:",
  patrimonioNivel1.map((item) => item.id),
)
console.log("patrimonioNivel2 keys:", Object.keys(patrimonioNivel2))
console.log("rfPublicaData:", rfPublicaData)
console.log("garantiasData:", garantiasData)

// Componente para renderizar badge de posição
const PosicaoBadge = ({ value, hideValues }) => {
  if (hideValues) return "••••••"

  const numValue = typeof value === "number" ? value : Number.parseFloat(value) || 0
  const isPositive = numValue >= 0
  const formattedValue = `${numValue.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%`

  return (
    <span
      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
        isPositive
          ? "bg-green-100 text-green-800 border border-green-200"
          : "bg-red-100 text-red-800 border border-red-200"
      }`}
    >
      {isPositive ? "+" : ""}
      {formattedValue}
    </span>
  )
}

// Componentes Skeleton - Usando cores do Tailwind
const CategoryCardSkeleton = () => (
  <div className="bg-dark-100 rounded-lg p-3 border-2 border-neutral-600 animate-pulse">
    <div className="w-full h-1 bg-neutral-600 rounded-full mb-2" />
    <div className="text-center mb-1">
      <div className="h-3 bg-neutral-600 rounded mx-auto w-3/4 mb-1" />
    </div>
    <div className="text-center mb-1">
      <div className="h-6 bg-neutral-600 rounded mx-auto w-1/2" />
    </div>
    <div className="text-center mb-2">
      <div className="h-2 bg-neutral-600 rounded mx-auto w-2/3" />
    </div>
    <div className="w-full bg-dark-200 rounded-full h-1">
      <div className="h-1 bg-neutral-600 rounded-full w-1/2" />
    </div>
  </div>
)

const SubcategoryCardSkeleton = () => (
  <div className="bg-neutral-800 rounded-md p-3 border-2 border-neutral-600 animate-pulse">
    <div className="w-full h-0.5 bg-neutral-600 rounded-full mb-2" />
    <div className="text-center mb-2">
      <div className="h-3 bg-neutral-600 rounded mx-auto w-3/4" />
    </div>
    <div className="text-center mb-1">
      <div className="h-4 bg-neutral-600 rounded mx-auto w-1/2" />
    </div>
    <div className="text-center mb-2">
      <div className="h-3 bg-neutral-600 rounded mx-auto w-2/3" />
    </div>
    <div className="w-full bg-neutral-900 rounded-full h-1">
      <div className="h-1 bg-neutral-600 rounded-full w-1/3" />
    </div>
  </div>
)

const TableSkeleton = () => (
  <div className="mt-6 animate-pulse">
    <div className="h-6 bg-neutral-600 rounded w-1/3 mb-3" />
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead>
          <tr className="border-b border-neutral-600">
            {[1, 2, 3, 4, 5, 6, 7].map((i) => (
              <th key={i} className="py-2 px-3">
                <div className="h-3 bg-neutral-600 rounded w-full" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {[1, 2, 3, 4, 5].map((row) => (
            <tr key={row} className="border-b border-neutral-600">
              {[1, 2, 3, 4, 5, 6, 7].map((col) => (
                <td key={col} className="py-2 px-3">
                  <div className="h-4 bg-neutral-600 rounded w-full" />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
)

const ProgressBarSkeleton = () => (
  <div className="mb-4 animate-pulse">
    <div className="flex h-3 rounded-lg overflow-hidden bg-neutral-900 border border-neutral-600">
      <div className="w-1/4 bg-neutral-600" />
      <div className="w-1/5 bg-neutral-500" />
      <div className="w-1/6 bg-neutral-400" />
      <div className="w-1/8 bg-neutral-300" />
      <div className="flex-1 bg-neutral-600" />
    </div>
    <div className="text-xs text-center mt-1">
      <div className="h-3 bg-neutral-600 rounded mx-auto w-1/2" />
    </div>
  </div>
)

const AccordionSkeleton = () => (
  <div className="p-3 flex flex-col gap-1 animate-pulse">
    <div className="h-3 bg-neutral-600 rounded w-1/4 mb-1" />
    <div className="border-t border-neutral-600 my-1"></div>

    {[1, 2, 3, 4, 5, 6].map((i) => (
      <div key={i}>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-neutral-600 rounded-full" />
            <div className="h-3 bg-neutral-600 rounded w-20" />
          </div>
          <div className="h-3 bg-neutral-600 rounded w-24" />
        </div>
        <div className="border-t border-neutral-600 my-1"></div>
      </div>
    ))}
  </div>
)

const SectionTitleSkeleton = () => (
  <div className="mb-3 animate-pulse">
    <div className="h-4 bg-neutral-600 rounded w-1/3 mb-1" />
    <div className="w-full h-px bg-neutral-600 mt-1"></div>
  </div>
)

const SubcategoryProgressSkeleton = () => (
  <div className="mb-4 animate-pulse">
    <div className="flex h-2 rounded-md overflow-hidden bg-neutral-900 border border-neutral-600">
      <div className="w-1/4 bg-neutral-600" />
      <div className="w-1/5 bg-neutral-500" />
      <div className="w-1/6 bg-neutral-400" />
      <div className="w-1/8 bg-neutral-300" />
      <div className="flex-1 bg-neutral-600" />
    </div>
    <div className="text-xs text-center mt-1">
      <div className="h-3 bg-neutral-600 rounded mx-auto w-1/2" />
    </div>
  </div>
)

const SubcategoryGridSkeleton = () => (
  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-2">
    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
      <SubcategoryCardSkeleton key={i} />
    ))}
  </div>
)

const EmptyStateSkeleton = () => (
  <div className="text-center p-8 animate-pulse">
    <div className="h-4 bg-neutral-600 rounded mx-auto w-1/2" />
  </div>
)

const HeaderSkeleton = () => (
  <div className="bg-dark-100 animate-pulse">
    <div className="flex justify-between items-center p-2">
      <div className="flex-1">
        <div className="h-4 bg-neutral-600 rounded w-1/3 mb-1" />
        <div className="h-3 bg-neutral-600 rounded w-1/2" />
      </div>
      <div className="w-6 h-6 bg-neutral-600 rounded" />
    </div>
  </div>
)

const MyAssetsHeaderSkeleton = () => (
  <div className="mt-6 animate-pulse">
    <div className="h-6 bg-neutral-600 rounded w-1/3 mb-3" />
  </div>
)

const NoAssetsMessageSkeleton = () => (
  <div className="mt-6 text-center p-4 border border-neutral-600 rounded animate-pulse">
    <div className="h-4 bg-neutral-600 rounded mx-auto w-3/4" />
  </div>
)

const TableRowSkeleton = ({ columns }) => (
  <tr className="border-b border-neutral-600 animate-pulse">
    {columns.map((_, index) => (
      <td key={index} className="py-2 px-3">
        <div className="h-4 bg-neutral-600 rounded w-full" />
      </td>
    ))}
  </tr>
)

const TableHeaderSkeleton = ({ columns }) => (
  <thead>
    <tr className="border-b border-neutral-600">
      {columns.map((_, index) => (
        <th key={index} className="py-2 px-3">
          <div className="h-3 bg-neutral-600 rounded w-full animate-pulse" />
        </th>
      ))}
    </tr>
  </thead>
)

const AssetsTableSkeleton = ({ title, columnCount = 7, rowCount = 5 }) => (
  <div className="mt-6 animate-pulse">
    <div className="h-6 bg-neutral-600 rounded w-1/3 mb-3" />
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <TableHeaderSkeleton columns={Array(columnCount).fill(null)} />
        <tbody>
          {Array(rowCount)
            .fill(null)
            .map((_, index) => (
              <TableRowSkeleton key={index} columns={Array(columnCount).fill(null)} />
            ))}
        </tbody>
      </table>
    </div>
  </div>
)

export default function PatrimonioResumidoFull() {
  // Usando o contexto compartilhado
  const {
    selectedCategory: contextSelectedCategory,
    setSelectedCategory: contextSetSelectedCategory,
    selectedSubcategory: contextSelectedSubcategory,
    setSelectedSubcategory: contextSetSelectedSubcategory,
    hideValues,
  } = usePatrimonio()

  // Estados locais
  const [openAccordion, setOpenAccordion] = useState(false)
  const [activeTab, setActiveTab] = useState(contextSelectedCategory)
  const [selectedAtivo, setSelectedAtivo] = useState(null)
  const [showSidebar, setShowSidebar] = useState(false)

  // NOVOS ESTADOS PARA BREADCRUMB
  const [categoriaAtual, setCategoriaAtual] = useState(null)
  const [subcategoriaAtual, setSubcategoriaAtual] = useState(null)

  // Estado para controlar o carousel de subcategorias
  const [carouselIndex, setCarouselIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const cardsPerPage = 5

  // Estados para controlar a ordenação
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  })

  // Estados de loading
  const [isLoadingCategories, setIsLoadingCategories] = useState(true)
  const [isLoadingSubcategories, setIsLoadingSubcategories] = useState(false)
  const [isLoadingTable, setIsLoadingTable] = useState(false)
  const [isLoadingAccordion, setIsLoadingAccordion] = useState(true)
  const [isLoadingHeader, setIsLoadingHeader] = useState(true)
  const [isLoadingEmptyState, setIsLoadingEmptyState] = useState(false)
  const [isLoadingAssetsHeader, setIsLoadingAssetsHeader] = useState(false)
  const [isLoadingAssetsTable, setIsLoadingAssetsTable] = useState(false)
  const [isLoadingNoAssetsMessage, setIsLoadingNoAssetsMessage] = useState(false)

  // Simular carregamento inicial SEQUENCIAL
  useEffect(() => {
    const headerTimer = setTimeout(() => {
      setIsLoadingHeader(false)

      const accordionTimer = setTimeout(() => {
        setIsLoadingAccordion(false)

        const categoriesTimer = setTimeout(() => {
          setIsLoadingCategories(false)
        }, 200)

        return () => clearTimeout(categoriesTimer)
      }, 150)

      return () => clearTimeout(accordionTimer)
    }, 100)

    return () => clearTimeout(headerTimer)
  }, [])

  // Calcular o valor total do patrimônio
  const totalPatrimonio = calcularTotalPatrimonio()
  const formattedTotal = formatCurrency(totalPatrimonio)

  // Efeito para sincronizar o activeTab com o selectedCategory
  useEffect(() => {
    setActiveTab(contextSelectedCategory)
  }, [contextSelectedCategory])

  // Adicione este useEffect após os outros useEffects existentes
  useEffect(() => {
    // Garantir que ao carregar uma categoria, sempre comece com "Todos" selecionado
    if (contextSelectedCategory) {
      contextSetSelectedSubcategory(null)
      console.log("Resetando subcategoria para 'Todos'")
    }
  }, [contextSelectedCategory, contextSetSelectedSubcategory])

  // Função para obter o título da categoria selecionada
  const getCategoryTitle = (categoryId) => {
    console.log("CHAMADA getCategoryTitle para:", categoryId)

    // Verificação de segurança
    if (!categoryId) {
      console.error("categoryId é undefined ou null")
      return "Categoria Desconhecida"
    }

    // Mapeamento direto para categorias conhecidas
    const titleMap = {
      rendaVariavel: "Renda Variável",
      rfPublica: "Renda Fixa Pública",
      rfPrivada: "Renda Fixa Privada",
      fundos: "Fundos",
      saldoConta: "Saldo em Conta",
      saldo: "Saldo em Conta",
      garantias: "Garantias",
    }

    // Verificar no mapa direto primeiro
    if (titleMap[categoryId]) {
      return titleMap[categoryId]
    }

    // Tentar obter do objeto de dados
    const categoryData = patrimonioNivel2[categoryId]
    if (categoryData && categoryData.title) {
      return categoryData.title
    }

    // Tentar encontrar no patrimonioNivel1
    const categoryInfo = patrimonioNivel1.find((item) => item.id === categoryId)
    if (categoryInfo) {
      return categoryInfo.label
    }

    // Fallback
    return categoryId
  }

  // Função para lidar com o clique em uma categoria - SEQUENCIAL
  const handleCategoryClick = (categoryId) => {
    console.log("=== handleCategoryClick ===")
    console.log("categoryId:", categoryId)
    console.log("Dados disponíveis para esta categoria:", patrimonioNivel2[categoryId])

    // Resetar todos os estados
    setIsLoadingSubcategories(true)
    setIsLoadingTable(false)
    setIsLoadingEmptyState(false)
    setIsLoadingAssetsHeader(false)
    setIsLoadingAssetsTable(false)
    setIsLoadingNoAssetsMessage(false)

    // Resetar o índice do carousel quando mudar de categoria
    setCarouselIndex(0)
    setIsTransitioning(false)

    contextSetSelectedCategory(categoryId)
    contextSetSelectedSubcategory(null) // SEMPRE selecionar "Todos" para qualquer categoria
    setActiveTab(categoryId)
    setSelectedAtivo(null)
    setShowSidebar(false)

    // 1. Primeiro carrega subcategorias
    setTimeout(() => {
      setIsLoadingSubcategories(false)

      // 2. Depois carrega tabela
      setTimeout(() => {
        setIsLoadingTable(true)
        setTimeout(() => {
          setIsLoadingTable(false)

          // 3. Por último carrega elementos dos ativos
          setIsLoadingAssetsHeader(true)
          setIsLoadingAssetsTable(true)
          setIsLoadingNoAssetsMessage(true)

          setTimeout(() => {
            setIsLoadingAssetsHeader(false)
            setIsLoadingAssetsTable(false)
            setIsLoadingNoAssetsMessage(false)
            setIsLoadingEmptyState(false)
          }, 150)
        }, 100)
      }, 50)
    }, 150)
  }

  // Função para lidar com o clique em uma subcategoria - SEQUENCIAL
  const handleSubcategoryClick = (subcategoryId) => {
    console.log("=== handleSubcategoryClick ===")
    console.log("subcategoryId:", subcategoryId)

    // Resetar estados
    setIsLoadingTable(false)
    setIsLoadingAssetsHeader(false)
    setIsLoadingAssetsTable(false)
    setIsLoadingNoAssetsMessage(false)

    // Permitir null para "Todos"
    contextSetSelectedSubcategory(subcategoryId)
    setSelectedAtivo(null)
    setShowSidebar(false)

    // 1. Primeiro carrega tabela
    setIsLoadingTable(true)
    setTimeout(() => {
      setIsLoadingTable(false)

      // 2. Depois carrega elementos dos ativos
      setIsLoadingAssetsHeader(true)
      setIsLoadingAssetsTable(true)
      setIsLoadingNoAssetsMessage(true)

      setTimeout(() => {
        setIsLoadingAssetsHeader(false)
        setIsLoadingAssetsTable(false)
        setIsLoadingNoAssetsMessage(false)
      }, 100)
    }, 150)
  }

  // FUNÇÃO MODIFICADA PARA BREADCRUMB
  const handleAtivoClick = React.useCallback((ativo, categoria, subcategoria) => {
    console.log("=== handleAtivoClick INICIADO ===")
    console.log("1. Ativo recebido:", ativo)
    console.log("2. Categoria:", categoria)
    console.log("3. Subcategoria:", subcategoria)

    setSelectedAtivo(ativo)
    setCategoriaAtual(categoria)
    setSubcategoriaAtual(subcategoria)
    setShowSidebar(true)

    console.log("4. handleAtivoClick CONCLUÍDO")
  }, [])

  // Adicione este useEffect para monitorar mudanças no selectedAtivo
  useEffect(() => {
    console.log("🔍 USEEFFECT selectedAtivo mudou:", selectedAtivo)
    console.log("🔍 USEEFFECT showSidebar mudou:", showSidebar)
    console.log("🔍 USEEFFECT selectedAtivo tipo:", typeof selectedAtivo)
    console.log("🔍 USEEFFECT selectedAtivo é null?", selectedAtivo === null)
    console.log("🔍 USEEFFECT selectedAtivo é undefined?", selectedAtivo === undefined)

    // Log adicional para ver se o objeto tem as propriedades esperadas
    if (selectedAtivo) {
      console.log("🔍 USEEFFECT selectedAtivo.codigo:", selectedAtivo.codigo)
      console.log("🔍 USEEFFECT selectedAtivo.nome:", selectedAtivo.nome)
      console.log("🔍 USEEFFECT selectedAtivo keys:", Object.keys(selectedAtivo))
    }
  }, [selectedAtivo, showSidebar])

  // Função para fechar o modal de detalhes
  const handleCloseDetalhes = () => {
    setShowSidebar(false)
    setSelectedAtivo(null)
    setCategoriaAtual(null)
    setSubcategoriaAtual(null)
  }

  // Funções para controlar o carousel com animação
  const nextCarouselPage = () => {
    const categoryData = patrimonioNivel2[contextSelectedCategory]
    if (!categoryData || !categoryData.items || isTransitioning) return

    const totalItems = categoryData.items.length + 1 // +1 para o card "Todos"
    const totalPages = Math.ceil(totalItems / cardsPerPage)

    setIsTransitioning(true)
    setTimeout(() => {
      setCarouselIndex((prevIndex) => (prevIndex + 1) % totalPages)
      setTimeout(() => setIsTransitioning(false), 50)
    }, 150)
  }

  const prevCarouselPage = () => {
    const categoryData = patrimonioNivel2[contextSelectedCategory]
    if (!categoryData || !categoryData.items || isTransitioning) return

    const totalItems = categoryData.items.length + 1 // +1 para o card "Todos"
    const totalPages = Math.ceil(totalItems / cardsPerPage)

    setIsTransitioning(true)
    setTimeout(() => {
      setCarouselIndex((prevIndex) => (prevIndex - 1 + totalPages) % totalPages)
      setTimeout(() => setIsTransitioning(false), 50)
    }, 150)
  }

  const goToCarouselPage = (pageIndex) => {
    if (isTransitioning) return

    setIsTransitioning(true)
    setTimeout(() => {
      setCarouselIndex(pageIndex)
      setTimeout(() => setIsTransitioning(false), 50)
    }, 150)
  }

  // Função para renderizar os cards de categoria com layout compacto
  const renderCategoryCards = () => {
    if (isLoadingCategories) {
      return (
        <div className="mb-6">
          <ProgressBarSkeleton />
          <div className="grid grid-cols-7 gap-2">
            {[1, 2, 3, 4, 5, 6, 7].map((i) => (
              <CategoryCardSkeleton key={i} />
            ))}
          </div>
        </div>
      )
    }

    return (
      <div className="mb-6">
        {/* Barra de progresso visual mostrando a composição total */}
        {/* <div className="mb-4">
          <div className="flex h-3 rounded-lg overflow-hidden bg-neutral-900 border border-neutral-600">
            {patrimonioNivel1.map((item) => {
              const percentage = parseFloat(item.percent.replace("%", ""))
              const tailwindColor = getCategoryTailwindColor(item.id)
              
              return (
                <div
                  key={item.id}
                  className="transition-all duration-300 hover:opacity-80"
                  style={{
                    width: `${percentage}%`,
                    backgroundColor: tailwindColor, // ← Usando cores do Tailwind
                  }}
                  title={`${item.label}: ${item.percent}`}
                />
              )
            })}
          </div>
          <div className="text-xs text-neutral-400 text-center mt-1">
            Composição do Patrimônio Total: {hideValues ? "••••••" : formattedTotal}
          </div>
        </div> */}

        {/* Layout compacto para os cards de categoria */}
        <div className="grid grid-cols-7 gap-2">
          {patrimonioNivel1.map((item) => {
            const isActive = activeTab === item.id
            const percentage = parseFloat(item.percent.replace("%", ""))
            const tailwindColor = getCategoryTailwindColor(item.id) // ← Usando cores do Tailwind

            return (
              <div
                key={item.id}
                className={`relative cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                  isActive ? "scale-105" : ""
                }`}
                onClick={() => handleCategoryClick(item.id)}
              >
                {/* Card principal com altura fixa */}
                <div
                  className={`bg-dark-100 rounded-lg p-2 border-2 transition-all duration-300 h-32 flex flex-col justify-between ${
                    isActive ? "border-white shadow-lg" : "border-neutral-600 hover:border-neutral-500"
                  }`}
                  style={isActive ? { borderColor: tailwindColor } : {}}
                >
                  {/* Indicador de cor no topo */}
                  <div className="w-full h-1 rounded-full mb-2" style={{ backgroundColor: tailwindColor }} />

                  {/* Nome da categoria - SEMPRE 2 LINHAS */}
                  <div className="text-center mb-1 flex-shrink-0">
                    <h3 className="text-xs font-bold text-white leading-tight h-8 flex items-center justify-center">
                      <span className="line-clamp-2 text-center">{item.label}</span>
                    </h3>
                  </div>

                  {/* Conteúdo central flexível */}
                  <div className="flex-1 flex flex-col justify-center">
                    {/* Porcentagem destacada */}
                    <div className="text-center mb-1">
                      <div className="text-lg font-bold" style={{ color: tailwindColor }}>
                        {item.percent}
                      </div>
                    </div>

                    {/* Valor */}
                    <div className="text-center mb-2">
                      <div className="text-xs text-neutral-400 font-medium">{hideValues ? "••••••" : item.value}</div>
                    </div>
                  </div>

                  {/* Barra de progresso individual - sempre no final */}
                  <div className="mt-auto">
                    <div className="w-full bg-dark-200 rounded-full h-1">
                      <div
                        className="h-1 rounded-full transition-all duration-500"
                        style={{
                          width: `${percentage}%`,
                          backgroundColor: tailwindColor,
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Indicador de seleção */}
                {isActive && (
                  <div className="absolute -top-1 -right-1">
                    <div
                      className="w-4 h-4 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: tailwindColor }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="10"
                        height="10"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="white"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  // Função para renderizar subcategorias
  const renderSubcategoryButtons = (categoryId) => {
    console.log("=== RASTREAMENTO DO CATEGORY ID ===")
    console.log("categoryId recebido:", categoryId)
    console.log("contextSelectedCategory:", contextSelectedCategory)
    console.log("activeTab:", activeTab)

    // Verificar se o categoryId está vindo de algum lugar incorreto
    if (categoryId === "tesouroDireto") {
      console.error("❌ ENCONTRADO ID INCORRETO 'tesouroDireto'!")
      console.trace("Stack trace para encontrar a origem:")
    }

    console.log("=== renderSubcategoryButtons DETALHADO ===")
    console.log("categoryId recebido:", categoryId)
    console.log("patrimonioNivel2 completo:", patrimonioNivel2)
    console.log("patrimonioNivel2[categoryId]:", patrimonioNivel2[categoryId])

    // Verificar se o categoryId existe no patrimonioNivel2
    if (!patrimonioNivel2[categoryId]) {
      console.error(`ERRO: categoryId '${categoryId}' não encontrado em patrimonioNivel2`)
      console.log("Chaves disponíveis:", Object.keys(patrimonioNivel2))
      return null
    }

    const categoryData = patrimonioNivel2[categoryId]
    console.log("categoryData encontrado:", categoryData)
    console.log("categoryData.items:", categoryData?.items)
    console.log("categoryData.items.length:", categoryData?.items?.length)

    if (!categoryData || !categoryData.items || categoryData.items.length === 0) {
      console.log("Sem dados para renderizar subcategorias")
      return null
    }

    // NOVA VERIFICAÇÃO: Não mostrar subcategorias se as categorias ainda estão carregando
    if (isLoadingCategories) {
      return null
    }

    if (isLoadingSubcategories) {
      return (
        <div className="mb-6">
          <SectionTitleSkeleton />
          <SubcategoryProgressSkeleton />
          <SubcategoryGridSkeleton />
        </div>
      )
    }

    // Usar cores do Tailwind em vez de hardcoded
    const mainColor = getCategoryTailwindColor(categoryId)

    console.log("mainColor:", mainColor)

    // Calcular o total da categoria para as porcentagens
    const totalCategoria = categoryData.total

    // Preparar todos os cards (incluindo o "Todos")
    const allCards = [
      // Card "Todos"
      {
        id: null,
        isAll: true,
        render: () => (
          <div
            key="todos"
            className={`relative cursor-pointer transition-all duration-300 transform hover:scale-105 ${
              contextSelectedSubcategory === null ? "scale-105" : ""
            } ${isTransitioning ? "opacity-50" : "opacity-100"}`}
            onClick={() => handleSubcategoryClick(null)}
          >
            <div
              className={`bg-neutral-800 rounded-md p-3 border-2 transition-all duration-300 ${
                contextSelectedSubcategory === null ? "border-white shadow-md" : "border-neutral-600 hover:border-neutral-500"
              }`}
              style={contextSelectedSubcategory === null ? { borderColor: mainColor } : {}}
            >
              {/* Indicador de cor no topo */}
              <div className="w-full h-0.5 rounded-full mb-2" style={{ backgroundColor: mainColor }} />

              {/* Nome da subcategoria */}
              <div className="text-center mb-2">
                <h5 className="text-xs font-semibold text-white leading-tight">Todos</h5>
              </div>

              {/* Porcentagem */}
              <div className="text-center mb-1">
                <div className="text-sm font-bold" style={{ color: mainColor }}>
                  100%
                </div>
              </div>

              {/* Valor */}
              <div className="text-center mb-2">
                <div className="text-xs text-neutral-400 font-medium">
                  {hideValues ? "••••••" : formatCurrency(totalCategoria)}
                </div>
              </div>

              {/* Mini barra de progresso */}
              <div className="w-full bg-neutral-900 rounded-full h-1">
                <div
                  className="h-1 rounded-full transition-all duration-500"
                  style={{
                    width: "100%",
                    backgroundColor: mainColor,
                  }}
                />
              </div>

              {/* Contador de ativos */}
              <div className="text-center mt-1">
                <div className="text-xs text-neutral-500 font-medium">
                  {categoryData.items.reduce((total, item) => total + (item.ativos?.length || 0), 0)} ativos
                </div>
              </div>
            </div>

            {/* Indicador de seleção */}
            {contextSelectedSubcategory === null && (
              <div className="absolute -top-1 -right-1">
                <div
                  className="w-3 h-3 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: mainColor }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="8"
                    height="8"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
              </div>
            )}
          </div>
        ),
      },
      // Cards das subcategorias
      ...categoryData.items.map((item, index) => {
        const itemColor = generateColorVariation(mainColor, index, categoryData.items.length)
        const isActive = contextSelectedSubcategory === item.id

        // Calcular porcentagem baseada no valor bruto se disponível
        const rawValue = item.rawValue || parseFloat(item.value.replace(/[^\d,.-]/g, "").replace(",", ".")) || 0
        const percentage = totalCategoria > 0 ? (rawValue / totalCategoria) * 100 : 0

        return {
          id: item.id,
          isAll: false,
          render: () => (
            <div
              key={item.id}
              className={`relative cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                isActive ? "scale-105" : ""
              } ${isTransitioning ? "opacity-50" : "opacity-100"}`}
              onClick={() => handleSubcategoryClick(item.id)}
            >
              {/* Card da subcategoria */}
              <div
                className={`bg-neutral-800 rounded-md p-3 border-2 transition-all duration-300 ${
                  isActive ? "border-white shadow-md" : "border-neutral-600 hover:border-neutral-500"
                }`}
                style={isActive ? { borderColor: itemColor } : {}}
              >
                {/* Indicador de cor no topo */}
                <div className="w-full h-0.5 rounded-full mb-2" style={{ backgroundColor: itemColor }} />

                {/* Nome da subcategoria */}
                <div className="text-center mb-2">
                  <h5 className="text-xs font-semibold text-white leading-tight line-clamp-2">{item.label}</h5>
                </div>

                {/* Porcentagem */}
                <div className="text-center mb-1">
                  <div className="text-sm font-bold" style={{ color: itemColor }}>
                    {percentage.toFixed(2).replace(".", ",")}%
                  </div>
                </div>

                {/* Valor */}
                <div className="text-center mb-2">
                  <div className="text-xs text-neutral-400 font-medium">{hideValues ? "••••••" : item.value}</div>
                </div>

                {/* Mini barra de progresso */}
                <div className="w-full bg-neutral-900 rounded-full h-1">
                  <div
                    className="h-1 rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(percentage, 100)}%`,
                      backgroundColor: itemColor,
                    }}
                  />
                </div>

                {/* Contador de ativos */}
                <div className="text-center mt-1">
                  <div className="text-xs text-neutral-500 font-medium">{item.ativos?.length || 0} ativos</div>
                </div>
              </div>

              {/* Indicador de seleção */}
              {isActive && (
                <div className="absolute -top-1 -right-1">
                  <div
                    className="w-3 h-3 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: itemColor }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="8"
                      height="8"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="white"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                </div>
              )}
            </div>
          ),
        }
      }),
    ]

    // Verificar se precisamos de um carousel
    const needsCarousel = allCards.length > cardsPerPage

    // Calcular o número total de páginas
    const totalPages = Math.ceil(allCards.length / cardsPerPage)

    // Obter os cards para a página atual
    const startIndex = carouselIndex * cardsPerPage
    const visibleCards = needsCarousel ? allCards.slice(startIndex, startIndex + cardsPerPage) : allCards

    return (
      <div className="mb-6">
        {/* Título da seção de subcategorias */}
        <div className="mb-3">
          <h4 className="text-sm font-semibold text-neutral-400 uppercase tracking-wider">
            Subcategorias de {getCategoryTitle(categoryId)}
          </h4>
          <div className="w-full h-px bg-gradient-to-r from-transparent via-neutral-600 to-transparent mt-1"></div>
        </div>

        {/* Barra de progresso das subcategorias */}
        <div className="mb-4">
          <div className="flex h-2 rounded-md overflow-hidden bg-neutral-900 border border-neutral-600">
            {categoryData.items.map((item, index) => {
              const itemColor = generateColorVariation(mainColor, index, categoryData.items.length)
              // Calcular porcentagem baseada no valor bruto se disponível
              const rawValue =
                item.rawValue || parseFloat(item.value.replace(/[^\d,.-]/g, "").replace(",", ".")) || 0
              const percentage = totalCategoria > 0 ? (rawValue / totalCategoria) * 100 : 0

              return (
                <div
                  key={item.id}
                  className="transition-all duration-300 hover:opacity-80 cursor-pointer"
                  style={{
                    width: `${percentage}%`,
                    backgroundColor: itemColor,
                  }}
                  title={`${item.label}: ${percentage.toFixed(2).replace(".", ",")}%`}
                  onClick={() => handleSubcategoryClick(item.id)}
                />
              )
            })}
          </div>
          <div className="text-xs text-neutral-500 text-center mt-1">
            Distribuição das subcategorias - Total: {hideValues ? "••••••" : formatCurrency(totalCategoria)}
          </div>
        </div>

        {/* Grid de cards das subcategorias com carousel se necessário */}
        <div className="relative">
          {/* Botões de navegação do carousel */}
          {needsCarousel && (
            <>
              <button
                onClick={prevCarouselPage}
                disabled={isTransitioning}
                className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-dark-100 hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-full p-2 shadow-lg transition-all duration-200 hover:scale-110"
                aria-label="Página anterior"
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
                  <path d="m15 18-6-6 6-6" />
                </svg>
              </button>

              <button
                onClick={nextCarouselPage}
                disabled={isTransitioning}
                className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-dark-100 hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-full p-2 shadow-lg transition-all duration-200 hover:scale-110"
                aria-label="Próxima página"
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
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </button>
            </>
          )}

          {/* Grid de cards com animação de transição */}
          <div
            className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 px-10 transition-all duration-300 ${
              isTransitioning ? "transform scale-95" : "transform scale-100"
            }`}
          >
            {visibleCards.map((card, index) => (
              <div
                key={card.id || `todos-${index}`}
                className={`transition-all duration-300 ${isTransitioning ? "opacity-70" : "opacity-100"}`}
                style={{
                  transitionDelay: `${index * 50}ms`,
                }}
              >
                {card.render()}
              </div>
            ))}
          </div>

          {/* Indicadores de página do carousel melhorados */}
          {needsCarousel && (
            <div className="flex justify-center mt-6 gap-2">
              {Array.from({ length: totalPages }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToCarouselPage(index)}
                  disabled={isTransitioning}
                  className={`w-3 h-3 rounded-full transition-all duration-300 hover:scale-125 disabled:cursor-not-allowed ${
                    carouselIndex === index ? "shadow-lg" : "hover:opacity-80"
                  }`}
                  style={{
                    backgroundColor: carouselIndex === index ? mainColor : "#555",
                    boxShadow: carouselIndex === index ? `0 0 8px ${mainColor}60` : "none",
                  }}
                  aria-label={`Página ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    )
  }

  // Função para renderizar a tabela de ativos (terceiro nível)
  const renderizarTabelaAtivos = () => {
    // NOVA VERIFICAÇÃO: Não mostrar tabela se as categorias ainda estão carregando
    if (isLoadingCategories) {
      return null
    }

    if (isLoadingTable) {
      return <TableSkeleton />
    }

    console.log("=== renderizarTabelaAtivos ===")
    console.log("contextSelectedCategory:", contextSelectedCategory)
    console.log("patrimonioNivel2 keys:", Object.keys(patrimonioNivel2))

    if (!contextSelectedCategory) {
      console.log("Nenhuma categoria selecionada")
      return null
    }

    // Verificar se temos dados para esta categoria
    const categoryData = patrimonioNivel2[contextSelectedCategory]
    if (!categoryData) {
      console.log("Dados não encontrados para categoria:", contextSelectedCategory)
      return null
    }

    console.log("Dados da categoria encontrados:", categoryData)

    // Usar o componente MeusAtivosGrid para renderizar a tabela de ativos
    return (
      <MeusAtivosGrid
        categoryData={categoryData}
        contextSelectedCategory={contextSelectedCategory}
        contextSelectedSubcategory={contextSelectedSubcategory}
        hideValues={hideValues}
        isLoadingAssetsHeader={isLoadingAssetsHeader}
        isLoadingAssetsTable={isLoadingAssetsTable}
        isLoadingNoAssetsMessage={isLoadingNoAssetsMessage}
        selectedAtivo={selectedAtivo}
        handleAtivoClick={handleAtivoClick}
      />
    )
  }

  return (
    <div className="bg-dark-200 text-neutral-200 h-full flex flex-col">
      {/* Cabeçalho com acordeão */}
      <div className="sticky top-0 z-10 bg-dark-200">
        {isLoadingHeader ? (
          <HeaderSkeleton />
        ) : (
          <div className="bg-dark-100">
            <div className="flex justify-between items-center p-2">
              <div className="flex-1 cursor-pointer" onClick={() => setOpenAccordion(!openAccordion)}>
                <div>Patrimônio Detalhado</div>
                <div className="text-xs text-neutral-400 flex">Últ. Atualização: 17/04/2025 09:26:49</div>
              </div>

              <div
                className={`transform transition-transform duration-200 cursor-pointer ${
                  openAccordion ? "rotate-180" : ""
                }`}
                onClick={() => setOpenAccordion(!openAccordion)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </div>
            </div>

            {/* Conteúdo do acordeão */}
            <div
              className={`overflow-hidden transition-all duration-300 ${
                openAccordion ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              {isLoadingAccordion ? (
                <AccordionSkeleton />
              ) : (
                <div className="p-3 flex flex-col gap-1">
                  {/* Adicionar separador para visão geral */}
                  <div className="text-xs uppercase text-neutral-400 font-bold mb-1">Visão Geral</div>
                  <div className="border-t border-neutral-600 my-1"></div>

                  <div className="flex justify-between">
                    <div className="text-xs uppercase text-neutral-400">Patrimônio Total</div>
                    <div className="text-xs uppercase font-bold">{hideValues ? "••••••" : formattedTotal}</div>
                  </div>
                  <div className="border-t border-neutral-600 my-1"></div>

                  <div className="flex justify-between">
                    <div className="text-xs uppercase text-neutral-400">Saldo em conta</div>
                    <div className="text-xs uppercase font-bold">{hideValues ? "••••••" : "R$ 10.000,00 (10,00%)"}</div>
                  </div>
                  <div className="border-t border-neutral-600 my-1"></div>
                  <div className="flex justify-between">
                    <div className="text-xs uppercase text-neutral-400">Carteira total</div>
                    <div className="text-xs uppercase font-bold">{hideValues ? "••••••" : "R$ 90.000,00 (90,00%)"}</div>
                  </div>
                  <div className="border-t border-neutral-600 my-1"></div>

                  {/* Itens da visão geral - Usando cores do Tailwind */}
                  {patrimonioNivel1.map((item) => {
                    const tailwindColor = getCategoryTailwindColor(item.id)
                    
                    return (
                      <div key={item.id}>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: tailwindColor }}></div>
                            <div className="text-xs uppercase text-neutral-400">{item.label}</div>
                          </div>
                          <div className="text-xs uppercase font-bold">
                            {hideValues ? "••••••" : `${item.value} (${item.percent})`}
                          </div>
                        </div>
                        <div className="border-t border-neutral-600 my-1"></div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Conteúdo principal */}
      <div className="flex-1 overflow-auto">
        <div className="p-2">
          <div className="p-4 m-1 text-white">
            {/* Cards de categorias */}
            {renderCategoryCards()}

            {/* Seletor de subcategorias - mostrar apenas se uma categoria estiver selecionada */}
            {contextSelectedCategory && renderSubcategoryButtons(contextSelectedCategory)}

            {/* Tabela de detalhes */}
            {contextSelectedCategory && !isLoadingCategories ? (
              <div>
                {/* Tabela de ativos (terceiro nível) - esta é a mais detalhada */}
                {renderizarTabelaAtivos()}
              </div>
            ) : isLoadingEmptyState ? (
              <EmptyStateSkeleton />
            ) : (
              <div className="text-center p-8 text-neutral-400">
                <p>Selecione uma categoria acima para ver os detalhes</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* COMPONENTE MODIFICADO PARA BREADCRUMB */}
      <DetalhesDashboard
        data={selectedAtivo}
        activeTab={contextSelectedCategory}
        isVisible={showSidebar}
        onClose={handleCloseDetalhes}
        categoriaTitle={getCategoryTitle(categoriaAtual)}
        subcategoriaLabel={subcategoriaAtual}
      />
    </div>
  )
}