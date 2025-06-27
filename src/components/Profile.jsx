"use client"

import { useState, useRef } from "react"
import PatrimonioResumido from "./PatrimonioResumido"

// Dummy data for demonstration
const legendData = [
  { color: "#21dd74", label: "Ativo A", up: true, change: "+5.2%", value: "52.000,00", percent: "10%" },
  { color: "#d32f2f", label: "Ativo B", up: false, change: "-3.8%", value: "38.000,00", percent: "5%" },
]

const drawerWidth = 280

const DashboardLayout = () => {
  const [theme, setTheme] = useState("dark")
  const [language, setLanguage] = useState("pt")
  const [zoom, setZoom] = useState(100)
  const [selectedContent, setSelectedContent] = useState(null)
  const [contentTab, setContentTab] = useState("resumo")
  const chartInstance = useRef() // assume chart ref

  return (
    <div className="flex bg-[#1e1e1e] p-0">
      {/* Sidebar */}
      <div className="bg-[#2e2e2e] w-[280px] box-border shadow-md">
        {/* Conta */}
        <div className="p-2">
          <span className="text-white text-xs pl-1 pb-1 block">Conta</span>
          <ul className="p-0">
            {[
              { key: "meusDados", icon: "user-circle", text: "Meus Dados" },
              { key: "ajuda", icon: "help-circle", text: "Ajuda" },
              { key: "sair", icon: "log-out", text: "Sair" },
            ].map((item) => (
              <li key={item.key}>
                <button className="flex items-center w-full text-white bg-[#1e1e1e] text-sm m-1 p-2 rounded hover:bg-[#3e3e3e] transition-colors">
                  <span className="mr-3 text-white">
                    {item.icon === "user-circle" && (
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
                        className="w-5 h-5"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <circle cx="12" cy="10" r="3" />
                        <path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662" />
                      </svg>
                    )}
                    {item.icon === "help-circle" && (
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
                        className="w-5 h-5"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                        <path d="M12 17h.01" />
                      </svg>
                    )}
                    {item.icon === "log-out" && (
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
                        className="w-5 h-5"
                      >
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                        <polyline points="16 17 21 12 16 7" />
                        <line x1="21" y1="12" x2="9" y2="12" />
                      </svg>
                    )}
                  </span>
                  <span>{item.text}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Tema, Idioma e Zoom */}
        <div className="grid grid-cols-2 gap-2 px-3">
          <div className="flex flex-col">
            <span className="text-white text-xs mb-1">Tema</span>
            <div className="flex border border-gray-600 rounded">
              <button
                className={`p-1 flex items-center justify-center w-10 ${
                  theme === "light" ? "bg-gray-600 text-white" : "text-white"
                }`}
                onClick={() => setTheme("light")}
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
                  className="w-4 h-4"
                >
                  <circle cx="12" cy="12" r="4" />
                  <path d="M12 2v2" />
                  <path d="M12 20v2" />
                  <path d="M4.93 4.93l1.41 1.41" />
                  <path d="M17.66 17.66l1.41 1.41" />
                  <path d="M2 12h2" />
                  <path d="M20 12h2" />
                  <path d="M6.34 17.66l-1.41 1.41" />
                  <path d="M19.07 4.93l-1.41 1.41" />
                </svg>
              </button>
              <button
                className={`p-1 flex items-center justify-center w-10 ${
                  theme === "dark" ? "bg-gray-600 text-white" : "text-white"
                }`}
                onClick={() => setTheme("dark")}
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
                  className="w-4 h-4"
                >
                  <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
                </svg>
              </button>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-white text-xs mb-1">Idioma</span>
            <div className="flex border border-gray-600 rounded">
              <button
                className={`p-1 flex items-center justify-center w-8 ${language === "pt" ? "bg-gray-600" : ""}`}
                onClick={() => setLanguage("pt")}
              >
                🇧🇷
              </button>
              <button
                className={`p-1 flex items-center justify-center w-8 ${language === "es" ? "bg-gray-600" : ""}`}
                onClick={() => setLanguage("es")}
              >
                🇪🇸
              </button>
              <button
                className={`p-1 flex items-center justify-center w-8 ${language === "us" ? "bg-gray-600" : ""}`}
                onClick={() => setLanguage("us")}
              >
                🇺🇸
              </button>
              <button
                className={`p-1 flex items-center justify-center w-8 ${language === "ar" ? "bg-gray-600" : ""}`}
                onClick={() => setLanguage("ar")}
              >
                🇦🇷
              </button>
            </div>
          </div>
        </div>
        <div className="px-3 pt-1 flex flex-col">
          <span className="text-white text-xs mb-1">Zoom</span>
          <input
            type="range"
            min="67"
            max="120"
            value={zoom}
            onChange={(e) => setZoom(Number.parseInt(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[#F7941E]"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>67%</span>
            <span>{zoom}%</span>
            <span>120%</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow p-1 bg-[#1e1e1e] h-[450px] overflow-auto">
        <div className="bg-[#2e2e2e] mb-1 text-white flex items-center shadow">
          <div className="p-2 inline-grid w-full">
            <span className="text-xs uppercase text-[#8f8f8f]">11105</span>
            <span className="text-sm">Equipe de Desenvolvimento</span>
          </div>
          <button className="text-[#F7941E] text-xs h-[25px] px-2 hover:underline">Trocar Conta</button>
        </div>
        <div className="overflow-visible [&_.box-buttons]:hidden [&_.dashboard-chart]:hidden [&_.box-legend]:hidden">
          <PatrimonioResumido legendData={legendData} chartRef={chartInstance} />
        </div>
        <div className="mt-1 p-2 bg-[#2e2e2e] text-white shadow">
          <h3 className="mb-1 text-base font-medium">Log de Segurança</h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <span className="block text-xs uppercase text-[#8f8f8f]">Data Último Acesso</span>
              <span className="text-xs uppercase">2025-04-22 14:29:57</span>
            </div>
            <div>
              <span className="block text-xs uppercase text-[#8f8f8f]">IP</span>
              <span className="text-xs uppercase">10.10.14.201</span>
            </div>
            <div className="col-span-2">
              <span className="block text-xs uppercase text-[#8f8f8f]">Versão</span>
              <span className="text-xs uppercase">5.4.0.0.0</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardLayout
