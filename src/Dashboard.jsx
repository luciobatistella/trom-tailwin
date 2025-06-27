"use client"

import PatrimonioResumido from "./components/PatrimonioResumido"
import PatrimonioResumidoFull from "./components/PatrimonioResumidoFull"

export default function Dashboard() {
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
}
