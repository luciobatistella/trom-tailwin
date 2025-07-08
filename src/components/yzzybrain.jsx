// 🧠 YZZY BRAIN - Inteligência Artificial para Trading
// Arquivo: yzzybrain.jsx

// 📚 DICIONÁRIO COMPLETO DE TRADING
export const tradingDictionary = {
  
  // 🎯 TIPOS DE OPERAÇÃO
  operations: {
    'BUY': [
      'compre', 'comprar', 'comprando', 'comprei',
      'investir', 'investindo', 'investi', 'aplicar',
      'adquirir', 'adquirindo', 'entrar', 'entrando',
      'quero', 'vou comprar', 'quero investir'
    ],
    'SELL': [
      'venda', 'vender', 'vendendo', 'vendi',
      'realizar', 'realizando', 'realizei',
      'sair', 'saindo', 'desfazer', 'liquidar',
      'zerar', 'zerando', 'embolsar'
    ]
  },

  // 📊 TIPOS DE ORDEM
  orderTypes: {
    'MARKET': [
      'a mercado', 'mercado', 'preço atual',
      'agora', 'imediato', 'na hora', 'já'
    ],
    'LIMIT': [
      'limitada', 'limite', 'limitado', 'por',
      'no preço', 'a preço', 'específico',
      'quando chegar', 'se chegar'
    ],
    'STOP_LOSS': [
      'stop loss', 'stop', 'proteção', 'para',
      'limitador', 'corte', 'se cair',
      'proteger', 'segurar prejuízo', 'perda máxima'
    ],
    'STOP_GAIN': [
      'stop gain', 'gain', 'lucro', 'realizar lucro',
      'se subir', 'quando atingir', 'embolsar',
      'garantir lucro', 'meta de lucro'
    ],
    'TRAILING': [
      'móvel', 'trailing', 'seguir', 'acompanhar',
      'stop móvel', 'seguindo', 'dinâmico',
      'que acompanha', 'que segue'
    ],
    'OCO': [
      'oco', 'one cancels other', 'uma cancela',
      'ou', 'alternativamente', 'caso contrário'
    ],
    'BRACKET': [
      'bracket', 'proteção total', 'stop e gain',
      'dupla proteção', 'com stop e gain'
    ]
  },

  // ⏰ VALIDADE
  validity: {
    'DAY': [
      'dia', 'hoje', 'sessão', 'até fechar',
      'válida hoje', 'day'
    ],
    'GTC': [
      'gtc', 'até cancelar', 'permanente',
      'válida sempre', 'good till cancelled',
      'enquanto não cancelar'
    ],
    'IOC': [
      'ioc', 'imediato', 'ou cancela',
      'immediate or cancel', 'agora ou nunca'
    ]
  },

  // 🏢 MERCADOS
  markets: {
    'SPOT': [
      'vista', 'normal', 'comum', 'regular'
    ],
    'FRACTIONAL': [
      'fracionário', 'fração', 'fracionado',
      'menos de 100', 'unitário'
    ]
  },

  // 📈 ATIVOS (Expandido)
  assets: {
    'PETR4': ['petrobras', 'petr4', 'petr', 'petro'],
    'VALE3': ['vale', 'vale3', 'minério', 'mineração'],
    'ITUB4': ['itau','itaú', 'itub4', 'itaú', 'banco itau'],
    'BBDC4': ['bradesco', 'bbdc4', 'banco bradesco'],
    'MGLU3': ['magazine', 'magalu', 'mglu3', 'magazine luiza', 'magazin', 'magaz', 'magaz luiza', 'magazine l', 'magaluza', 'magalú'],
    'ABEV3': ['ambev', 'abev3', 'cerveja', 'bebida'],
    'WEGE3': ['weg', 'wege3', 'motores'],
    'RENT3': ['localiza', 'rent3', 'aluguel'],
    'LREN3': ['renner', 'lren3', 'lojas renner'],
    'JBSS3': ['jbs', 'jbss3', 'frigorífico'],
    'BOVA11': ['bova11', 'bova', 'ibovespa', 'etf bovespa'],
    'SMAL11': ['smal11', 'small caps', 'pequenas']
  },

  // 💰 REGEX PARA VALORES
  patterns: {
    MONEY: /(?:r\$|reais?)\s*(\d+(?:\.\d{3})*(?:,\d{2})?|\d+)/gi,
    MONEY_ALT: /(\d+(?:\.\d{3})*(?:,\d{2})?|\d+)\s*(?:r\$|reais?)/gi,
    PRICE: /(?:por|a|em)\s*(?:r\$\s*)?(\d+(?:,\d{2})?)/gi,
    PERCENTAGE: /(\d+(?:,\d{2})?)\s*%/gi,
    QUANTITY: /(\d+)\s*(?:ações?|papéis|cotas|unidades)/gi,
    
    // Números por extenso - EXPANDIDO PARA RECONHECIMENTO DE VOZ
    WRITTEN_NUMBERS: {
      // Casos especiais de reconhecimento de voz ruim
      'em reais': 100,      // "cem reais" → "em reais"
      'reais': 100,         // valor perdido
      'em': 100,            // "cem" → "em"
      
      // Números básicos
      'cem': 100,
      'cento': 100,
      'duzentos': 200,
      'trezentos': 300,
      'quatrocentos': 400,
      'quinhentos': 500,
      'seiscentos': 600,
      'setecentos': 700,
      'oitocentos': 800,
      'novecentos': 900,
      
      // Milhares
      'mil': 1000,
      'um mil': 1000,
      'dois mil': 2000,
      'três mil': 3000,
      'quatro mil': 4000,
      'cinco mil': 5000,
      'seis mil': 6000,
      'sete mil': 7000,
      'oito mil': 8000,
      'nove mil': 9000,
      'dez mil': 10000,
      
      // Variações femininas
      'duzentas': 200,
      'trezentas': 300,
      'quatrocentas': 400,
      'quinhentas': 500,
      'seiscentas': 600,
      'setecentas': 700,
      'oitocentas': 800,
      'novecentas': 900
    }
  }
}

// 🔧 FUNÇÃO PRINCIPAL DE PROCESSAMENTO
export const processCommand = (input) => {
  console.log('🧠 YZZY BRAIN processando:', input)
  
  const result = {
    operation: null,        // BUY, SELL
    orderType: 'MARKET',   // MARKET, LIMIT, STOP_LOSS, etc.
    asset: null,           // PETR4, VALE3, etc.
    amount: null,          // valor em R$
    quantity: null,        // quantidade de ações
    price: null,           // preço específico
    stopPrice: null,       // preço do stop
    gainPrice: null,       // preço do gain
    percentage: null,      // percentual para trailing
    validity: 'DAY',       // DAY, GTC, IOC
    market: 'SPOT',        // SPOT, FRACTIONAL
    confidence: 0,         // confiança na interpretação
    originalText: input,
    errors: [],
    suggestions: []
  }
  
  const text = input.toLowerCase().trim()
  
  try {
    // 1️⃣ DETECTAR OPERAÇÃO (COMPRA/VENDA)
    for (const [op, keywords] of Object.entries(tradingDictionary.operations)) {
      if (keywords.some(keyword => text.includes(keyword))) {
        result.operation = op
        result.confidence += 0.3
        console.log(`🎯 Operação detectada: ${op}`)
        break
      }
    }
    
    // 2️⃣ DETECTAR TIPO DE ORDEM
    for (const [type, keywords] of Object.entries(tradingDictionary.orderTypes)) {
      if (keywords.some(keyword => text.includes(keyword))) {
        result.orderType = type
        result.confidence += 0.2
        console.log(`📊 Tipo de ordem: ${type}`)
        break
      }
    }
    
    // 3️⃣ DETECTAR ATIVO
    for (const [asset, keywords] of Object.entries(tradingDictionary.assets)) {
      if (keywords.some(keyword => text.includes(keyword))) {
        result.asset = asset
        result.confidence += 0.3
        console.log(`📈 Ativo detectado: ${asset}`)
        break
      }
    }
    // NOVO: Se não encontrou asset, tenta getAssetData(text)
    if (!result.asset) {
      const assetObj = getAssetData(text)
      if (assetObj && assetObj.codigo) {
        result.asset = assetObj.codigo
        result.confidence += 0.25
        console.log(`📈 Ativo detectado via getAssetData: ${assetObj.codigo}`)
      }
    }
    
    // 4️⃣ EXTRAIR VALORES
    // Dinheiro (R$ 1.000)
    let moneyMatch = text.match(tradingDictionary.patterns.MONEY)
    if (!moneyMatch) {
      moneyMatch = text.match(tradingDictionary.patterns.MONEY_ALT)
    }
    if (moneyMatch) {
      result.amount = parseFloat(moneyMatch[1].replace(/\./g, '').replace(',', '.'))
      result.confidence += 0.2
      console.log(`💰 Valor detectado: R$ ${result.amount}`)
    }
    
    // Quantidade (100 ações)
    const quantityMatch = text.match(tradingDictionary.patterns.QUANTITY)
    if (quantityMatch) {
      result.quantity = parseInt(quantityMatch[1])
      result.confidence += 0.2
      console.log(`📊 Quantidade detectada: ${result.quantity}`)
    }
    
    // Preço específico (por R$ 25,50)
    const priceMatch = text.match(tradingDictionary.patterns.PRICE)
    if (priceMatch) {
      result.price = parseFloat(priceMatch[1].replace(',', '.'))
      result.confidence += 0.15
      console.log(`💲 Preço detectado: R$ ${result.price}`)
    }
    
    // Percentual (5%)
    const percentageMatch = text.match(tradingDictionary.patterns.PERCENTAGE)
    if (percentageMatch) {
      result.percentage = parseFloat(percentageMatch[1].replace(',', '.'))
      result.confidence += 0.1
      console.log(`📈 Percentual detectado: ${result.percentage}%`)
    }
    
    // 5️⃣ DETECTAR VALIDADE
    for (const [validity, keywords] of Object.entries(tradingDictionary.validity)) {
      if (keywords.some(keyword => text.includes(keyword))) {
        result.validity = validity
        result.confidence += 0.1
        console.log(`⏰ Validade: ${validity}`)
        break
      }
    }
    
    // 6️⃣ DETECTAR MERCADO
    for (const [market, keywords] of Object.entries(tradingDictionary.markets)) {
      if (keywords.some(keyword => text.includes(keyword))) {
        result.market = market
        result.confidence += 0.05
        console.log(`🏢 Mercado: ${market}`)
        break
      }
    }
    
    // 7️⃣ NÚMEROS POR EXTENSO - MELHORADO PARA RECONHECIMENTO DE VOZ
    for (const [written, value] of Object.entries(tradingDictionary.patterns.WRITTEN_NUMBERS)) {
      // Busca exata para casos especiais de reconhecimento de voz
      if (text === written || text.includes(written)) {
        if (!result.amount) {
          result.amount = value
          result.confidence += 0.2
          console.log(`🔤🎤 Número por extenso detectado: "${written}" = ${value}`)
          break
        }
      }
    }
    
    // 8️⃣ VALIDAÇÕES E SUGESTÕES
    if (!result.operation) {
      result.errors.push('Operação não identificada (compra/venda)')
      result.suggestions.push('Tente: "Compre..." ou "Venda..."')
    }
    
    if (!result.asset) {
      result.errors.push('Ativo não identificado')
      result.suggestions.push('Especifique o ativo: PETR4, VALE3, ITUB4...')
    }
    
    if (!result.amount && !result.quantity) {
      result.errors.push('Valor ou quantidade não especificados')
      result.suggestions.push('Especifique: "R$ 1.000" ou "100 ações"')
    }
    
    console.log('🧠 Resultado final:', result)
    return result
    
  } catch (error) {
    console.error('❌ Erro no YZZY Brain:', error)
    result.errors.push(`Erro interno: ${error.message}`)
    return result
  }
}

// 🎯 FUNÇÃO PARA GERAR RESPOSTA HUMANA
export const generateResponse = (parsedCommand) => {
  const { operation, orderType, asset, amount, quantity, price, confidence } = parsedCommand
  
  if (confidence < 0.5) {
    return {
      success: false,
      message: `❓ **Não entendi completamente seu comando.**\n\n**Erros encontrados:**\n${parsedCommand.errors.map(e => `• ${e}`).join('\n')}\n\n**Sugestões:**\n${parsedCommand.suggestions.map(s => `• ${s}`).join('\n')}`,
      data: null
    }
  }
  
  // Gerar confirmação baseada no tipo de ordem
  let message = ''
  let orderData = {}
  
  switch (orderType) {
    case 'MARKET':
      message = `✅ **Ordem ${operation === 'BUY' ? 'de compra' : 'de venda'} a mercado preparada!**\n\n`
      break
    case 'LIMIT':
      message = `✅ **Ordem ${operation === 'BUY' ? 'de compra' : 'de venda'} limitada preparada!**\n\n`
      break
    case 'STOP_LOSS':
      message = `🛡️ **Stop Loss preparado!**\n\n`
      break
    case 'STOP_GAIN':
      message = `🎯 **Stop Gain preparado!**\n\n`
      break
    case 'TRAILING':
      message = `📈 **Ordem Móvel (Trailing Stop) preparada!**\n\n`
      break
    case 'OCO':
      message = `🔄 **Ordem OCO (Uma Cancela Outra) preparada!**\n\n`
      break
    case 'BRACKET':
      message = `🛡️ **Ordem Bracket (Stop + Gain) preparada!**\n\n`
      break
  }
  
  // Adicionar detalhes
  message += `📊 **${asset}**\n`
  
  if (amount) {
    message += `💰 **Valor:** R$ ${amount.toLocaleString('pt-BR', {minimumFractionDigits: 2})}\n`
  }
  
  if (quantity) {
    message += `📈 **Quantidade:** ${quantity} ações\n`
  }
  
  if (price) {
    message += `💲 **Preço:** R$ ${price.toFixed(2)}\n`
  }
  
  message += `\n**Posso executar esta ordem?**`
  
  return {
    success: true,
    message: message,
    data: {
      ...parsedCommand,
      orderData
    }
  }
}

// Dados completos dos ativos (centralizado)
export const assetDetails = {
  'PETR4': { codigo: 'PETR4', nome: 'PETROBRAS PN', preco: 28.45, setor: 'Petróleo' },
  'VALE3': { codigo: 'VALE3', nome: 'VALE ON', preco: 65.32, setor: 'Mineração' },
  'ITUB4': { codigo: 'ITUB4', nome: 'ITAUUNIBANCO PN', preco: 25.18, setor: 'Bancos' },
  'BBDC4': { codigo: 'BBDC4', nome: 'BRADESCO PN', preco: 13.89, setor: 'Bancos' },
  'MGLU3': { codigo: 'MGLU3', nome: 'MAGAZ LUIZA ON', preco: 12.75, setor: 'Varejo' },
  'ABEV3': { codigo: 'ABEV3', nome: 'AMBEV ON', preco: 14.20, setor: 'Bebidas' },
  'WEGE3': { codigo: 'WEGE3', nome: 'WEG ON', preco: 36.50, setor: 'Indústria' },
  'RENT3': { codigo: 'RENT3', nome: 'LOCALIZA ON', preco: 55.10, setor: 'Locação' },
  'LREN3': { codigo: 'LREN3', nome: 'LOJAS RENNER ON', preco: 28.00, setor: 'Varejo' },
  'JBSS3': { codigo: 'JBSS3', nome: 'JBS ON', preco: 22.80, setor: 'Alimentos' },
  'BOVA11': { codigo: 'BOVA11', nome: 'iShares Ibovespa', preco: 120.00, setor: 'ETF' },
  'SMAL11': { codigo: 'SMAL11', nome: 'iShares Small Caps', preco: 110.00, setor: 'ETF' }
};

// Função para remover acentos de uma string
function removeAccents(str) {
  return str.normalize("NFD").replace(/\p{Diacritic}/gu, "");
}

// Função utilitária para buscar dados completos do ativo a partir de código, nome ou apelido
export function getAssetData(query) {
  if (!query) return null;
  const normalized = removeAccents(query.toString().toLowerCase().trim());
  // Busca por código exato
  for (const [codigo, apelidos] of Object.entries(tradingDictionary.assets)) {
    if (removeAccents(codigo.toLowerCase()) === normalized) {
      return { ...assetDetails[codigo], apelidos };
    }
  }
  // Busca por apelido (palavra inteira, sem acento)
  for (const [codigo, apelidos] of Object.entries(tradingDictionary.assets)) {
    if (apelidos.some(apelido => {
      const ap = removeAccents(apelido.toLowerCase());
      return new RegExp(`\\b${ap}\\b`, 'i').test(normalized);
    })) {
      return { ...assetDetails[codigo], apelidos };
    }
  }
  // Busca parcial (sem acento)
  for (const [codigo, apelidos] of Object.entries(tradingDictionary.assets)) {
    if (apelidos.some(apelido => removeAccents(apelido.toLowerCase()).includes(normalized))) {
      return { ...assetDetails[codigo], apelidos };
    }
  }
  return null;
}

// 🧪 FUNÇÃO DE TESTE
export const testBrain = () => {
  console.log('🧪 === TESTANDO YZZY BRAIN ===')
  
  const testCommands = [
    "Compre R$ 1.000 de ações da Petrobras",
    "Stop loss na VALE3 em R$ 60",
    "Ordem móvel no Itaú com 5% de distância",
    "Venda 100 MGLU3 a mercado",
    "Compre PETR4 por R$ 28,50 válida GTC",
    "Proteger VALE3 com stop em 62 reais",
    // Testes de reconhecimento de voz
    "em reais",  // deve detectar 100
    "cem reais da petrobras",
    "quinhentos da vale"
  ]
  
  testCommands.forEach((cmd, index) => {
    console.log(`\n${index + 1}. Comando: "${cmd}"`)
    const result = processCommand(cmd)
    const response = generateResponse(result)
    console.log('Resposta:', response.message)
    console.log('Confiança:', result.confidence)
  })
}

// Executar teste se estiver sendo executado diretamente
if (typeof window !== 'undefined' && window.location?.href) {
  // testBrain() // Descomente para testar
}