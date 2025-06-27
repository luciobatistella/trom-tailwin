"use client"

import { createContext, useContext, useState, useEffect } from "react"

// Importando os dados para inicialização
import { patrimonioResumido as patrimonioNivel1 } from "../data/patrimonioResumido"

// Cria o contexto para gerenciar os ativos
export const PatrimonioContext = createContext()

// Hook personalizado para usar o contexto
export function usePatrimonio() {
  const context = useContext(PatrimonioContext)
  if (context === undefined) {
    throw new Error("usePatrimonio deve ser usado dentro de um PatrimonioProvider")
  }
  return context
}

// Componente provedor do contexto de Patrimônio
export const PatrimonioProvider = ({ children }) => {
  const [ativos, setAtivos] = useState([])
  // Inicializa com a primeira categoria selecionada (se existir)
  const [selectedCategory, setSelectedCategory] = useState(() => {
    return patrimonioNivel1 && patrimonioNivel1.length > 0 ? patrimonioNivel1[0].id : null
  })
  // Inicializa com "todos" selecionado para subcategoria
  const [selectedSubcategory, setSelectedSubcategory] = useState(null)
  const [hideValues, setHideValues] = useState(false)
  const [lastUpdated, setLastUpdated] = useState("")

  // Calcula o patrimônio total
  const patrimonioTotal = ativos.reduce((total, ativo) => {
    // Filtra os ativos para excluir "Futuros/termo" e "Aluguel" do cálculo
    if (ativo.tipo !== "Futuros/termo" && ativo.tipo !== "Aluguel") {
      return total + ativo.valor
    }
    return total
  }, 0)

  const patrimonioTotalCompleto = ativos.reduce((total, ativo) => {
    return total + ativo.valor
  }, 0)

  // Função para adicionar um novo ativo
  const adicionarAtivo = (novoAtivo) => {
    setAtivos([...ativos, novoAtivo])
  }

  // Função para editar um ativo existente
  const editarAtivo = (id, ativoAtualizado) => {
    const novosAtivos = ativos.map((ativo) => (ativo.id === id ? ativoAtualizado : ativo))
    setAtivos(novosAtivos)
  }

  // Função para remover um ativo
  const removerAtivo = (id) => {
    const novosAtivos = ativos.filter((ativo) => ativo.id !== id)
    setAtivos(novosAtivos)
  }

  // Função para atualizar o patrimônio
  const updatePatrimonio = (novosAtivos) => {
    if (novosAtivos) {
      setAtivos(novosAtivos)
    }

    // Atualiza a data da última atualização
    const agora = new Date()
    const dataFormatada = agora.toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
    setLastUpdated(dataFormatada)
  }

  useEffect(() => {
    // Carrega os dados do localStorage ao montar o componente
    const storedAtivos = localStorage.getItem("ativos")
    if (storedAtivos) {
      setAtivos(JSON.parse(storedAtivos))
    }

    // Inicializar lastUpdated
    const agora = new Date()
    const dataFormatada = agora.toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
    setLastUpdated(dataFormatada)
  }, [])

  // Salva os ativos no localStorage sempre que a lista de ativos é alterada
  useEffect(() => {
    localStorage.setItem("ativos", JSON.stringify(ativos))
  }, [ativos])

  return (
    <PatrimonioContext.Provider
      value={{
        ativos,
        adicionarAtivo,
        editarAtivo,
        removerAtivo,
        patrimonioTotal,
        patrimonioTotalCompleto,
        updatePatrimonio,
        selectedCategory,
        setSelectedCategory,
        selectedSubcategory,
        setSelectedSubcategory,
        hideValues,
        setHideValues,
        lastUpdated,
      }}
    >
      {children}
    </PatrimonioContext.Provider>
  )
}
