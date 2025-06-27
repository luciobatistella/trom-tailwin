"use client"

import { useEffect, useRef, useState } from "react"

export default function Grafico() {
  const canvasRef = useRef(null)
  const [selectedTimeframe, setSelectedTimeframe] = useState("1D")
  const [currentPrice, setCurrentPrice] = useState(31.5)
  const [priceChange, setPriceChange] = useState(2.35)

  // Gerar dados de candlestick
  const generateCandleData = (candles = 15) => {
    const data = []
    let basePrice = 29

    for (let i = 0; i < candles; i++) {
      const open = basePrice + (Math.random() - 0.5) * 0.5
      const close = open + (Math.random() - 0.5) * 1.2
      const high = Math.max(open, close) + Math.random() * 0.8
      const low = Math.min(open, close) - Math.random() * 0.8

      data.push({
        open: Number(open.toFixed(2)),
        high: Number(high.toFixed(2)),
        low: Number(low.toFixed(2)),
        close: Number(close.toFixed(2)),
      })

      basePrice = close
    }

    return data
  }

  const [candleData] = useState(() => generateCandleData())

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    const rect = canvas.getBoundingClientRect()

    canvas.width = rect.width
    canvas.height = rect.height

    // Limpar
    ctx.fillStyle = "#1e1e1e"
    ctx.fillRect(0, 0, rect.width, rect.height)

    // Configurações
    const padding = 15
    const chartWidth = rect.width - padding * 2
    const chartHeight = rect.height - padding * 2

    // Encontrar min/max
    const allPrices = candleData.flatMap((c) => [c.high, c.low])
    const minPrice = Math.min(...allPrices)
    const maxPrice = Math.max(...allPrices)
    const priceRange = maxPrice - minPrice || 1

    // Grid horizontal simples
    ctx.strokeStyle = "#333"
    ctx.lineWidth = 0.5
    for (let i = 0; i <= 3; i++) {
      const y = padding + (i / 3) * chartHeight
      ctx.beginPath()
      ctx.moveTo(padding, y)
      ctx.lineTo(padding + chartWidth, y)
      ctx.stroke()
    }

    // Função para converter preço para Y
    const priceToY = (price) => {
      return padding + ((maxPrice - price) / priceRange) * chartHeight
    }

    // Desenhar candlesticks
    const candleWidth = Math.max(3, (chartWidth / candleData.length) * 0.7)
    const candleSpacing = chartWidth / candleData.length

    candleData.forEach((candle, index) => {
      const x = padding + (index + 0.5) * candleSpacing
      const openY = priceToY(candle.open)
      const closeY = priceToY(candle.close)
      const highY = priceToY(candle.high)
      const lowY = priceToY(candle.low)

      const isGreen = candle.close > candle.open
      const color = isGreen ? "#00ff88" : "#ff4444"

      // Linha da sombra (high-low)
      ctx.strokeStyle = color
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(x, highY)
      ctx.lineTo(x, lowY)
      ctx.stroke()

      // Corpo da vela (open-close)
      const bodyHeight = Math.abs(closeY - openY)
      const bodyY = Math.min(openY, closeY)

      ctx.fillStyle = color

      if (bodyHeight > 1) {
        // Vela com corpo
        if (isGreen) {
          // Vela verde - corpo vazado
          ctx.strokeStyle = color
          ctx.lineWidth = 1
          ctx.strokeRect(x - candleWidth / 2, bodyY, candleWidth, bodyHeight)
        } else {
          // Vela vermelha - corpo preenchido
          ctx.fillRect(x - candleWidth / 2, bodyY, candleWidth, bodyHeight)
        }
      } else {
        // Doji - linha horizontal
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.moveTo(x - candleWidth / 2, openY)
        ctx.lineTo(x + candleWidth / 2, openY)
        ctx.stroke()
      }
    })

    // Linha de preço atual
    const lastCandle = candleData[candleData.length - 1]
    const priceY = priceToY(lastCandle.close)

    ctx.strokeStyle = "#F7941E"
    ctx.lineWidth = 1
    ctx.setLineDash([3, 3])
    ctx.beginPath()
    ctx.moveTo(padding, priceY)
    ctx.lineTo(padding + chartWidth, priceY)
    ctx.stroke()
    ctx.setLineDash([])
  }, [candleData, selectedTimeframe])

  // Atualização de preço
  useEffect(() => {
    const interval = setInterval(() => {
      const variation = (Math.random() - 0.5) * 0.3
      setCurrentPrice((prev) => {
        const newPrice = Math.max(28, Math.min(35, prev + variation))
        const change = newPrice - 29.15
        setPriceChange(change)
        return newPrice
      })
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="h-full bg-[#2a2a2a] rounded">
      {/* Header compacto */}
      <div className="p-3 border-b border-[#404040]">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-sm font-bold text-white">PETR4</h3>
            <p className="text-xs text-gray-400">Petrobras PN</p>
          </div>
          <div className="text-right">
            <div className={`text-lg font-bold ${priceChange >= 0 ? "text-[#00ff88]" : "text-[#ff4444]"}`}>
              R$ {currentPrice.toFixed(2)}
            </div>
            <div className={`text-xs ${priceChange >= 0 ? "text-[#00ff88]" : "text-[#ff4444]"}`}>
              {priceChange >= 0 ? "+" : ""}
              {priceChange.toFixed(2)}
            </div>
          </div>
        </div>
      </div>



      {/* Gráfico de candlestick */}
      <div className="p-3">
        <div className="bg-[#1e1e1e] rounded border border-[#404040] relative">
          <canvas ref={canvasRef} className="w-full rounded" style={{ height: "400px" }} />

          {/* Indicador tempo real */}
          <div className="absolute top-2 right-2 flex items-center gap-1 text-xs">
            <div className="w-1.5 h-1.5 bg-[#00ff88] rounded-full animate-pulse"></div>
            <span className="text-[#00ff88] text-xs">LIVE</span>
          </div>
        </div>
      {/* Timeframes compactos */}
      <div className="py-2">
        <div className="flex gap-1">
          {["1D", "1W", "1M", "3M"].map((timeframe) => (
            <button
              key={timeframe}
              onClick={() => setSelectedTimeframe(timeframe)}
              className={`px-2 py-1 text-xs rounded transition-colors ${
                selectedTimeframe === timeframe
                  ? "bg-[#F7941E] text-black font-bold"
                  : "bg-[#353535] text-white hover:bg-[#404040]"
              }`}
            >
              {timeframe}
            </button>
          ))}
        </div>
      </div>
      
      </div>
    </div>
  )
}
