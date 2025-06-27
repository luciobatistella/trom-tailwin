"use client"

import { useState } from "react"

export default function AlarmIcon({ alarms, onOpenAlarmManager }) {
  const [openDropdown, setOpenDropdown] = useState(false)

  const activeAlarmsCount = alarms.filter((alarm) => alarm.status === "Ativo").length

  return (
    <div className="relative">
      <button
        className="bg-[#444] hover:bg-[#555] text-white p-2 rounded transition-colors relative"
        onClick={() => setOpenDropdown(!openDropdown)}
        title="Alarmes"
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
          <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
          <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
        </svg>
        {/* Badge de notificação */}
        {activeAlarmsCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-[#F7941E] text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
            {activeAlarmsCount}
          </span>
        )}
      </button>

      {/* Dropdown de Alarmes */}
      {openDropdown && (
        <>
          <div className="absolute top-full right-0 mt-2 w-72 bg-[#252525] rounded-lg shadow-lg z-[1200] border border-[#333]">
            <div className="p-3">
              <div className="flex flex-col gap-2">
                {/* Título da seção com botão para gerenciar */}
                <div className="flex justify-between items-center mb-2 border-b border-[#333] pb-2">
                  <div className="text-xs uppercase text-[#aaa] font-medium">Alarmes Ativos</div>
                  <button
                    onClick={() => {
                      setOpenDropdown(false)
                      onOpenAlarmManager()
                    }}
                    className="text-xs bg-[#1E1E1E] hover:bg-[#2C2C2C] text-white px-2 py-1 rounded transition-colors"
                  >
                    Gerenciar
                  </button>
                </div>

                {alarms.length > 0 ? (
                  alarms
                    .filter((alarm) => alarm.status === "Ativo")
                    .slice(0, 3)
                    .map((alarme) => (
                      <div
                        key={alarme.id}
                        className="bg-[#1a1a1a] rounded p-2 border-l-2"
                        style={{ borderLeftColor: alarme.statusColor }}
                      >
                        <div className="flex justify-between items-start mb-1">
                          <div className="font-medium text-white">{alarme.codigo}</div>
                          <div
                            className="text-xs px-1.5 py-0.5 rounded"
                            style={{
                              color: alarme.statusColor,
                              backgroundColor: `${alarme.statusColor}15`,
                              border: `1px solid ${alarme.statusColor}30`,
                            }}
                          >
                            {alarme.status}
                          </div>
                        </div>
                        <div className="text-xs text-[#ccc] mb-1">{alarme.condicao}</div>
                        <div className="text-xs text-[#888]">Válido até: {alarme.validoAte.split(" ")[0]}</div>
                      </div>
                    ))
                ) : (
                  <div className="text-center py-4 text-[#888]">Nenhum alarme ativo</div>
                )}

                {alarms.filter((alarm) => alarm.status === "Ativo").length > 3 && (
                  <div className="text-center pt-2 border-t border-[#333]">
                    <button
                      onClick={() => {
                        setOpenDropdown(false)
                        onOpenAlarmManager()
                      }}
                      className="text-xs text-[#F7941E] hover:text-[#e8850e] transition-colors"
                    >
                      Ver todos os {alarms.filter((alarm) => alarm.status === "Ativo").length} alarmes
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Overlay para fechar dropdown */}
          <div className="fixed inset-0 z-[1150]" onClick={() => setOpenDropdown(false)}></div>
        </>
      )}
    </div>
  )
}
