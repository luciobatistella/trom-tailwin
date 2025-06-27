"use client"

import { useState, useEffect } from "react"

export default function AlarmSidebar({ isVisible, onClose, alarms, onAlarmsChange }) {
  const [editingAlarm, setEditingAlarm] = useState(null)
  const [isCreating, setIsCreating] = useState(false)
  const [formData, setFormData] = useState({
    codigo: "",
    mercado: "BVMF",
    valor: "",
    operador: "maior",
    validoAte: "",
  })

  // Resetar form quando sidebar abre/fecha
  useEffect(() => {
    if (!isVisible) {
      setEditingAlarm(null)
      setIsCreating(false)
      resetForm()
    }
  }, [isVisible])

  const resetForm = () => {
    setFormData({
      codigo: "",
      mercado: "BVMF",
      valor: "",
      operador: "maior",
      validoAte: "",
    })
  }

  const getOperadorText = (operador) => {
    switch (operador) {
      case "maior":
        return "≥"
      case "menor":
        return "≤"
      case "igual":
        return "="
      default:
        return operador
    }
  }

  const getOperadorFullText = (operador) => {
    switch (operador) {
      case "maior":
        return "Superior ou igual a"
      case "menor":
        return "Inferior ou igual a"
      case "igual":
        return "Igual a"
      default:
        return operador
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!formData.codigo || !formData.valor || !formData.validoAte) {
      alert("Preencha todos os campos obrigatórios")
      return
    }

    const newAlarm = {
      id: editingAlarm ? editingAlarm.id : Date.now(),
      codigo: formData.codigo.toUpperCase(),
      mercado: formData.mercado,
      condicao: `${getOperadorFullText(formData.operador)} ${Number.parseFloat(formData.valor).toFixed(2)}`,
      valor: Number.parseFloat(formData.valor),
      operador: formData.operador,
      validoAte: new Date(formData.validoAte).toLocaleString("pt-BR"),
      status: "Aguardando Disparo",
      statusColor: "#2196F3",
      criadoEm: editingAlarm ? editingAlarm.criadoEm : new Date().toLocaleString("pt-BR"),
    }

    let updatedAlarms
    if (editingAlarm) {
      updatedAlarms = alarms.map((alarm) => (alarm.id === editingAlarm.id ? newAlarm : alarm))
    } else {
      updatedAlarms = [...alarms, newAlarm]
    }

    onAlarmsChange(updatedAlarms)
    resetForm()
    setEditingAlarm(null)
    setIsCreating(false)
  }

  const handleEdit = (alarm) => {
    setEditingAlarm(alarm)
    setFormData({
      codigo: alarm.codigo,
      mercado: alarm.mercado,
      valor: alarm.valor.toString(),
      operador: alarm.operador,
      validoAte: "", // Você pode converter a data de volta se necessário
    })
    setIsCreating(true)
  }

  const handleDelete = (id) => {
    if (confirm("Tem certeza que deseja excluir este alarme?")) {
      const updatedAlarms = alarms.filter((alarm) => alarm.id !== id)
      onAlarmsChange(updatedAlarms)
    }
  }

  const toggleStatus = (id) => {
    const updatedAlarms = alarms.map((alarm) => {
      if (alarm.id === id) {
        let newStatus = alarm.status
        let newColor = alarm.statusColor

        if (alarm.status === "Aguardando Disparo") {
          newStatus = "Disparado"
          newColor = "#4CAF50"
        } else if (alarm.status === "Disparado") {
          newStatus = "VENCIDO"
          newColor = "#d32f2f"
        } else {
          newStatus = "Aguardando Disparo"
          newColor = "#2196F3"
        }

        return { ...alarm, status: newStatus, statusColor: newColor }
      }
      return alarm
    })
    onAlarmsChange(updatedAlarms)
  }

  // Agrupar alarmes por status
  const alarmesPorStatus = {
    aguardando: alarms.filter((a) => a.status === "Aguardando Disparo"),
    disparados: alarms.filter((a) => a.status === "Disparado"),
    vencidos: alarms.filter((a) => a.status === "VENCIDO"),
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "Aguardando Disparo":
        return (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#2196F3" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12,6 12,12 16,14" />
          </svg>
        )
      case "Disparado":
        return (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#4CAF50" strokeWidth="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22,4 12,14.01 9,11.01" />
          </svg>
        )
      case "VENCIDO":
        return (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#d32f2f" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
          </svg>
        )
      default:
        return null
    }
  }

  return (
    <>
      {/* Overlay */}
      {isVisible && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-[1000] transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-[420px] bg-[#2a2a2a] shadow-2xl z-[1001] transform transition-transform duration-300 ease-in-out border-l border-[#404040] ${
          isVisible ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header compacto */}
        <div className="bg-[#333] px-4 py-3 border-b border-[#404040] flex justify-between items-center">
          <div className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#F7941E"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
              <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
            </svg>
            <h2 className="text-sm font-semibold text-white">Alarmes</h2>
            <span className="text-xs text-[#888] bg-[#404040] px-2 py-0.5 rounded-full">{alarms.length}</span>
          </div>
          <div className="flex gap-1">
            <button
              onClick={() => setIsCreating(true)}
              className="bg-[#F7941E] hover:bg-[#e8850e] text-white px-3 py-1.5 rounded text-xs font-medium transition-colors flex items-center gap-1"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Novo
            </button>
            <button onClick={onClose} className="bg-[#555] hover:bg-[#666] text-white p-1.5 rounded transition-colors">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex h-[calc(100%-60px)]">
          {/* Lista de Alarmes */}
          <div className={`${isCreating ? "w-[60%]" : "w-full"} transition-all duration-300 overflow-y-auto`}>
            {/* Resumo compacto */}
            <div className="p-3 bg-[#2e2e2e] border-b border-[#404040]">
              <div className="grid grid-cols-3 gap-2">
                <div className="text-center">
                  <div className="text-xs text-[#888]">Aguardando</div>
                  <div className="text-lg font-bold text-[#2196F3]">{alarmesPorStatus.aguardando.length}</div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-[#888]">Disparados</div>
                  <div className="text-lg font-bold text-[#4CAF50]">{alarmesPorStatus.disparados.length}</div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-[#888]">Vencidos</div>
                  <div className="text-lg font-bold text-[#d32f2f]">{alarmesPorStatus.vencidos.length}</div>
                </div>
              </div>
            </div>

            {/* Lista de Alarmes compacta */}
            <div className="p-3">
              {alarms.length === 0 ? (
                <div className="text-center py-8 text-[#888]">
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
                    className="mx-auto mb-3 opacity-50"
                  >
                    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                    <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
                  </svg>
                  <p className="text-sm">Nenhum alarme</p>
                  <p className="text-xs text-[#666] mt-1">Clique em "Novo" para criar</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {alarms.map((alarm) => (
                    <div
                      key={alarm.id}
                      className="bg-[#333] rounded-lg p-3 border-l-3 hover:bg-[#383838] transition-colors"
                      style={{ borderLeftColor: alarm.statusColor }}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-white text-sm">{alarm.codigo}</span>
                            <span className="text-[#888] text-xs">{alarm.mercado}</span>
                            <div className="flex items-center gap-1">
                              {getStatusIcon(alarm.status)}
                              <span
                                className="text-xs px-1.5 py-0.5 rounded"
                                style={{
                                  color: alarm.statusColor,
                                  backgroundColor: `${alarm.statusColor}15`,
                                  border: `1px solid ${alarm.statusColor}30`,
                                }}
                              >
                                {alarm.status === "Aguardando Disparo" ? "Aguardando" : alarm.status}
                              </span>
                            </div>
                          </div>
                          <div className="text-xs text-[#ccc] mb-1 flex items-center gap-1">
                            <span className="font-mono text-[#F7941E]">{getOperadorText(alarm.operador)}</span>
                            <span>R$ {alarm.valor.toFixed(2)}</span>
                          </div>
                          <div className="text-xs text-[#888]">Válido até: {alarm.validoAte.split(" ")[0]}</div>
                        </div>
                        <div className="flex gap-1 ml-2">
                          <button
                            onClick={() => handleEdit(alarm)}
                            className="bg-[#2196F3] hover:bg-[#1976D2] text-white p-1 rounded text-xs transition-colors"
                            title="Editar"
                          >
                            <svg
                              width="10"
                              height="10"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDelete(alarm.id)}
                            className="bg-[#d32f2f] hover:bg-[#b71c1c] text-white p-1 rounded text-xs transition-colors"
                            title="Excluir"
                          >
                            <svg
                              width="10"
                              height="10"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <polyline points="3,6 5,6 21,6" />
                              <path d="M19,6v14a2,2,0,0,1-2,2H7a2,2,0,0,1-2-2V6m3,0V4a2,2,0,0,1,2-2h4a2,2,0,0,1,2,2V6" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Formulário compacto */}
          {isCreating && (
            <div className="w-[40%] bg-[#2e2e2e] border-l border-[#404040] overflow-y-auto">
              <div className="p-3">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-sm font-semibold text-white">{editingAlarm ? "Editar" : "Novo Alarme"}</h3>
                  <button
                    onClick={() => {
                      setIsCreating(false)
                      setEditingAlarm(null)
                      resetForm()
                    }}
                    className="text-[#888] hover:text-white p-1"
                  >
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-[#ccc] mb-1">Código *</label>
                    <input
                      type="text"
                      value={formData.codigo}
                      onChange={(e) => setFormData({ ...formData, codigo: e.target.value.toUpperCase() })}
                      className="w-full bg-[#333] border border-[#555] rounded px-2 py-1.5 text-white text-sm focus:border-[#F7941E] focus:outline-none"
                      placeholder="PETR4"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#ccc] mb-1">Mercado</label>
                    <select
                      value={formData.mercado}
                      onChange={(e) => setFormData({ ...formData, mercado: e.target.value })}
                      className="w-full bg-[#333] border border-[#555] rounded px-2 py-1.5 text-white text-sm focus:border-[#F7941E] focus:outline-none"
                    >
                      <option value="BVMF">BVMF</option>
                      <option value="NYSE">NYSE</option>
                      <option value="NASDAQ">NASDAQ</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#ccc] mb-1">Condição</label>
                    <select
                      value={formData.operador}
                      onChange={(e) => setFormData({ ...formData, operador: e.target.value })}
                      className="w-full bg-[#333] border border-[#555] rounded px-2 py-1.5 text-white text-sm focus:border-[#F7941E] focus:outline-none"
                    >
                      <option value="maior">≥ Superior ou igual</option>
                      <option value="menor">≤ Inferior ou igual</option>
                      <option value="igual">= Igual a</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#ccc] mb-1">Valor *</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.valor}
                      onChange={(e) => setFormData({ ...formData, valor: e.target.value })}
                      className="w-full bg-[#333] border border-[#555] rounded px-2 py-1.5 text-white text-sm focus:border-[#F7941E] focus:outline-none"
                      placeholder="0.00"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#ccc] mb-1">Válido até *</label>
                    <input
                      type="datetime-local"
                      value={formData.validoAte}
                      onChange={(e) => setFormData({ ...formData, validoAte: e.target.value })}
                      className="w-full bg-[#333] border border-[#555] rounded px-2 py-1.5 text-white text-sm focus:border-[#F7941E] focus:outline-none"
                      required
                    />
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="submit"
                      className="flex-1 bg-[#F7941E] hover:bg-[#e8850e] text-white py-1.5 rounded text-xs font-medium transition-colors"
                    >
                      {editingAlarm ? "Atualizar" : "Criar"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsCreating(false)
                        setEditingAlarm(null)
                        resetForm()
                      }}
                      className="px-3 bg-[#555] hover:bg-[#666] text-white py-1.5 rounded text-xs transition-colors"
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
