"use client"

import { useState, useEffect } from "react"
import StockFinder from "./stock-finder"
import { useToast } from "./toast"

export default function AlarmManager({ isOpen, onClose, alarms, onAlarmsChange }) {
  const [activeTab, setActiveTab] = useState("ativos")
  const [editingAlarm, setEditingAlarm] = useState(null)
  const [isCreating, setIsCreating] = useState(false)
  const [showStockFinder, setShowStockFinder] = useState(false)
  const [formData, setFormData] = useState({
    codigo: "",
    mercado: "BVMF",
    valor: "",
    operador: "maior",
    validoAte: "",
    tipoAviso: "notificacao",
    somAlerta: true,
  })

  const { toast } = useToast()

  // Dados simulados para mais alarmes
  const moreAlarms = [
    {
      id: 4,
      codigo: "ITUB4",
      condicao: "Até (superior) 30.00",
      valor: 30.0,
      operador: "maior",
      validoAte: "15/12/2024 14:30:00",
      status: "Ativo",
      statusColor: "#2196F3",
      criadoEm: "01/12/2024 09:45:00",
    },
    {
      id: 5,
      codigo: "VALE3",
      condicao: "Até (inferior) 65.50",
      valor: 65.5,
      operador: "menor",
      validoAte: "20/12/2024 16:00:00",
      status: "Ativo",
      statusColor: "#2196F3",
      criadoEm: "02/12/2024 11:20:00",
    },
    {
      id: 6,
      codigo: "BBDC4",
      condicao: "Igual a 22.75",
      valor: 22.75,
      operador: "igual",
      validoAte: "25/12/2024 10:00:00",
      status: "Disparado",
      statusColor: "#4CAF50",
      criadoEm: "03/12/2024 14:15:00",
    },
    {
      id: 7,
      codigo: "ABEV3",
      condicao: "Até (superior) 18.30",
      valor: 18.3,
      operador: "maior",
      validoAte: "05/01/2025 09:30:00",
      status: "VENCIDO",
      statusColor: "#d32f2f",
      criadoEm: "04/12/2024 16:40:00",
    },
  ]

  const allAlarms = [...alarms, ...moreAlarms]
  const filteredAlarms = allAlarms.filter((alarm) =>
    activeTab === "ativos" ? alarm.status !== "VENCIDO" : alarm.status === "VENCIDO" || alarm.status === "Disparado",
  )

  // Reset form quando modal abre/fecha
  useEffect(() => {
    if (!isOpen) {
      setEditingAlarm(null)
      setIsCreating(false)
      resetForm()
    }
  }, [isOpen])

  const resetForm = () => {
    setFormData({
      codigo: "",
      mercado: "BVMF",
      valor: "",
      operador: "maior",
      validoAte: "",
      tipoAviso: "notificacao",
      somAlerta: true,
    })
  }

  const getOperadorText = (operador) => {
    const map = { maior: "Até (superior)", menor: "Até (inferior)", igual: "Igual a" }
    return map[operador] || operador
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!formData.codigo || !formData.valor || !formData.validoAte) {
      toast({ title: "Erro", description: "Preencha todos os campos obrigatórios", variant: "destructive" })
      return
    }

    const newAlarm = {
      id: editingAlarm ? editingAlarm.id : Date.now(),
      codigo: formData.codigo.toUpperCase(),
      mercado: formData.mercado,
      condicao: `${getOperadorText(formData.operador)} ${Number.parseFloat(formData.valor).toFixed(2)}`,
      valor: Number.parseFloat(formData.valor),
      operador: formData.operador,
      validoAte: new Date(formData.validoAte).toLocaleString("pt-BR"),
      status: "Ativo",
      statusColor: "#2196F3",
      criadoEm: editingAlarm ? editingAlarm.criadoEm : new Date().toLocaleString("pt-BR"),
      tipoAviso: formData.tipoAviso,
      somAlerta: formData.somAlerta,
    }

    const updatedAlarms = editingAlarm
      ? alarms.map((alarm) => (alarm.id === editingAlarm.id ? newAlarm : alarm))
      : [...alarms, newAlarm]

    onAlarmsChange(updatedAlarms)
    resetForm()
    setEditingAlarm(null)
    setIsCreating(false)

    toast({
      title: "Sucesso",
      description: `Alarme do ativo ${formData.codigo} ${editingAlarm ? "atualizado" : "criado"} com sucesso!`,
    })
  }

  const handleEdit = (alarm) => {
    setEditingAlarm(alarm)
    setFormData({
      codigo: alarm.codigo,
      mercado: alarm.mercado,
      valor: alarm.valor.toString(),
      operador: alarm.operador,
      validoAte: "",
      tipoAviso: alarm.tipoAviso || "notificacao",
      somAlerta: alarm.somAlerta !== undefined ? alarm.somAlerta : true,
    })
    setIsCreating(true)
  }

  const handleDelete = (id) => {
    const alarm = allAlarms.find((a) => a.id === id)
    const updatedAlarms = alarms.filter((alarm) => alarm.id !== id)
    onAlarmsChange(updatedAlarms)
    toast({
      title: "Sucesso",
      description: `Alarme do ativo ${alarm?.codigo} foi excluído com sucesso!`,
    })
  }

  const handleSelectStock = (stock) => {
    setFormData({ ...formData, codigo: stock.codigo })
    setShowStockFinder(false)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[2000]">
      <div className="bg-[#2a2a2a] rounded-lg w-[600px] max-h-[85vh] overflow-hidden shadow-xl border border-[#404040]">
        {/* Header - igual à Boleta */}
        <div className="bg-[#1e1e1e] px-4 py-2 border-b border-[#404040] rounded-t-lg">
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-bold text-white">Alerta de Preço</h2>
            <div className="flex items-center gap-2">
              {!isCreating && (
                <button
                  onClick={() => setIsCreating(true)}
                  className="bg-[#F7941E] hover:bg-[#e8850e] text-[#1e1e1e] px-2 py-1 rounded text-xs font-medium transition-colors"
                >
                  Criar Alerta
                </button>
              )}
              <button onClick={onClose} className="p-1 hover:bg-[#3a3a3a] rounded transition-colors">
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

        {/* Conteúdo */}
        <div className="h-[calc(85vh-50px)]">
          {!isCreating ? (
            <>
              {/* Tabs */}
              <div className="bg-[#2e2e2e] border-b border-[#404040]">
                <div className="flex px-4 pt-3 pb-2">
                  {[
                    { key: "ativos", label: "Alertas ativos" },
                    { key: "historico", label: "Histórico" },
                  ].map((tab) => (
                    <button
                      key={tab.key}
                      className={`mr-4 pb-2 text-sm font-medium relative ${
                        activeTab === tab.key ? "text-[#F7941E]" : "text-[#888] hover:text-[#ccc]"
                      }`}
                      onClick={() => setActiveTab(tab.key)}
                    >
                      {tab.label}
                      {activeTab === tab.key && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#F7941E]" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tabela */}
              <div className="overflow-auto h-[calc(85vh-120px)]">
                {filteredAlarms.length === 0 ? (
                  <div className="text-center py-12 text-[#888]">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="48"
                      height="48"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mx-auto mb-4 opacity-50"
                    >
                      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
                    </svg>
                    <p>Nenhum Alerta Cadastrado</p>
                  </div>
                ) : (
                  <table className="w-full text-left">
                    <thead className="bg-[#1e1e1e] sticky top-0">
                      <tr className="text-[#888] text-sm">
                        <th className="px-4 py-2 font-medium">Ativo</th>
                        <th className="px-4 py-2 font-medium">Condição</th>
                        <th className="px-4 py-2 font-medium">Preço</th>
                        <th className="px-4 py-2 font-medium">Criação/Prazo</th>
                        <th className="px-4 py-2 font-medium">Status</th>
                        <th className="px-4 py-2 font-medium text-center">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredAlarms.map((alarm) => (
                        <tr key={alarm.id} className="border-t border-[#404040] hover:bg-[#353535] transition-colors">
                          <td className="px-4 py-3 font-medium text-white">{alarm.codigo}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center">
                              <span className="text-[#4CAF50] mr-2">
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
                                  <polyline points="18 15 12 9 6 15" />
                                </svg>
                              </span>
                              <div>
                                <div>{getOperadorText(alarm.operador)}</div>
                                <div className="text-[#F7941E] font-mono">{alarm.valor.toFixed(2)}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 font-mono">{(alarm.valor * 0.9).toFixed(2)}</td>
                          <td className="px-4 py-3 text-sm">
                            <div>
                              {alarm.criadoEm.split(" ")[0]} {alarm.criadoEm.split(" ")[1]}
                            </div>
                            <div>
                              {alarm.validoAte.split(" ")[0]} {alarm.validoAte.split(" ")[1]}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className="px-2 py-1 rounded text-sm"
                              style={{
                                color: alarm.statusColor,
                                backgroundColor: `${alarm.statusColor}15`,
                                border: `1px solid ${alarm.statusColor}30`,
                              }}
                            >
                              {alarm.status}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex justify-center gap-2">
                              <button
                                onClick={() => handleDelete(alarm.id)}
                                className="text-[#888] hover:text-[#d32f2f] transition-colors"
                                title="Excluir"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="18"
                                  height="18"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <polyline points="3,6 5,6 21,6" />
                                  <path d="M19,6v14a2,2,0,0,1-2,2H7a2,2,0,0,1-2-2V6m3,0V4a2,2,0,0,1,2-2h4a2,2,0,0,1,2,2V6" />
                                </svg>
                              </button>
                              <button
                                onClick={() => handleEdit(alarm)}
                                className="text-[#888] hover:text-[#2196F3] transition-colors"
                                title="Editar"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="18"
                                  height="18"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                </svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </>
          ) : (
            /* Formulário */
            <div className="p-4 h-full overflow-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-medium text-white">{editingAlarm ? "Editar Alerta" : "Criar Alerta"}</h3>
                <button
                  onClick={() => setIsCreating(false)}
                  className="p-1 hover:bg-[#3a3a3a] rounded transition-colors"
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
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Ativo */}
                <div>
                  <label className="block text-xs font-medium text-[#aaa] mb-2">Ativo</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.codigo}
                      onChange={(e) => setFormData({ ...formData, codigo: e.target.value.toUpperCase() })}
                      onKeyDown={(e) => e.key === " " && (e.preventDefault(), setShowStockFinder(true))}
                      className="w-full bg-[#353535] border border-[#404040] rounded pl-9 pr-3 py-2 text-xs text-white focus:border-[#F7941E] focus:outline-none"
                      placeholder="Ex: PETR4 (espaço para buscar)"
                      required
                    />
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <svg className="w-4 h-4 text-[#888]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Condição e Valor */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[#aaa] mb-2">Condição</label>
                    <select
                      value={formData.operador}
                      onChange={(e) => setFormData({ ...formData, operador: e.target.value })}
                      className="w-full bg-[#353535] border border-[#404040] rounded px-3 py-2 text-xs text-white focus:border-[#F7941E] focus:outline-none"
                    >
                      <option value="maior">Até (superior)</option>
                      <option value="menor">Até (inferior)</option>
                      <option value="igual">Igual a</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#aaa] mb-2">Valor</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.valor}
                      onChange={(e) => setFormData({ ...formData, valor: e.target.value })}
                      className="w-full bg-[#353535] border border-[#404040] rounded px-3 py-2 text-xs text-white focus:border-[#F7941E] focus:outline-none"
                      placeholder="0.00"
                      required
                    />
                  </div>
                </div>

                {/* Válido até */}
                <div>
                  <label className="block text-xs font-medium text-[#aaa] mb-2">Válido até</label>
                  <input
                    type="datetime-local"
                    value={formData.validoAte}
                    onChange={(e) => setFormData({ ...formData, validoAte: e.target.value })}
                    className="w-full bg-[#353535] border border-[#404040] rounded px-3 py-2 text-xs text-white focus:border-[#F7941E] focus:outline-none"
                    required
                  />
                </div>

                {/* Tipo de aviso */}
                <div>
                  <label className="block text-xs font-medium text-[#aaa] mb-2">Tipo de aviso</label>
                  <div className="flex gap-4">
                    {[
                      { value: "notificacao", label: "Notificação" },
                      { value: "push", label: "Push" },
                    ].map((option) => (
                      <label key={option.value} className="flex items-center">
                        <input
                          type="radio"
                          name="tipoAviso"
                          value={option.value}
                          checked={formData.tipoAviso === option.value}
                          onChange={() => setFormData({ ...formData, tipoAviso: option.value })}
                          className="mr-2 text-[#F7941E]"
                        />
                        <span className="text-xs text-white">{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Som de alerta */}
                <div>
                  <label className="block text-xs font-medium text-[#aaa] mb-2">Som de alerta</label>
                  <div className="flex gap-4">
                    {[
                      { value: false, label: "DESLIGADO" },
                      { value: true, label: "LIGADO" },
                    ].map((option) => (
                      <label key={option.value.toString()} className="flex items-center">
                        <input
                          type="radio"
                          name="somAlerta"
                          checked={formData.somAlerta === option.value}
                          onChange={() => setFormData({ ...formData, somAlerta: option.value })}
                          className="mr-2 text-[#F7941E]"
                        />
                        <span className="text-xs text-white">{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Botões */}
                <div className="flex justify-end gap-2 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsCreating(false)}
                    className="px-3 py-1 bg-[#444] hover:bg-[#555] text-white transition-colors text-xs"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1 bg-[#F7941E] hover:bg-[#e8850e] text-[#1e1e1e] rounded font-medium transition-colors text-xs"
                  >
                    Salvar
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* StockFinder Modal */}
        <StockFinder
          isOpen={showStockFinder}
          onClose={() => setShowStockFinder(false)}
          onSelectStock={handleSelectStock}
          initialMercadoFilter="VISTA"
          initialOrigemFilter="BOV"
        />
      </div>
    </div>
  )
}
