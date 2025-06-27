"use client"

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Sector,
  Tooltip,
  RadialBarChart,
  RadialBar,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
} from "recharts"

// Importando funções auxiliares
import { formatCurrency } from "../utils/formatCurrency"

export default function PatrimonioResumidoCharts({
  chartType = "pie",
  chartData = [],
  detailChartData = [],
  isFullVersion = false,
  hideValues = false,
  formattedTotal = "R$ 0,00",
  selectedCategory = null,
  getCategoryTitle = () => "",
  handlePieClick = () => {},
  handleBarClick = () => {},
  handleDetailPieClick = () => {},
  handleDetailBarClick = () => {},
  activeIndex = null,
  activeDetailIndex = null,
  setActiveBarIndex = () => {},
  setActiveDetailBarIndex = () => {},
  hiddenSeries = [],
}) {
  
  // Componente para renderizar o texto central
  const CenterText = ({ title, value, hideValues }) => {
    return (
      <div className="absolute inset-0 flex flex-col justify-center items-center pointer-events-none z-10">
        <div className="p-1 px-2.5 rounded bg-neutral-800/70 text-center">
          <div className="text-neutral-400 text-base mb-1">{title}</div>
          <div className="text-white text-xl font-bold">{hideValues ? "••••••" : value}</div>
        </div>
      </div>
    )
  }

  // Componente para renderizar uma forma ativa personalizada
  const CustomActiveShapePieChart = (props) => {
    const RADIAN = Math.PI / 180
    const {
      cx,
      cy,
      midAngle,
      innerRadius,
      outerRadius,
      startAngle,
      endAngle,
      fill,
      payload,
      percent,
      value,
      category,
      hideValues,
    } = props

    const sin = Math.sin(-RADIAN * midAngle)
    const cos = Math.cos(-RADIAN * midAngle)

    const sx = cx + (outerRadius + 5) * cos
    const sy = cx + (outerRadius + 5) * sin
    const mx = cx + (outerRadius + 30) * cos
    const my = cy + (outerRadius + 30) * sin

    const maxDistance = Math.min(cx * 0.8, 90)
    const textDistance = Math.min(maxDistance, outerRadius + 40)
    const ex = cx + textDistance * cos
    const ey = my

    const textAnchor = cos >= 0 ? "start" : "end"

    return (
      <g>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 3}
          outerRadius={outerRadius + 7}
          fill={fill}
        />
        <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
        <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
        <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#FFF" fontSize={12}>
          {category}
        </text>
        <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999" fontSize={11}>
          {hideValues ? "••••••" : formatCurrency(value)} ({(percent * 100).toFixed(2)}%)
        </text>
      </g>
    )
  }

  // Componente para renderizar o tooltip customizado
  const CustomTooltip = ({ active, payload, hideValues }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-neutral-800 p-2 rounded shadow-lg border border-neutral-600 text-white">
          <p className="font-bold">{data.category}</p>
          <p>
            {hideValues ? "••••••" : formatCurrency(data.value)} ({data.percent?.toFixed(2) || 0}%)
          </p>
        </div>
      )
    }
    return null
  }
  
  // Função para renderizar gráfico baseado no tipo selecionado
  const renderMainChart = () => {
    const filteredData = chartData.filter((_, index) => !hiddenSeries.includes(index))
    
    if (filteredData.length === 0) {
      return (
        <div className="w-full h-full flex items-center justify-center text-neutral-400">
          <p>Nenhum dado disponível</p>
        </div>
      )
    }
    
    const filteredRadialData = filteredData.map((item) => ({
      ...item,
      name: item.category,
      fill: item.color,
      uv: item.percent,
    }))
    
    const filteredBarData = filteredData.map((item) => ({
      name: item.category.length > 15 ? item.category.substring(0, 15) + "..." : item.category,
      value: item.value,
      percent: item.percent,
      fill: item.color,
      id: item.id,
      category: item.category,
    }))
    
    const lineChartData = filteredData.map((item) => ({
      name: item.category.length > 10 ? item.category.substring(0, 10) + "..." : item.category,
      value: item.value,
      percent: item.percent,
    }))

    if (chartType === "radial") {
      return (
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart
            cx="50%"
            cy="50%"
            innerRadius="10%"
            outerRadius="90%"
            data={filteredRadialData}
            startAngle={90}
            endAngle={450}
          >
            <RadialBar
              dataKey="uv"
              cornerRadius={3}
              fill="#8884d8"
              animationBegin={0}
              animationDuration={800}
              animationEasing="ease-out"
              onClick={isFullVersion ? handlePieClick : undefined}
              cursor={isFullVersion ? "pointer" : "default"}
            />
            <Tooltip content={<CustomTooltip hideValues={hideValues} />} />
          </RadialBarChart>
        </ResponsiveContainer>
      )
    }

    if (chartType === "bar") {
      return (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={filteredBarData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            onMouseMove={(state) => {
              if (state.activeTooltipIndex !== undefined) {
                setActiveBarIndex?.(state.activeTooltipIndex)
              }
            }}
            onMouseLeave={() => setActiveBarIndex?.(null)}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="name" stroke="#9CA3AF" fontSize={12} angle={-45} textAnchor="end" height={80} />
            <YAxis stroke="#9CA3AF" fontSize={12} />
            <Tooltip cursor={false} content={<CustomTooltip hideValues={hideValues} />} />
            <Bar
              dataKey="value"
              onClick={isFullVersion ? handleBarClick : undefined}
              cursor={isFullVersion ? "pointer" : "default"}
              animationBegin={0}
              animationDuration={800}
              animationEasing="ease-out"
            >
              {filteredBarData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )
    }

    if (chartType === "line") {
      return (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={lineChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="name" stroke="#9CA3AF" fontSize={12} angle={-45} textAnchor="end" height={80} />
            <YAxis stroke="#9CA3AF" fontSize={12} />
            <Tooltip content={<CustomTooltip hideValues={hideValues} />} />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#EF4444"
              strokeWidth={3}
              dot={{ fill: "#EF4444", strokeWidth: 2, r: 6 }}
              onClick={isFullVersion ? handlePieClick : undefined}
              cursor={isFullVersion ? "pointer" : "default"}
              animationBegin={0}
              animationDuration={800}
              animationEasing="ease-out"
            />
          </LineChart>
        </ResponsiveContainer>
      )
    }

    // Gráfico Pie padrão
    return (
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={filteredData}
            cx="50%"
            cy="50%"
            innerRadius="60%"
            outerRadius="85%"
            dataKey="value"
            nameKey="category"
            paddingAngle={1}
            onClick={isFullVersion ? handlePieClick : undefined}
            activeIndex={activeIndex}
            activeShape={
              isFullVersion ? (props) => <CustomActiveShapePieChart {...props} hideValues={hideValues} /> : undefined
            }
            cursor={isFullVersion ? "pointer" : "default"}
            animationBegin={0}
            animationDuration={800}
            animationEasing="ease-out"
          >
            {filteredData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip hideValues={hideValues} />} />
        </PieChart>
      </ResponsiveContainer>
    )
  }

  // Função para renderizar gráfico de detalhes
  const renderDetailChart = () => {
    if (!selectedCategory || detailChartData.length === 0) return null

    const detailRadialData = detailChartData.map((item) => ({
      ...item,
      name: item.category,
      fill: item.color,
      uv: item.percent,
    }))

    const detailBarData = detailChartData.map((item) => ({
      name: item.category.length > 15 ? item.category.substring(0, 15) + "..." : item.category,
      value: item.value,
      percent: item.percent,
      fill: item.color,
      id: item.id,
      category: item.category,
    }))

    const detailLineData = detailChartData.map((item) => ({
      name: item.category.length > 10 ? item.category.substring(0, 10) + "..." : item.category,
      value: item.value,
      percent: item.percent,
    }))

    if (chartType === "radial") {
      return (
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart
            cx="50%"
            cy="50%"
            innerRadius="20%"
            outerRadius="90%"
            data={detailRadialData}
            startAngle={90}
            endAngle={450}
          >
            <RadialBar
              dataKey="uv"
              cornerRadius={2}
              onClick={handleDetailPieClick}
              cursor="pointer"
              animationBegin={0}
              animationDuration={800}
              animationEasing="ease-out"
            />
            <Tooltip content={<CustomTooltip hideValues={hideValues} />} />
          </RadialBarChart>
        </ResponsiveContainer>
      )
    }

    if (chartType === "bar") {
      return (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={detailBarData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            onMouseMove={(state) => {
              if (state.activeTooltipIndex !== undefined) {
                setActiveDetailBarIndex?.(state.activeTooltipIndex)
              }
            }}
            onMouseLeave={() => setActiveDetailBarIndex?.(null)}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="name" stroke="#9CA3AF" fontSize={12} angle={-45} textAnchor="end" height={80} />
            <YAxis stroke="#9CA3AF" fontSize={12} />
            <Tooltip cursor={false} content={<CustomTooltip hideValues={hideValues} />} />
            <Bar
              dataKey="value"
              onClick={handleDetailBarClick}
              cursor="pointer"
              animationBegin={0}
              animationDuration={800}
              animationEasing="ease-out"
            >
              {detailBarData.map((entry, index) => (
                <Cell key={`cell-detail-${index}`} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )
    }

    if (chartType === "line") {
      return (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={detailLineData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="name" stroke="#9CA3AF" fontSize={12} angle={-45} textAnchor="end" height={80} />
            <YAxis stroke="#9CA3AF" fontSize={12} />
            <Tooltip content={<CustomTooltip hideValues={hideValues} />} />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#EF4444"
              strokeWidth={3}
              dot={{ fill: "#EF4444", strokeWidth: 2, r: 6 }}
              onClick={handleDetailPieClick}
              cursor="pointer"
              animationBegin={0}
              animationDuration={800}
              animationEasing="ease-out"
            />
          </LineChart>
        </ResponsiveContainer>
      )
    }

    // Gráfico Pie de detalhes padrão
    return (
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={detailChartData}
            cx="50%"
            cy="50%"
            innerRadius="60%"
            outerRadius="85%"
            dataKey="value"
            nameKey="category"
            paddingAngle={1}
            onClick={handleDetailPieClick}
            activeIndex={activeDetailIndex}
            activeShape={(props) => <CustomActiveShapePieChart {...props} hideValues={hideValues} />}
            cursor="pointer"
            animationBegin={0}
            animationDuration={800}
            animationEasing="ease-out"
          >
            {detailChartData.map((entry, index) => (
              <Cell key={`cell-detail-${index}`} fill={entry.color} stroke="none" />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip hideValues={hideValues} />} />
        </PieChart>
      </ResponsiveContainer>
    )
  }

  return (
    <div className="w-full h-full min-h-0 relative">
      {/* Gráfico Principal ou de Detalhes */}
      {selectedCategory && detailChartData.length > 0 ? renderDetailChart() : renderMainChart()}
      
      {/* Texto Central */}
      {chartType === "pie" && (
        <CenterText 
          title={selectedCategory && detailChartData.length > 0 ? getCategoryTitle(selectedCategory) : "Total"} 
          value={
            selectedCategory && detailChartData.length > 0 
              ? formatCurrency(detailChartData.reduce((sum, item) => sum + item.value, 0))
              : formattedTotal
          } 
          hideValues={hideValues} 
        />
      )}
    </div>
  )
}