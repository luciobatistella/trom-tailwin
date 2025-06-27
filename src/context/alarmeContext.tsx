"use client"

import { createContext, useContext, useState } from "react"

// Criando o contexto
const AlarmeContext = createContext(undefined)

// Hook personalizado para usar o contexto
export function useAlarme() {
  const context = useContext(AlarmeContext)
  if (context === undefined) {
    throw new Error("useAlarme deve ser usado dentro de um AlarmeProvider")
  }
  return context
}

// Provider component
export function AlarmeProvider({ children }) {
  // Estado para gerenciar alarmes
  const [alarms, setAlarms] = useState([
    {
      id: 1,
      codigo: "PETR4",
      mercado: "BVMF",
      condicao: "Até (superior) 32.50",
      valor: 32.5,
      operador: "maior",
      validoAte: "30/11/2024 19:15:08",
      status: "Ativo",
      statusColor: "#2196F3",
      criadoEm: "25/11/2024 10:30:00",
      frequencia: "uma_vez",
      horaAlerta: "fechamento",
      somAlerta: true,
      observacao: "",
    },
    {
      id: 2,
      codigo: "PETR3",
      mercado: "BVMF",
      condicao: "Até (superior) 28.75",
      valor: 28.75,
      operador: "maior",
      validoAte: "15/02/2025 18:00:00",
      status: "Ativo",
      statusColor: "#2196F3",
      criadoEm: "27/01/2025 14:20:00",
      frequencia: "uma_vez",
      horaAlerta: "fechamento",
      somAlerta: true,
      observacao: "",
    },
    {
      id: 3,
      codigo: "MGLU3",
      mercado: "BVMF",
      condicao: "Até (inferior) 15.00",
      valor: 15.0,
      operador: "menor",
      validoAte: "10/03/2025 16:30:00",
      status: "Disparado",
      statusColor: "#4CAF50",
      criadoEm: "26/01/2025 09:15:00",
      frequencia: "uma_vez",
      horaAlerta: "fechamento",
      somAlerta: true,
      observacao: "",
    },
  ])

  // Estado para controlar a abertura do modal de alarmes
  const [openAlarmManager, setOpenAlarmManager] = useState(false)

  return (
    <AlarmeContext.Provider value={{ alarms, setAlarms, openAlarmManager, setOpenAlarmManager }}>
      {children}
    </AlarmeContext.Provider>
  )
}
