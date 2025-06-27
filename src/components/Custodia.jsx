"use client"

import { useState, useEffect, useContext } from "react"
import FinanceBox from "./FinanceBox"
import { SettingsContext } from "../components/SettingsContext"
import LastUpdate from "./LastUpdate"

const data = {
  "R Variável": [
    {
      ticker: "NTCO3",
      description: "GRUPO NATURA ON (VST)",
      price: "9,45",
      percent: "+2,16%",
      date: "15/04/25 - 16:00:21",
      qtdTotal: "1.200",
      qtdBloq: "200",
      qtdVenda: "1.000",
      valorAtual: "11.340,00",
    },
    {
      ticker: "PETR4",
      description: "PETROBRAS PN",
      price: "31,02",
      percent: "+2,47%",
      date: "15/04/25 - 16:01:15",
      qtdTotal: "1.100",
      qtdBloq: "100",
      qtdVenda: "1.000",
      valorAtual: "34.122,00",
    },
  ],
  "RF Privada": [],
  "RF Pública": [],
  Fundos: [],
}

export default function Custodia() {
  const { tabStyle } = useContext(SettingsContext)
  const [tab, setTab] = useState(0)
  const [loading, setLoading] = useState(true)
  const tabKeys = Object.keys(data)

  useEffect(() => {
    setLoading(true)
    const timer = setTimeout(() => setLoading(false), 1500)
    return () => clearTimeout(timer)
  }, [tab])

  return (
    <div className="bg-[#2a2a2a] text-white p-0 h-full overflow-auto">
      <div className="p-2 bg-[#353535]">
        <div>Custódia</div>
        
          <LastUpdate className="text-xs text-[#bbb] flex" />
        
      </div>
    
      <div className="border-t border-[#1C1C1C]"></div>

      {/* Tabs Header */}
      <div
        className={`sticky top-0 flex justify-between items-center z-[1100] ${
          tabStyle === "style2" ? "bg-[#1e1e1e]" : "bg-[#2a2a2a]"
        }`}
      >
        <div className="flex flex-1">
          {tabKeys.map((label, index) => (
            <button
              key={index}
              onClick={() => setTab(index)}
              className={`py-2 px-4 text-sm ${
                tabStyle === "style2"
                  ? "border border-[#ccc] rounded m-0.5"
                  : tab === index
                    ? "border-b-2 border-[#F7941E]"
                    : ""
              } ${tabStyle === "style2" ? "" : "flex-1"}`}
            >
              {label}
            </button>
          ))}
        </div>
        <button className="text-white p-1 mx-2 rounded-full hover:bg-[#444] transition-colors">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 2v6h-6" />
            <path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
            <path d="M3 22v-6h6" />
            <path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
          </svg>
        </button>
      </div>

      <FinanceBox total="115.255,00" />

      {loading
        ? [...Array(2)].map((_, i) => (
            <div key={i} className="bg-[#2e2e2e] p-1.5 m-1">
              <div className="h-5 w-1/2 bg-[#3e3e3e]  animate-pulse"></div>
              <div className="h-7 w-1/3 bg-[#3e3e3e]  mt-2 animate-pulse"></div>
              <div className="h-[60px] w-full bg-[#3e3e3e]  mt-1 animate-pulse"></div>
            </div>
          ))
        : data[tabKeys[tab]].map((item, i) => (
            <div key={i} className="bg-[#2e2e2e] p-1.5 m-1 leading-[17px] shadow-md">
              <div className="flex justify-between mb-0">
                <div className="text-xs text-[#ccc]">{item.description}</div>
                <div className="text-xs text-[#aaa]">{item.date}</div>
              </div>
              <div className="flex justify-between items-center mb-0">
                <div className="text-2xl font-bold text-white">{item.ticker}</div>
                <div className="flex items-center gap-1">
                  <span className="bg-[#21dd74] text-[#111] font-bold text-[0.7rem] px-2 py-0.5 rounded-full">
                    {item.percent}
                  </span>
                  <div className="text-[1.4rem] font-bold text-white">{item.price}</div>
                </div>
              </div>

              <div className="border-t border-[#444] my-0.5"></div>
              <div className="flex justify-between text-center">
                <div>
                  <div className="text-xs text-[#bbb]">Qtd Total</div>
                  <div className="text-sm font-bold text-white">{item.qtdTotal}</div>
                </div>
                <div>
                  <div className="text-xs text-[#bbb]">Qtd Bloq</div>
                  <div className="text-sm font-bold text-white">{item.qtdBloq}</div>
                </div>
                <div>
                  <div className="text-xs text-[#bbb]">Disp. P/ Venda</div>
                  <div className="text-sm font-bold text-white">{item.qtdVenda}</div>
                </div>
                <div>
                  <div className="text-xs text-[#bbb]">Valor Atual</div>
                  <div className="text-sm font-bold text-white">{item.valorAtual}</div>
                </div>
              </div>
            </div>
          ))}
    </div>
  )
}
