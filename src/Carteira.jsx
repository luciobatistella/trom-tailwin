"use client"

export default function Carteira() {
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
}
