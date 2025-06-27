console.log("ARQUIVO dataGarantias.js CARREGADO!")

const garantiasRaw = [
  {
    id: "GAR001",
    dtCollateral: "15/01/2025",
    collateral: "Carta de Fiança",
    description: "Carta de Fiança Banco ABC",
    qty: 1,
    value: 8500.00,
    currency: "BRL",
    dtExpired: "15/01/2026",
    origin: "Banco ABC",
    codigo: "GAR001",
    nome: "Carta de Fiança Banco ABC",
    status: "Ativa"
  },
  {
    id: "GAR002", 
    dtCollateral: "20/02/2025",
    collateral: "Título Privado",
    description: "CDB Banco DEF",
    qty: 1,
    value: 12000.00,
    currency: "BRL",
    dtExpired: "20/12/2025",
    origin: "Banco DEF S.A.",
    codigo: "GAR002",
    nome: "CDB Banco DEF",
    status: "Ativa"
  },
  {
    id: "GAR003",
    dtCollateral: "10/03/2025",
    collateral: "Ações",
    description: "PETR4 - Petróleo Brasileiro S.A.",
    qty: 200,
    value: 6800.00,
    currency: "BRL", 
    dtExpired: null,
    origin: "B3",
    codigo: "PETR4",
    nome: "Petróleo Brasileiro S.A.",
    status: "Ativa"
  },
  {
    id: "GAR004",
    dtCollateral: "05/01/2025",
    collateral: "Título Público",
    description: "Letra do Tesouro Nacional",
    qty: 1,
    value: 5200.00,
    currency: "BRL",
    dtExpired: "26/08/2025",
    origin: "Tesouro Nacional",
    codigo: "LTN250826",
    nome: "Letra do Tesouro Nacional",
    status: "Ativa"
  },
  {
    id: "GAR005",
    dtCollateral: "10/02/2025",
    collateral: "Valor em Espécie",
    description: "Depósito em Garantia",
    qty: 1,
    value: 3500.00,
    currency: "BRL",
    dtExpired: null,
    origin: "Conta Garantia",
    codigo: "ESP001",
    nome: "Depósito em Garantia",
    status: "Ativa"
  },
  {
    id: "GAR006",
    dtCollateral: "15/03/2025",
    collateral: "Treasuries",
    description: "US Treasury Bill 90 dias",
    qty: 1,
    value: 4200.00,
    currency: "USD",
    dtExpired: "15/05/2025",
    origin: "US Treasury",
    codigo: "T-BILL90",
    nome: "US Treasury Bill 90 dias",
    status: "Ativa"
  },
  {
    id: "GAR007",
    dtCollateral: "20/01/2025",
    collateral: "Moeda Estrangeira",
    description: "Dólar Americano",
    qty: 500,
    value: 2800.00,
    currency: "USD",
    dtExpired: null,
    origin: "Corretora XYZ",
    codigo: "USD",
    nome: "Dólar Americano",
    status: "Ativa"
  },
  {
    id: "GAR008",
    dtCollateral: "25/02/2025",
    collateral: "Cédula de Produto Rural",
    description: "CPR Soja 2025",
    qty: 50,
    value: 1500.00,
    currency: "BRL",
    dtExpired: "30/06/2025",
    origin: "Fazenda São João",
    codigo: "CPR001",
    nome: "CPR Soja 2025",
    status: "Ativa"
  },
  {
    id: "GAR009",
    dtCollateral: "05/01/2025",
    collateral: "Fundos de Investimento",
    description: "Fundo Garantia Plus",
    qty: 80,
    value: 800.00,
    currency: "BRL",
    dtExpired: null,
    origin: "Gestora ABC",
    codigo: "FUND001",
    nome: "Fundo Garantia Plus",
    status: "Ativa"
  },
  {
    id: "GAR010",
    dtCollateral: "12/03/2025",
    collateral: "Ouro",
    description: "Ouro Físico",
    qty: 10,
    value: 700.00,
    currency: "BRL",
    dtExpired: null,
    origin: "Certificado CERT-OZ-001",
    codigo: "OZ1",
    nome: "Ouro Físico",
    status: "Ativa"
  }
]

const groupByCollateralType = (garantias) => {
  const grouped = {}
  
  garantias.forEach(garantia => {
    const tipo = garantia.collateral
    if (!grouped[tipo]) {
      grouped[tipo] = []
    }
    grouped[tipo].push(garantia)
  })
  
  return grouped
}

const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
}

const generateSubcategories = () => {
  const grouped = groupByCollateralType(garantiasRaw)
  
  return Object.keys(grouped).map(tipo => {
    const ativos = grouped[tipo]
    const totalValue = ativos.reduce((sum, ativo) => sum + ativo.value, 0)
    
    return {
      id: tipo.toLowerCase().replace(/\s+/g, '').replace(/[àáâãäå]/g, 'a').replace(/[èéêë]/g, 'e').replace(/[ìíîï]/g, 'i').replace(/[òóôõö]/g, 'o').replace(/[ùúûü]/g, 'u').replace(/[ç]/g, 'c'),
      label: tipo,
      value: formatCurrency(totalValue),
      rawValue: totalValue,
      percent: "0%",
      up: true,
      change: "0%",
      ativos: ativos
    }
  })
}

export const garantiasData = {
  title: "Garantias",
  total: garantiasRaw.reduce((sum, item) => sum + item.value, 0),
  items: generateSubcategories(),
  
  calculateTotal() {
    return this.items.reduce((total, item) => {
      return total + item.ativos.reduce((subTotal, ativo) => subTotal + ativo.value, 0)
    }, 0)
  },
  
  groupByType() {
    const grouped = {}
    this.items.forEach(item => {
      grouped[item.label] = item.ativos
    })
    return grouped
  },
  
  filterBy(field, value) {
    const allAtivos = []
    this.items.forEach(item => {
      allAtivos.push(...item.ativos)
    })
    return allAtivos.filter(ativo => ativo[field] === value)
  },
  
  getAllAtivos() {
    const allAtivos = []
    this.items.forEach(item => {
      allAtivos.push(...item.ativos)
    })
    return allAtivos
  }
}

export const convertApiDataToGarantias = (apiData) => {
  const converted = apiData.map((item, index) => ({
    id: `GAR${String(index + 1).padStart(3, '0')}`,
    dtCollateral: item.dtCollateral,
    collateral: item.collateral,
    description: item.description,
    qty: item.qty,
    value: item.value,
    currency: item.currency,
    dtExpired: item.dtExpired,
    origin: item.origin,
    codigo: item.codigo || `GAR${String(index + 1).padStart(3, '0')}`,
    nome: item.description,
    status: "Ativa"
  }))
  
  const grouped = groupByCollateralType(converted)
  
  const items = Object.keys(grouped).map(tipo => {
    const ativos = grouped[tipo]
    const totalValue = ativos.reduce((sum, ativo) => sum + ativo.value, 0)
    
    return {
      id: tipo.toLowerCase().replace(/\s+/g, '').replace(/[àáâãäå]/g, 'a').replace(/[èéêë]/g, 'e').replace(/[ìíîï]/g, 'i').replace(/[òóôõö]/g, 'o').replace(/[ùúûü]/g, 'u').replace(/[ç]/g, 'c'),
      label: tipo,
      value: formatCurrency(totalValue),
      rawValue: totalValue,
      percent: "0%",
      up: true,
      change: "0%",
      ativos: ativos
    }
  })
  
  return {
    title: "Garantias",
    total: converted.reduce((sum, item) => sum + item.value, 0),
    items: items
  }
}

garantiasData.total = garantiasData.calculateTotal()

garantiasData.items.forEach(item => {
  const percentage = ((item.rawValue / garantiasData.total) * 100).toFixed(2)
  item.percent = `${percentage.replace('.', ',')}%`
})

export { garantiasData as default }