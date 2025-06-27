"use client"

import { useState } from "react"
import { formatCurrency } from "../utils/formatCurrency"

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

const RentabilidadeBadge = ({ valorAtual, valorAplicado, hideValues }) => {
  if (hideValues) return "••••••"
  
  const valorAtu = valorAtual || 0
  const valorApl = valorAplicado || 0
  
  if (valorApl === 0) return "-"
  
  const rentabilidade = ((valorAtu - valorApl) / valorApl) * 100
  const isPositive = rentabilidade >= 0
  
  return (
    <span
      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
        isPositive
          ? "bg-green-100 text-green-800 border border-green-200"
          : "bg-red-100 text-red-800 border border-red-200"
      }`}
    >
      {isPositive ? "+" : ""}
      {rentabilidade.toFixed(2)}%
    </span>
  )
}

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

export default function MeusAtivosGrid({
  categoryData,
  contextSelectedCategory,
  contextSelectedSubcategory,
  hideValues,
  isLoadingAssetsHeader,
  isLoadingAssetsTable,
  isLoadingNoAssetsMessage,
  selectedAtivo,
  handleAtivoClick,
}) {
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  })

  const getFieldValue = (ativo, field) => {
    const fieldMapping = {
      codigo: ativo.cod || ativo.codigo,
      nome: ativo.description || ativo.nome,
      quantidade: ativo.qty || ativo.quantidade,
      valorAtual: ativo.valueUpdated || ativo.valorAtual || ativo.value,
      valorAplicado: ativo.value || ativo.valorInvestido || ativo.valorAplicado,
      dtCollateral: ativo.dtCollateral,
      collateral: ativo.collateral,
      description: ativo.description,
      qty: ativo.qty,
      value: ativo.value,
      currency: ativo.currency,
      dtExpired: ativo.dtExpired,
      origin: ativo.origin,
      cod: ativo.cod,
      typeName: ativo.typeName,
      indexer: ativo.indexer,
      rating: ativo.rating,
      issuer: ativo.issuer,
      expiredDate: ativo.expiredDate,
      earlyRedemption: ativo.earlyRedemption,
      fgc: ativo.fgc,
      precoMedio: ativo.precoMedio,
      cotacaoAtual: ativo.cotacaoAtual,
      posicao: ativo.posicao,
    }
    
    return fieldMapping[field] !== undefined ? fieldMapping[field] : ativo[field]
  }

  const getGarantiasColumns = () => {
    return [
      { id: "codigo", label: "Código", align: "left" },
      { id: "description", label: "Descrição", align: "left" },
      { id: "collateral", label: "Tipo", align: "center" },
      { id: "qty", label: "Qtde", align: "right", format: (value) => value?.toLocaleString("pt-BR") },
      { id: "currency", label: "Moeda", align: "center" },
      { id: "dtExpired", label: "Vencimento", align: "center" },
      { id: "origin", label: "Origem", align: "center" },
      { id: "value", label: "Valor", align: "right", format: (value) => formatCurrency(value) },
    ]
  }

  const getOverviewColumns = (categoryData) => {
    if (categoryData.title === "Garantias") {
      return [
        { id: "codigo", label: "Código", align: "left" },
        { id: "description", label: "Descrição", align: "left" },
        { id: "collateral", label: "Tipo", align: "left" },
        { id: "qty", label: "Qtde", align: "right", format: (value) => value?.toLocaleString("pt-BR") },
        { id: "currency", label: "Moeda", align: "center" },
        { id: "dtExpired", label: "Vencimento", align: "center" },
        { id: "value", label: "Valor", align: "right", format: (value) => formatCurrency(value) },
      ]
    }
    
    return [
      { id: "codigo", label: "Código", align: "left" },
      { id: "nome", label: "Nome", align: "left" },
      { id: "subcategoria", label: "Subcategoria", align: "left" },
      { id: "quantidade", label: "Qtde", align: "right", format: (value) => value?.toLocaleString("pt-BR") },
      { id: "valorAtual", label: "Valor Atual", align: "right", format: (value) => formatCurrency(value) },
    ]
  }

  const getTotalValue = (ativos, categoryTitle) => {
    if (categoryTitle === "Garantias") {
      return ativos.reduce((total, ativo) => total + (getFieldValue(ativo, 'value') || 0), 0)
    }
    return ativos.reduce((total, ativo) => total + (getFieldValue(ativo, 'valorAtual') || 0), 0)
  }

  const getVisibleFields = (categoryTitle) => {
    const baseFields = ["codigo", "nome", "subcategoria"]
    
    if (categoryTitle === "Garantias") {
      return [...baseFields, "description", "collateral", "currency", "dtExpired", "origin"]
    }
    
    return [...baseFields, "typeName", "indexer", "expiredDate"]
  }

  const sortedData = (data) => {
    if (!sortConfig.key) return data

    return [...data].sort((a, b) => {
      const aValue = getFieldValue(a, sortConfig.key)
      const bValue = getFieldValue(b, sortConfig.key)
      
      if (aValue === undefined || bValue === undefined) {
        return 0
      }

      let aVal = aValue
      let bVal = bValue

      if (typeof aVal === "string" && !isNaN(aVal.replace(/[^\d.-]/g, ""))) {
        aVal = Number.parseFloat(aVal.replace(/[^\d.-]/g, "").replace(",", "."))
      }
      if (typeof bVal === "string" && !isNaN(bVal.replace(/[^\d.-]/g, ""))) {
        bVal = Number.parseFloat(bVal.replace(/[^\d.-]/g, "").replace(",", "."))
      }

      if (aVal < bVal) {
        return sortConfig.direction === "ascending" ? -1 : 1
      }
      if (aVal > bVal) {
        return sortConfig.direction === "ascending" ? 1 : -1
      }
      return 0
    })
  }

  const requestSort = (key) => {
    let direction = "ascending"
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending"
    }
    setSortConfig({ key, direction })
  }

  if (!contextSelectedCategory || !categoryData) {
    return null
  }

  if (!contextSelectedSubcategory) {
    const todosAtivos = []
    categoryData.items.forEach((item) => {
      if (item.ativos && item.ativos.length > 0) {
        todosAtivos.push(
          ...item.ativos.map((ativo) => ({
            ...ativo,
            subcategoria: item.label,
          })),
        )
      }
    })

    if (todosAtivos.length === 0) {
      if (isLoadingNoAssetsMessage) {
        return <NoAssetsMessageSkeleton />
      }

      return (
        <div className="mt-6 text-center p-4 text-neutral-400 border border-neutral-600 rounded">
          Não há ativos detalhados disponíveis para {categoryData.title || contextSelectedCategory}.
        </div>
      )
    }

    const colunas = getOverviewColumns(categoryData)
    const visibleFields = getVisibleFields(categoryData.title)

    if (isLoadingAssetsTable) {
      return <AssetsTableSkeleton title="Todos os ativos" columnCount={colunas.length} rowCount={8} />
    }

    return (
      <div className="mt-6 pb-8">
        {isLoadingAssetsHeader ? (
          <MyAssetsHeaderSkeleton />
        ) : (
          <h3 className="text-lg font-bold mb-3 text-white">
            Todos meus ativos de {categoryData.title || contextSelectedCategory}
          </h3>
        )}
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-neutral-600">
                {colunas.map((coluna) => (
                  <th
                    key={coluna.id}
                    className={`py-2 px-3 text-${coluna.align} text-xs font-medium text-neutral-400 uppercase tracking-wider cursor-pointer hover:bg-neutral-700`}
                    onClick={() => requestSort(coluna.id)}
                  >
                    <div className="flex items-center justify-between">
                      <span>{coluna.label}</span>
                      {sortConfig.key === coluna.id && (
                        <span className="ml-1">{sortConfig.direction === "ascending" ? "↑" : "↓"}</span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sortedData(todosAtivos).map((ativo, index) => (
                <tr
                  key={index}
                  className={`border-b border-neutral-600 hover:bg-neutral-700 cursor-pointer ${
                    selectedAtivo === ativo ? "bg-neutral-700" : ""
                  }`}
                  onClick={() => handleAtivoClick(ativo, contextSelectedCategory, ativo.subcategoria)}
                >
                  {colunas.map((coluna) => (
                    <td key={coluna.id} className={`py-2 px-3 text-${coluna.align} whitespace-nowrap text-white`}>
                      {coluna.format && getFieldValue(ativo, coluna.id) !== undefined
                        ? hideValues && !visibleFields.includes(coluna.id)
                          ? "••••••"
                          : coluna.format(getFieldValue(ativo, coluna.id))
                        : hideValues && !visibleFields.includes(coluna.id)
                          ? "••••••"
                          : getFieldValue(ativo, coluna.id) || "-"}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-neutral-800 border-t-2 border-neutral-500">
                <td colSpan={colunas.length - 1} className="py-3 px-3 font-bold text-white">
                  Total Geral
                </td>
                <td className="py-3 px-3 text-right font-bold text-white">
                  {hideValues
                    ? "••••••"
                    : formatCurrency(getTotalValue(todosAtivos, categoryData.title))}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    )
  }

  const subcategoryData = categoryData.items.find((item) => item.id === contextSelectedSubcategory)
  if (!subcategoryData) {
    return null
  }

  const ativosData = subcategoryData.ativos
  if (!ativosData || ativosData.length === 0) {
    if (isLoadingNoAssetsMessage) {
      return <NoAssetsMessageSkeleton />
    }

    return (
      <div className="mt-6 text-center p-4 text-neutral-400 border border-neutral-600 rounded">
        Não há ativos detalhados disponíveis para {subcategoryData.label}.
      </div>
    )
  }

  let colunas = []
  let columnCount = 4

  if (contextSelectedCategory === "garantias") {
    columnCount = 8
    colunas = getGarantiasColumns()
  } else if (contextSelectedCategory === "rfPublica" || contextSelectedSubcategory.includes("tesouro")) {
    columnCount = 8
    colunas = [
      { id: "codigo", label: "Código", align: "left" },
      { id: "nome", label: "Descrição", align: "left" },
      { id: "typeName", label: "Tipo", align: "center" },
      { id: "indexer", label: "Indexador", align: "center" },
      { id: "expiredDate", label: "Vencimento", align: "center", format: (value) => value ? new Date(value).toLocaleDateString("pt-BR") : "-" },
      { id: "quantidade", label: "Qtde", align: "right", format: (value) => value?.toLocaleString("pt-BR") },
      { 
        id: "rentabilidade", 
        label: "Rentabilidade", 
        align: "center", 
        format: (value, ativo) => <RentabilidadeBadge valorAtual={getFieldValue(ativo, 'valorAtual')} valorAplicado={getFieldValue(ativo, 'valorAplicado')} hideValues={hideValues} />
      },
      { id: "valorAtual", label: "Valor Atual", align: "right", format: (value) => formatCurrency(value) },
    ]
  } else if (contextSelectedSubcategory === "aVistaFracionario") {
    columnCount = 7
    colunas = [
      { id: "codigo", label: "Código", align: "left" },
      { id: "nome", label: "Nome", align: "left" },
      { id: "quantidade", label: "Qtde", align: "right", format: (value) => value?.toLocaleString("pt-BR") },
      {
        id: "precoMedio",
        label: "Preço Médio",
        align: "right",
        format: (value) => value?.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }),
      },
      {
        id: "cotacaoAtual",
        label: "Cotação Atual",
        align: "right",
        format: (value) => value?.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }),
      },
      {
        id: "posicao",
        label: "Posição %",
        align: "right",
        format: (value) => <PosicaoBadge value={value} hideValues={hideValues} />,
      },
      { id: "valorAtual", label: "Valor Atual", align: "right", format: (value) => formatCurrency(value) },
    ]
  } else {
    columnCount = 4
    colunas = [
      { id: "codigo", label: "Código", align: "left" },
      { id: "nome", label: "Nome", align: "left" },
      { id: "quantidade", label: "Qtde", align: "right", format: (value) => value?.toLocaleString("pt-BR") },
      { id: "valorAtual", label: "Valor Atual", align: "right", format: (value) => formatCurrency(value) },
    ]
  }

  const visibleFields = getVisibleFields(categoryData.title)

  if (isLoadingAssetsTable) {
    return (
      <AssetsTableSkeleton title={`Meus Ativos de ${subcategoryData.label}`} columnCount={columnCount} rowCount={6} />
    )
  }

  return (
    <div className="mt-6 pb-8">
      {isLoadingAssetsHeader ? (
        <MyAssetsHeaderSkeleton />
      ) : (
        <h3 className="text-lg font-bold mb-3 text-white">Meus Ativos de {subcategoryData.label}</h3>
      )}
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-neutral-600">
              {colunas.map((coluna) => (
                <th
                  key={coluna.id}
                  className={`py-2 px-3 text-${coluna.align} text-xs font-medium text-neutral-400 uppercase tracking-wider cursor-pointer hover:bg-neutral-700`}
                  onClick={() => requestSort(coluna.id)}
                >
                  <div className="flex items-center justify-between">
                    <span>{coluna.label}</span>
                    {sortConfig.key === coluna.id && (
                      <span className="ml-1">{sortConfig.direction === "ascending" ? "↑" : "↓"}</span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedData(ativosData).map((ativo, index) => (
              <tr
                key={index}
                className={`border-b border-neutral-600 hover:bg-neutral-700 cursor-pointer ${
                  selectedAtivo === ativo ? "bg-neutral-700" : ""
                }`}
                onClick={() => handleAtivoClick(ativo, contextSelectedCategory, subcategoryData.label)}
              >
                {colunas.map((coluna) => (
                  <td key={coluna.id} className={`py-2 px-3 text-${coluna.align} whitespace-nowrap text-white`}>
                    {coluna.format && getFieldValue(ativo, coluna.id) !== undefined
                      ? typeof coluna.format === "function"
                        ? coluna.id === "rentabilidade"
                          ? coluna.format(null, ativo)
                          : typeof coluna.format(getFieldValue(ativo, coluna.id)) === "object"
                            ? coluna.format(getFieldValue(ativo, coluna.id))
                            : hideValues && !visibleFields.includes(coluna.id)
                              ? "••••••"
                              : coluna.format(getFieldValue(ativo, coluna.id))
                        : hideValues && !visibleFields.includes(coluna.id)
                          ? "••••••"
                          : coluna.format(getFieldValue(ativo, coluna.id))
                      : hideValues && !visibleFields.includes(coluna.id)
                        ? "••••••"
                        : getFieldValue(ativo, coluna.id) || "-"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-neutral-800 border-t-2 border-neutral-500">
              <td colSpan={colunas.length - 1} className="py-3 px-3 font-bold text-white">
                Total da Subcategoria
              </td>
              <td className="py-3 px-3 text-right font-bold text-white">
                {hideValues
                  ? "••••••"
                  : formatCurrency(getTotalValue(ativosData, categoryData.title))}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  )
}