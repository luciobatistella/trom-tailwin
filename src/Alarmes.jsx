"use client"

import { useAlarme } from "./context/alarmeContext"

export default function AlarmesDashboard() {
  const { alarms, setOpenAlarmManager } = useAlarme()

  // Agrupar alarmes por status
  const alarmesPorStatus = {
    aguardando: alarms.filter((a) => a.status === "Ativo"),
    disparados: alarms.filter((a) => a.status === "Disparado"),
    vencidos: alarms.filter((a) => a.status === "VENCIDO"),
  }

  return (
    <div className="h-full bg-[#2a2a2a] p-4 rounded">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-white">Gerenciamento de Alarmes</h2>
        <button
          onClick={() => setOpenAlarmManager(true)}
          className="bg-[#F7941E] hover:bg-[#e8850e] text-white px-4 py-2 rounded text-sm font-bold transition-colors"
        >
          + Novo Alarme
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Alarmes Aguardando */}
        <div className="bg-[#353535] rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3 pb-2 border-b border-[#404040]">
            <div className="w-3 h-3 rounded-full bg-[#2196F3]"></div>
            <h3 className="text-lg font-bold">Aguardando ({alarmesPorStatus.aguardando.length})</h3>
          </div>
          <div className="space-y-3 max-h-[calc(100vh-250px)] overflow-y-auto">
            {alarmesPorStatus.aguardando.length === 0 ? (
              <div className="text-center py-4 text-[#aaa]">Nenhum alarme aguardando</div>
            ) : (
              alarmesPorStatus.aguardando.map((alarme) => (
                <div
                  key={alarme.id}
                  className="bg-[#2e2e2e] rounded p-3 border-l-4"
                  style={{ borderLeftColor: alarme.statusColor }}
                >
                  <div className="font-bold text-white mb-1">
                    {alarme.codigo} {alarme.mercado}
                  </div>
                  <div className="text-sm text-[#ccc] mb-1">{alarme.condicao}</div>
                  <div className="text-xs text-[#aaa]">Válido até: {alarme.validoAte}</div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Alarmes Disparados */}
        <div className="bg-[#353535] rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3 pb-2 border-b border-[#404040]">
            <div className="w-3 h-3 rounded-full bg-[#4CAF50]"></div>
            <h3 className="text-lg font-bold">Disparados ({alarmesPorStatus.disparados.length})</h3>
          </div>
          <div className="space-y-3 max-h-[calc(100vh-250px)] overflow-y-auto">
            {alarmesPorStatus.disparados.length === 0 ? (
              <div className="text-center py-4 text-[#aaa]">Nenhum alarme disparado</div>
            ) : (
              alarmesPorStatus.disparados.map((alarme) => (
                <div
                  key={alarme.id}
                  className="bg-[#2e2e2e] rounded p-3 border-l-4"
                  style={{ borderLeftColor: alarme.statusColor }}
                >
                  <div className="font-bold text-white mb-1">
                    {alarme.codigo} {alarme.mercado}
                  </div>
                  <div className="text-sm text-[#ccc] mb-1">{alarme.condicao}</div>
                  <div className="text-xs text-[#aaa]">Válido até: {alarme.validoAte}</div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Alarmes Vencidos */}
        <div className="bg-[#353535] rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3 pb-2 border-b border-[#404040]">
            <div className="w-3 h-3 rounded-full bg-[#d32f2f]"></div>
            <h3 className="text-lg font-bold">Vencidos ({alarmesPorStatus.vencidos.length})</h3>
          </div>
          <div className="space-y-3 max-h-[calc(100vh-250px)] overflow-y-auto">
            {alarmesPorStatus.vencidos.length === 0 ? (
              <div className="text-center py-4 text-[#aaa]">Nenhum alarme vencido</div>
            ) : (
              alarmesPorStatus.vencidos.map((alarme) => (
                <div
                  key={alarme.id}
                  className="bg-[#2e2e2e] rounded p-3 border-l-4"
                  style={{ borderLeftColor: alarme.statusColor }}
                >
                  <div className="font-bold text-white mb-1">
                    {alarme.codigo} {alarme.mercado}
                  </div>
                  <div className="text-sm text-[#ccc] mb-1">{alarme.condicao}</div>
                  <div className="text-xs text-[#aaa]">Válido até: {alarme.validoAte}</div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
