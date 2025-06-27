"use client"

import { useState } from "react"
import LastUpdate from "./LastUpdate"

// Mock data com itens não expandidos inicialmente
const mockTimeline = [
  {
    id: 1,
    date: "15/04/2025",
    title: "Dividendos - PETR4",
    value: "R$ 1.200,00",
    ativo: "PETR4",
    dist: "Dividendo",
    descricao: "Pagamento de dividendos",
    quantidade: 50,
    valorBruto: "R$ 1.250,00",
    valorIR: "R$ 50,00",
    valorLiquido: "R$ 1.200,00",
  },
  {
    id: 2,
    date: "20/04/2025",
    title: "JCP - VALE3",
    value: "R$ 300,00",
    ativo: "VALE3",
    dist: "JCP",
    descricao: "Juros sobre capital próprio",
    quantidade: 30,
    valorBruto: "R$ 315,00",
    valorIR: "R$ 15,00",
    valorLiquido: "R$ 300,00",
  },
  {
    id: 3,
    date: "25/04/2025",
    title: "Dividendos - ITUB4",
    value: "R$ 450,00",
    ativo: "ITUB4",
    dist: "Dividendo",
    descricao: "Pagamento trimestral",
    quantidade: 60,
    valorBruto: "R$ 480,00",
    valorIR: "R$ 30,00",
    valorLiquido: "R$ 450,00",
  },
  {
    id: 4,
    date: "30/04/2025",
    title: "JCP - BBAS3",
    value: "R$ 220,00",
    ativo: "BBAS3",
    dist: "JCP",
    descricao: "Distribuição semestral",
    quantidade: 20,
    valorBruto: "R$ 230,00",
    valorIR: "R$ 10,00",
    valorLiquido: "R$ 220,00",
  },
  {
    id: 5,
    date: "05/05/2025",
    title: "Dividendos - BBDC4",
    value: "R$ 350,00",
    ativo: "BBDC4",
    dist: "Dividendo",
    descricao: "Pagamento mensal",
    quantidade: 70,
    valorBruto: "R$ 385,00",
    valorIR: "R$ 35,00",
    valorLiquido: "R$ 350,00",
  },
]

const Proventos = () => {
  const [tab, setTab] = useState(0)
  const [openItems, setOpenItems] = useState({})
  const [showFilters, setShowFilters] = useState(false)

  const toggleItem = (id) => setOpenItems((prev) => ({ ...prev, [id]: !prev[id] }))

  return (
    <div className="bg-[#2a2a2a] text-[#eee] p-0">
      <div className="p-2 pl-2 h-[68px] bg-[#353535]">
        <div>
          Proventos
          <LastUpdate />
        </div>
      </div>
      <div className="border-b border-[#1C1C1C]"></div>

      {/* Tabs - Seguindo o padrão do Statusbar */}
      <div className="bg-[#2a2a2a] sticky top-0 flex justify-between items-center mb-0 z-[1100]">
        <div className="flex border-b border-[#444]">
          <button
            className={`px-4 py-2 text-sm transition-colors ${
              tab === 0 ? "text-[#F7941E] border-b-2 border-[#F7941E] -mb-[1px]" : "text-[#aaa] hover:text-white"
            }`}
            onClick={() => setTab(0)}
          >
            Provisionados
          </button>
          <button
            className={`px-4 py-2 text-sm transition-colors ${
              tab === 1 ? "text-[#F7941E] border-b-2 border-[#F7941E] -mb-[1px]" : "text-[#aaa] hover:text-white"
            }`}
            onClick={() => setTab(1)}
          >
            Pagos
          </button>
          <button
            className={`px-4 py-2 text-sm transition-colors ${
              tab === 2 ? "text-[#F7941E] border-b-2 border-[#F7941E] -mb-[1px]" : "text-[#aaa] hover:text-white"
            }`}
            onClick={() => setTab(2)}
          >
            Notícias
          </button>
        </div>
        <div className="flex gap-1 pr-1">
          <button className="p-1 text-white" onClick={() => setShowFilters((prev) => !prev)}>
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
              className="w-4 h-4"
            >
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
            </svg>
          </button>
          <button className="p-1 text-white">
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
              className="w-4 h-4"
            >
              <path d="M21 12a9 9 0 0 1-9 9c-4.97 0-9-4.03-9-9s4.03-9 9-9h3" />
              <path d="M15 3l3 3-3 3" />
            </svg>
          </button>
        </div>
      </div>

      {/* Filtros: exibido somente ao clicar no filtro */}
      <div
        className={`transition-all duration-300 overflow-hidden ${
          showFilters ? "max-h-[100px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="flex gap-2 bg-[#1e1e1e] p-2 m-0">
          <input
            type="text"
            placeholder="Buscar ativo..."
            className="w-full px-3 py-1 text-sm bg-[#333] text-[#eee] rounded focus:outline-none"
          />
          <input type="date" className="w-full px-3 py-1 text-sm bg-[#333] text-[#eee] rounded focus:outline-none" />
        </div>
      </div>

      {/* Timeline (left-aligned) com detalhes expansíveis */}
      <div className="relative px-4 py-4">
        {mockTimeline.map((item, index) => (
          <div key={item.id} className="flex">
            {/* Linha vertical e ponto */}
            <div className="flex flex-col items-center mr-2 relative">
              {/* Bolinha perfeitamente redonda */}
              <div className="flex items-center justify-center">
                <div className="w-2.5 h-2.5 rounded-full bg-[#F7941E] mt-6 flex-shrink-0"></div>
              </div>
              {/* Linha vertical */}
              {index < mockTimeline.length - 1 && <div className="absolute top-8 bottom-0 w-[1px] bg-[#555]"></div>}
            </div>

            {/* Conteúdo */}
            <div className="flex-1 pl-2 pr-4 pb-4">
              {/* Cabeçalho clicável */}
              <div
                className="flex justify-between bg-[#333] px-2 py-1 rounded cursor-pointer"
                onClick={() => toggleItem(item.id)}
              >
                <div>
                  <div className="text-xs text-[#bbb]">{item.date}</div>
                  <div className="text-sm text-white">{item.title}</div>
                </div>
                <div className="flex items-center gap-1">
                  <div className="text-sm text-[#21dd74] font-bold">{item.value}</div>
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
                    className={`w-5 h-5 text-[#ccc] transition-transform duration-300 ${
                      openItems[item.id] ? "rotate-180" : "rotate-0"
                    }`}
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </div>
              </div>

              {/* Detalhes expansíveis */}
              <div
                className={`transition-all duration-300 overflow-hidden ${
                  openItems[item.id] ? "max-h-[300px] opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <div className="mt-1 bg-[#333] px-2 py-1 rounded text-xs">
                  <div className="flex justify-between">
                    <span>Ativo:</span>
                    <span>{item.ativo}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Dist:</span>
                    <span>{item.dist}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Descrição:</span>
                    <span>{item.descricao}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Quantidade:</span>
                    <span>{item.quantidade}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Valor Bruto:</span>
                    <span>{item.valorBruto}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Valor I.R:</span>
                    <span>{item.valorIR}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Valor Líquido:</span>
                    <span>{item.valorLiquido}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Proventos
