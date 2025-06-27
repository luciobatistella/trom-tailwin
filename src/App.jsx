"use client"

// src/App.jsx
import { useState } from "react"
import { SettingsContext } from "./components/SettingsContext"
import Sidebar from "./components/Sidebar"
import SettingsModal from "./components/SettingsModal"
import Header from "./components/Header"
import PatrimonioResumido from "./components/PatrimonioResumido"
import Custodia from "./components/Custodia"
import RelatorioFinanceiro from "./components/RelatorioFinanceiro"
import Proventos from "./components/Proventos"
import Grafico from "./components/Grafico"
import Produtos from "./components/Produtos"
import Orders from "./components/Orders"
import Statusbar from "./components/Statusbar"
import { ToastProvider } from "./components/toast"
import PatrimonioResumidoFull from "./components/PatrimonioResumidoFull"
import { PatrimonioProvider } from "./context/patrimonioContext"
import { AlarmeProvider } from "./context/alarmeContext"
import { useAlarme } from "./context/alarmeContext"
import Boleta from "./components/Boleta"

const DRAWER_OPEN = 225
const DRAWER_CLOSED = 65

// Componente para o dashboard de alarmes
function AlarmesDashboard() {
  const { alarms, setOpenAlarmManager } = useAlarme()
  // Adicionar estes estados no seu App.jsx
const [boletaOpen, setBoletaOpen] = useState(false)
const [tipoOperacao, setTipoOperacao] = useState("comprar")

// Adicionar esta função
const abrirBoleta = (tipo) => {
  setTipoOperacao(tipo)
  setBoletaOpen(true)
}

  // Agrupar alarmes por status
  const alarmesPorStatus = {
    aguardando: alarms.filter((a) => a.status === "Ativo"),
    disparados: alarms.filter((a) => a.status === "Disparado"),
    vencidos: alarms.filter((a) => a.status === "VENCIDO"),
  }

  return (
    <div className="h-full">
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

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [tabStyle, setTabStyle] = useState("style1")
  const [activeTab, setActiveTab] = useState("Dashboard")

  // Função para renderizar o conteúdo com base na aba ativa
  const renderContent = () => {
    switch (activeTab) {
      case "Dashboard":
        return (
          <div className="grid grid-cols-12 gap-2 h-full overflow-hidden">
            {/* Primeira linha - 50% da altura */}
            <div className="col-span-6 row-span-1">
              <PatrimonioResumido type="full" />
            </div>
            <div className="col-span-6 row-span-1 overflow-auto">
              <PatrimonioResumidoFull />
            </div>
          </div>
        )

      case "Carteira":
        return (
          <div className="grid grid-cols-12 gap-2 h-full">
            <div className="col-span-8 h-full">
              <div className="bg-[#2a2a2a] p-4 rounded h-full">
                <h3 className="text-lg font-medium mb-2">Carteira de Investimentos</h3>
                <div className="text-[#888]">Detalhes da carteira serão exibidos aqui</div>
              </div>
            </div>
            <div className="col-span-4 h-full">
              <div className="bg-[#2a2a2a] p-4 rounded h-full">
                <h3 className="text-lg font-medium mb-2">Resumo</h3>
                <div className="text-[#888]">Resumo da carteira</div>
              </div>
            </div>
          </div>
        )

      case "Proventos":
        return (
          <div className="h-full">
            <Proventos />
          </div>
        )

      case "Custodia":
        return (
          <div className="h-full">
            <Custodia />
          </div>
        )

      case "Negociação":
        return (
          <div className="grid grid-cols-12 grid-rows-2 gap-2 h-full">
            {/* Primeira linha - 50% da altura */}
            <div className="col-span-2 row-span-2">
            Favoritos
            </div>
            <div className="col-span-7 row-span-2">
              <Grafico />
            </div>
            <div className="col-span-3 row-span-2">
              <Boleta isOpen={true} onClose={() => {}} tipoOperacao="comprar" isWidget={true} />
            </div>
            

            {/* Segunda linha - 50% da altura */}
            <div className="col-span-9 row-span-1">
              <Orders />
            </div>
            <div className="col-span-3 row-span-1">
              {/* <Produtos /> */}
            </div>
          </div>
        )

      case "Alarmes":
        return (
          <div className="h-full bg-[#2a2a2a] p-4 rounded">
            <AlarmesDashboard />
          </div>
        )

      default:
        return (
          <div className="text-center py-8 text-[#888]">
            <p>Selecione uma aba para visualizar o conteúdo</p>
          </div>
        )
    }
  }

  return (
    <ToastProvider>
      <SettingsContext.Provider value={{ tabStyle, onChangeTabStyle: setTabStyle }}>
        <PatrimonioProvider>
          <AlarmeProvider>
            <div
              className={`${tabStyle === "style1" ? "tab-style1" : "tab-style2"} flex h-screen overflow-hidden bg-[#1e1e1e]`}
            >
              {/* Sidebar */}
              <Sidebar
                open={sidebarOpen}
                onToggle={() => setSidebarOpen((o) => !o)}
                onSettingsOpen={() => setSettingsOpen(true)}
              />

              <SettingsModal
                open={settingsOpen}
                onClose={() => setSettingsOpen(false)}
                tabStyle={tabStyle}
                onChangeTabStyle={setTabStyle}
              />

              {/* Conteúdo principal */}
              <div
                className="flex-1 transition-all duration-100 p-2 flex flex-col gap-2 overflow-hidden"
                style={{
                  marginLeft: sidebarOpen ? `${DRAWER_OPEN}px` : `${DRAWER_CLOSED}px`,
                }}
              >
                {/* Header */}
                <div className="w-full bg-[#2a2a2a] rounded">
                  <Header />
                </div>

                {/* Conteúdo das abas - área flexível que pode crescer/encolher */}
                <div className="flex-1 overflow-auto">{renderContent()}</div>

                {/* Statusbar - fixo na parte inferior */}
                <div className="w-full bg-[#2a2a2a] rounded">
                  <Statusbar activeTab={activeTab} onTabChange={setActiveTab} />
                </div>
              </div>
            </div>
          </AlarmeProvider>
        </PatrimonioProvider>
      </SettingsContext.Provider>
    </ToastProvider>
  )
}
