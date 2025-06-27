"use client"

import { useState, useEffect } from "react"

export default function Statusbar({ activeTab = "Dashboard", onTabChange }) {
  const tabs = [
    { label: "Dashboard", url: "#" },
    { label: "Carteira", url: "#" },
    { label: "Proventos", url: "#" },
    { label: "Custodia", url: "#" },
    { label: "Negociação", url: "#" },
  ]

  const buttons = [
    { label: "TICKER ON", icon: "ticker" },
    { label: "ZOOM", icon: "zoom" },
    { label: "LAYOUT", icon: "layout" },
    { label: "Maximizar", icon: "maximize" },
    { label: "Status", icon: "status" },
  ]

  // Encontrar o índice da aba ativa
  const activeIndex = tabs.findIndex((tab) => tab.label === activeTab)
  const [selectedTab, setSelectedTab] = useState(activeIndex >= 0 ? activeIndex : 0)

  // Atualizar o estado local quando a prop activeTab mudar
  useEffect(() => {
    const index = tabs.findIndex((tab) => tab.label === activeTab)
    if (index >= 0) {
      setSelectedTab(index)
    }
  }, [activeTab, tabs])

  // Função para lidar com a mudança de aba
  const handleTabClick = (index) => {
    setSelectedTab(index)
    onTabChange(tabs[index].label)
  }

  return (
    <div className="flex justify-between items-center bg-[#2a2a2a] text-[#eee] px-4 py-2">
      {/* Breadcrumbs à esquerda */}
      <div className="text-sm text-[#aaa]">
        <a href="#" className="text-[#ccc] hover:text-white">
          Dashboard
        </a>
        <span className="mx-1">/</span>
        <span className="text-[#F7941E] font-medium">{activeTab}</span>
      </div>

      {/* Tabs centralizadas */}
      <div className="flex gap-4">
        {tabs.map((tab, index) => (
          <button
            key={index}
            className={`px-3 py-1 text-sm transition-colors ${
              selectedTab === index ? "text-[#F7941E] border-b-2 border-[#F7941E]" : "text-[#aaa] hover:text-white"
            }`}
            onClick={() => handleTabClick(index)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Botões de ação à direita */}
      <div className="flex items-center gap-2">
        {buttons.map((button, index) => (
          <button
            key={index}
            className="flex items-center px-2 py-1 text-[0.65rem] uppercase text-[#eee] border border-[#1e1e1e] bg-[#1e1e1e] hover:bg-[#333] leading-none"
          >
            {button.icon === "ticker" && (
              <span className="mr-1">
                <svg width="12" height="12" viewBox="0 0 20 20" className="fill-current">
                  <path
                    d="M2.4,0a2.4,2.4,0,0,1,2.4,2.4v8.572a2.4,2.4,0,1,1-4.808,0V2.4A2.4,2.4,0,0,1,2.4,0Z"
                    transform="translate(0 6.62)"
                  />
                  <path
                    d="M2.4,0a2.4,2.4,0,0,1,2.4,2.4V17.6A2.4,2.4,0,0,1,0,17.6V2.4A2.4,2.4,0,0,1,2.4,0Z"
                    transform="translate(7.604)"
                  />
                  <path
                    d="M2.4,0a2.4,2.4,0,0,1,2.4,2.4V14.233a2.4,2.4,0,1,1-4.808,0V2.4A2.4,2.4,0,0,1,2.4,0Z"
                    transform="translate(15.192 3.363)"
                  />
                </svg>
              </span>
            )}
            {button.icon === "zoom" && (
              <span className="mr-1">
                <svg width="12" height="12" viewBox="0 0 16 16.572" className="fill-current">
                  <path d="M16.741,15.095l-3.944-4.1a6.688,6.688,0,1,0-5.121,2.39,6.619,6.619,0,0,0,3.833-1.211L15.483,16.3a.873.873,0,1,0,1.258-1.21ZM7.675,1.746A4.946,4.946,0,1,1,2.73,6.691,4.951,4.951,0,0,1,7.675,1.746Z" />
                </svg>
              </span>
            )}
            {button.icon === "layout" && (
              <span className="mr-1">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M4 5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5z" />
                  <path d="M14 5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1V5z" />
                  <path d="M4 15a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-4z" />
                  <path d="M14 15a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1v-4z" />
                </svg>
              </span>
            )}
            {button.icon === "maximize" && (
              <span className="mr-1">
                <svg width="12" height="12" viewBox="0 0 24 24" className="stroke-current" fill="none">
                  <path
                    d="M8,3H5A2,2,0,0,0,3,5V8M21,8V5a2,2,0,0,0-2-2H16m0,18h3a2,2,0,0,0,2-2V16M3,16v3a2,2,0,0,0,2,2H8"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            )}
            {button.icon === "status" && (
              <span className="mr-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 8 10">
                  <g transform="translate(-1828.537 -8994)">
                    <g transform="translate(1834.537 8994)" fill="#fff" stroke="#2ca430" strokeWidth="1">
                      <rect width="2" height="10" rx="1" stroke="none" />
                      <rect x="0.5" y="0.5" width="1" height="9" rx="0.5" fill="none" />
                    </g>
                    <g transform="translate(1831.537 8997)" fill="#fff" stroke="#2ca430" strokeWidth="1">
                      <rect width="2" height="7" rx="1" stroke="none" />
                      <rect x="0.5" y="0.5" width="1" height="6" rx="0.5" fill="none" />
                    </g>
                    <g transform="translate(1828.537 9000)" fill="#fff" stroke="#2ca430" strokeWidth="1">
                      <rect width="2" height="4" rx="1" stroke="none" />
                      <rect x="0.5" y="0.5" width="1" height="3" rx="0.5" fill="none" />
                    </g>
                  </g>
                </svg>
              </span>
            )}
            {button.label}
          </button>
        ))}
      </div>
    </div>
  )
}
