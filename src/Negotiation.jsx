"use client"
import PatrimonioResumido from "../src/components/PatrimonioResumido"
import Custodia from "./components/Custodia"
import Proventos from "./components/Proventos"
import LastUpdate from "./components/LastUpdate"

// Componentes que precisam ser importados ou criados
const RelatorioFinanceiro = () => (
  <div className="bg-[#2a2a2a] p-4 rounded h-full">
    <div className="flex justify-between items-center mb-2">
      <h3 className="text-lg font-medium">Relatório Financeiro</h3>
      <LastUpdate />
    </div>
    <div className="text-center py-8 text-[#888]">Dados do relatório financeiro</div>
  </div>
)

const Orders = () => (
  <div className="bg-[#2a2a2a] p-4 rounded h-full">
    <div className="flex justify-between items-center mb-2">
      <h3 className="text-lg font-medium">Lista de Ordens</h3>
      <LastUpdate />
    </div>
    <div className="text-center py-8 text-[#888]">Lista de ordens será exibida aqui</div>
  </div>
)

const Produtos = () => (
  <div className="bg-[#2a2a2a] p-4 rounded h-full">
    <div className="flex justify-between items-center mb-2">
      <h3 className="text-lg font-medium">Produtos</h3>
      <LastUpdate />
    </div>
    <div className="text-center py-8 text-[#888]">Lista de produtos será exibida aqui</div>
  </div>
)

export default function Negociacao() {
  return (
    <div className="p-4">
      <div className="grid grid-cols-12 gap-4">
        {/* Primeira linha de widgets */}
        <div className="col-span-3 overflow-hidden h-full">
          <div className="h-full overflow-auto">
            <PatrimonioResumido />
          </div>
        </div>

        <div className="col-span-3 overflow-hidden h-full">
          <div className="h-full overflow-auto">
            <Custodia />
          </div>
        </div>

        <div className="col-span-3 overflow-hidden h-full">
          <div className="h-full overflow-auto">
            <RelatorioFinanceiro />
          </div>
        </div>

        {/* Proventos - ocupa 2 linhas à direita */}
        <div className="col-span-3 h-full overflow-hidden">
          <div className="h-full overflow-auto">
            <Proventos />
          </div>
        </div>

        {/* Segunda linha - Lista de Ordens (9 colunas) */}
        <div className="col-span-9 h-auto overflow-hidden">
          <div className="h-full overflow-auto">
            <Orders />
          </div>
        </div>

        {/* Terceira linha - Produtos (3 colunas) */}
        <div className="col-span-3 h-auto overflow-hidden">
          <div className="h-full overflow-auto">
            <Produtos />
          </div>
        </div>
      </div>
    </div>
  )
}
