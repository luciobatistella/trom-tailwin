"use client"
import { useState, useEffect, useRef } from "react"
import { useToast } from "./toast"
import { processCommand, generateResponse, getAssetData } from "./yzzybrain"

const Yzzy = ({ isOpen, onClose }) => {
  const { addToast } = useToast()
  const [messages, setMessages] = useState([])
  const [currentInput, setCurrentInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [selectedAsset, setSelectedAsset] = useState(null)
  
  // Estados para comando de voz
  const [isListening, setIsListening] = useState(false)
  const [speechSupported, setSpeechSupported] = useState(false)
  const [micPermission, setMicPermission] = useState('prompt')
  const [recognition, setRecognition] = useState(null)
  
  // Estados para conversação em múltiplas etapas
  const [conversationState, setConversationState] = useState(null)
  const [partialOrder, setPartialOrder] = useState(null)
  
  // Estados para operação de compra - USANDO useRef para persistir
  const [pendingOrder, setPendingOrder] = useState(null)
  const [awaitingConfirmation, setAwaitingConfirmation] = useState(false)
  const pendingOrderRef = useRef(null)
  const awaitingConfirmationRef = useRef(false)

  // Simulação de saldo do usuário
  const [userBalance, setUserBalance] = useState(50000)
    
  
  const [activeTab, setActiveTab] = useState("account")  
  const [orders, setOrders] = useState([])
  
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  // Função MELHORADA para reconhecer valores por extenso
  const reconhecerValorPorExtenso = (input) => {
    const inputLower = input.toLowerCase().trim()
    console.log('🔍 ANALISANDO INPUT:', `"${inputLower}"`)
    
    // CASOS ESPECIAIS DE RECONHECIMENTO DE VOZ RUIM
    const casosEspeciais = [
      // Reconhecimento ruim comum
      { regex: /^em\s*reais?$/i, valor: 100, descricao: "provavelmente 'cem reais'" },
      { regex: /^reais?$/i, valor: 100, descricao: "provavelmente 'cem reais' ou valor perdido" },
      { regex: /^em$/i, valor: 100, descricao: "provavelmente 'cem'" },
      // Outros padrões problemáticos
      { regex: /^quinhentos?$/i, valor: 500, descricao: "quinhentos" },
      { regex: /^duzentos?$/i, valor: 200, descricao: "duzentos" },
      { regex: /^trezentos?$/i, valor: 300, descricao: "trezentos" },
      { regex: /^mil$/i, valor: 1000, descricao: "mil" },
    ]
    
    // Verificar casos especiais primeiro
    for (const caso of casosEspeciais) {
      if (inputLower.match(caso.regex)) {
        console.log(`🎤 CASO ESPECIAL DETECTADO: "${inputLower}" = ${caso.valor} (${caso.descricao})`)
        return caso.valor
      }
    }
    
    // PRIMEIRO: Verificar padrões com R$ (MAIS IMPORTANTE!)
    const padroesRS = [
      // R$ seguido de número
      { regex: /r\$\s*(\d+)/i, multiplicador: 1 },
      { regex: /(\d+)\s*r\$/i, multiplicador: 1 },
      // R$ com formatação
      { regex: /r\$\s*(\d{1,3}(?:\.\d{3})*(?:,\d{2})?)/i, formatado: true },
    ]
    
    // Testar padrões com R$ primeiro
    for (const padrao of padroesRS) {
      const match = inputLower.match(padrao.regex)
      if (match) {
        let numero
        if (padrao.formatado) {
          // Remover pontos de milhares e trocar vírgula por ponto
          numero = parseFloat(match[1].replace(/\./g, '').replace(',', '.'))
        } else {
          numero = parseInt(match[1])
        }
        console.log(`💰 ENCONTRADO R$: "${match[0].trim()}" = ${numero}`)
        return numero
      }
    }
    
    // SEGUNDO: Verificar padrões de números + "reais"
    const padroes = [
      // Números básicos com "reais"
      { regex: /(?:^|\s)(\d+)\s*reais?(?:\s|$)/, multiplicador: 1 },
      { regex: /(?:^|\s)(\d+)\s*real(?:\s|$)/, multiplicador: 1 },
      
      // Números por extenso básicos - VERSÃO MAIS FLEXÍVEL
      { regex: /(?:^|\s|^)cem\s*reais?(?:\s|$|$)/i, valor: 100 },
      { regex: /(?:^|\s|^)cento\s*reais?(?:\s|$|$)/i, valor: 100 },
      { regex: /(?:^|\s|^)duzentos?\s*reais?(?:\s|$|$)/i, valor: 200 },
      { regex: /(?:^|\s|^)trezentos?\s*reais?(?:\s|$|$)/i, valor: 300 },
      { regex: /(?:^|\s|^)quatrocentos?\s*reais?(?:\s|$|$)/i, valor: 400 },
      { regex: /(?:^|\s|^)quinhentos?\s*reais?(?:\s|$|$)/i, valor: 500 },
      { regex: /(?:^|\s|^)seiscentos?\s*reais?(?:\s|$|$)/i, valor: 600 },
      { regex: /(?:^|\s|^)setecentos?\s*reais?(?:\s|$|$)/i, valor: 700 },
      { regex: /(?:^|\s|^)oitocentos?\s*reais?(?:\s|$|$)/i, valor: 800 },
      { regex: /(?:^|\s|^)novecentos?\s*reais?(?:\s|$|$)/i, valor: 900 },
      
      // Milhares
      { regex: /(?:^|\s|^)mil\s*reais?(?:\s|$|$)/i, valor: 1000 },
      { regex: /(?:^|\s|^)um\s*mil\s*reais?(?:\s|$|$)/i, valor: 1000 },
      { regex: /(?:^|\s|^)dois\s*mil\s*reais?(?:\s|$|$)/i, valor: 2000 },
      { regex: /(?:^|\s|^)três\s*mil\s*reais?(?:\s|$|$)/i, valor: 3000 },
      { regex: /(?:^|\s|^)quatro\s*mil\s*reais?(?:\s|$|$)/i, valor: 4000 },
      { regex: /(?:^|\s|^)cinco\s*mil\s*reais?(?:\s|$|$)/i, valor: 5000 },
      
      // Valores menores (só com "reais" explícito)
      { regex: /(?:^|\s|^)cinquenta\s*reais?(?:\s|$|$)/i, valor: 50 },
      { regex: /(?:^|\s|^)sessenta\s*reais?(?:\s|$|$)/i, valor: 60 },
      { regex: /(?:^|\s|^)setenta\s*reais?(?:\s|$|$)/i, valor: 70 },
      { regex: /(?:^|\s|^)oitenta\s*reais?(?:\s|$|$)/i, valor: 80 },
      { regex: /(?:^|\s|^)noventa\s*reais?(?:\s|$|$)/i, valor: 90 },
      { regex: /(?:^|\s|^)dez\s*reais?(?:\s|$|$)/i, valor: 10 },
      { regex: /(?:^|\s|^)vinte\s*reais?(?:\s|$|$)/i, valor: 20 },
      { regex: /(?:^|\s|^)trinta\s*reais?(?:\s|$|$)/i, valor: 30 },
      { regex: /(?:^|\s|^)quarenta\s*reais?(?:\s|$|$)/i, valor: 40 },
      
      // Números básicos sem "reais" mas altos o suficiente
      { regex: /(?:^|\s|^)cem(?:\s|$|$)/i, valor: 100, semReais: true },
      { regex: /(?:^|\s|^)duzentos?(?:\s|$|$)/i, valor: 200, semReais: true },
      { regex: /(?:^|\s|^)trezentos?(?:\s|$|$)/i, valor: 300, semReais: true },
      { regex: /(?:^|\s|^)quatrocentos?(?:\s|$|$)/i, valor: 400, semReais: true },
      { regex: /(?:^|\s|^)quinhentos?(?:\s|$|$)/i, valor: 500, semReais: true },
      { regex: /(?:^|\s|^)mil(?:\s|$|$)/i, valor: 1000, semReais: true },
      { regex: /(?:^|\s|^)dois\s*mil(?:\s|$|$)/i, valor: 2000, semReais: true },
      { regex: /(?:^|\s|^)três\s*mil(?:\s|$|$)/i, valor: 3000, semReais: true },
    ]
    
    // Testar cada padrão
    for (const padrao of padroes) {
      const match = inputLower.match(padrao.regex)
      if (match) {
        if (padrao.multiplicador) {
          const numero = parseInt(match[1])
          console.log(`🔢 ENCONTRADO: "${match[0].trim()}" = ${numero}`)
          return numero
        } else if (padrao.valor) {
          console.log(`🔢 ENCONTRADO: "${match[0].trim()}" = ${padrao.valor}`)
          return padrao.valor
        }
      }
    }
    
    // TERCEIRO: Padrões mais flexíveis para números comuns
    const numerosFlexiveis = {
      'cem': 100, 'cento': 100,
      'duzentos': 200, 'duzentas': 200,
      'trezentos': 300, 'trezentas': 300,
      'quatrocentos': 400, 'quatrocentas': 400,
      'quinhentos': 500, 'quinhentas': 500,
      'seiscentos': 600, 'seiscentas': 600,
      'setecentos': 700, 'setecentas': 700,
      'oitocentos': 800, 'oitocentas': 800,
      'novecentos': 900, 'novecentas': 900,
      'mil': 1000
    }
    
    // Verificar se algum número por extenso está presente (para valores >= 100)
    for (const [extenso, valor] of Object.entries(numerosFlexiveis)) {
      if (inputLower.includes(extenso) && valor >= 100) {
        console.log(`🔢 ENCONTRADO FLEXÍVEL: "${extenso}" = ${valor}`)
        return valor
      }
    }
    
    console.log('❌ NENHUM VALOR RECONHECIDO')
    return 0 // Não reconhecido
  }

  // Função para processar follow-up de conversação
  const processFollowUp = (input, state, partial) => {
    console.log('🔄 PROCESSANDO FOLLOW-UP:', { input, state, partial })
    console.log('🎤 INPUT RECEBIDO PARA ANÁLISE:', input)
    
    const inputLower = input.toLowerCase().trim()
    
    switch (state) {
      case 'waiting_amount':
        // Primeiro, tentar reconhecer valores por extenso
        const valorPorExtenso = reconhecerValorPorExtenso(inputLower)
        console.log('🔢 VALOR RECONHECIDO:', valorPorExtenso)
        
        const amountMatch = input.match(/(?:r\$\s*)?(\d+(?:\.\d{3})*(?:,\d{2})?|\d+)/i)
        const quantityMatch = input.match(/(\d+)\s*(?:ações?|papéis|cotas|unidades)/i)
        
        // Se encontrou valor por extenso
        if (valorPorExtenso > 0) {
          const updatedPartial = { ...partial, amount: valorPorExtenso, amountType: 'money' }
          
          addYzzyMessage(`💰 **Perfeito! R$ ${valorPorExtenso.toLocaleString('pt-BR', {minimumFractionDigits: 2})} em ${partial.asset}**\n\nAgora vou preparar sua ordem...`)
          
          setTimeout(() => {
            processCompleteOrder(updatedPartial)
          }, 1000)
          
          setConversationState(null)
          setPartialOrder(null)
          return true
        }
        // Se encontrou valor numérico
        else if (amountMatch && (inputLower.includes('r$') || inputLower.includes('reais') || !quantityMatch)) {
          const amount = parseFloat(amountMatch[1].replace(/\./g, '').replace(',', '.'))
          const updatedPartial = { ...partial, amount, amountType: 'money' }
          
          addYzzyMessage(`💰 **Perfeito! R$ ${amount.toLocaleString('pt-BR', {minimumFractionDigits: 2})} em ${partial.asset}**\n\nAgora vou preparar sua ordem...`)
          
          setTimeout(() => {
            processCompleteOrder(updatedPartial)
          }, 1000)
          
          setConversationState(null)
          setPartialOrder(null)
          return true
        }
        // Se encontrou quantidade de ações
        else if (quantityMatch) {
          const quantity = parseInt(quantityMatch[1])
          const updatedPartial = { ...partial, quantity, amountType: 'shares' }
          
          addYzzyMessage(`📊 **Perfeito! ${quantity} ações da ${partial.asset}**\n\nAgora vou preparar sua ordem...`)
          
          setTimeout(() => {
            processCompleteOrder(updatedPartial)
          }, 1000)
          
          setConversationState(null)
          setPartialOrder(null)
          return true
        }
        else {
          addYzzyMessage(`❓ **Não entendi o valor!**\n\nPor favor, diga:\n• **"R$ 1.000"** (valor em dinheiro)\n• **"100 ações"** (quantidade específica)\n• **"mil reais"** (por extenso)`)
          return true
        }
        
      case 'waiting_asset':
        const assetInfo = getAssetData(input)
        if (assetInfo) {
          const updatedPartial = { ...partial, asset: assetInfo.codigo }
          // Se já tem valor ou quantidade, processa direto
          if (updatedPartial.amount || updatedPartial.quantity) {
            addYzzyMessage(`📊 **Ativo encontrado: ${assetInfo.codigo} - ${assetInfo.nome}**\n\nProcessando sua ordem...`)
            setTimeout(() => {
              processCompleteOrder(updatedPartial)
            }, 800)
            setConversationState(null)
            setPartialOrder(null)
            return true
          } else {
            addYzzyMessage(`📊 **Ativo encontrado: ${assetInfo.codigo} - ${assetInfo.nome}**\n\nAgora, quanto você quer ${partial.operation === 'BUY' ? 'investir' : 'vender'}?`)
            setConversationState('waiting_amount')
            setPartialOrder(updatedPartial)
            return true
          }
        } else {
          addYzzyMessage(`❌ **Ativo "${input}" não encontrado!**\n\nConsulte exemplos como PETR4, VALE3, ITUB4, MGLU3, BBDC4...`)
          return true
        }
        
      case 'waiting_price':
        const priceMatch = input.match(/(?:r\$\s*)?(\d+(?:,\d{2})?)/i)
        if (priceMatch) {
          const price = parseFloat(priceMatch[1].replace(',', '.'))
          const updatedPartial = { ...partial, price }
          
          addYzzyMessage(`💲 **Preço definido: R$ ${price.toFixed(2)}**\n\nProcessando ordem limitada...`)
          
          setTimeout(() => {
            processCompleteOrder(updatedPartial)
          }, 1000)
          
          setConversationState(null)
          setPartialOrder(null)
          return true
        } else {
          addYzzyMessage(`❓ **Preciso do preço!**\n\nDiga o preço como:\n• **"28,50"**\n• **"R$ 28,50"**\n• **"28 reais e 50"**`)
          return true
        }
        
      default:
        return false
    }
  }

  // Função para processar ordem completa (após follow-ups)
  const processCompleteOrder = (orderData) => {
    console.log('🎯 PROCESSANDO ORDEM COMPLETA:', orderData)
    // Garante que ativo está definido
    const ativo = getAssetData(orderData.asset)
    if (!ativo) {
      addYzzyMessage(`❌ **Ativo ${orderData.asset} não encontrado!**`)
      return
    }
    setSelectedAsset(ativo)
    let finalQuantidade, finalValorTotal
    if (orderData.amountType === 'shares') {
      finalQuantidade = orderData.quantity
      // Aqui você pode buscar preço real do ativo se desejar
      finalValorTotal = orderData.quantity * 1 // Substitua 1 pelo preço real se necessário
    } else {
      finalValorTotal = orderData.amount
      finalQuantidade = Math.floor(orderData.amount / 1) // Substitua 1 pelo preço real se necessário
    }
    if (finalValorTotal > userBalance) {
      addYzzyMessage(`❌ **Saldo insuficiente!**`)
      return
    }
    
    if (finalQuantidade === 0) {
      addYzzyMessage(`❌ **Valor muito baixo!**\n\nO valor informado não é suficiente para comprar nem 1 ação da ${ativo.nome}.\n\n💰 **Preço unitário:** R$ ${ativo.preco.toFixed(2)}`)
      return
    }
    
    const ordem = {
      ativo: ativo,
      quantidade: finalQuantidade,
      valorUnitario: ativo.preco,
      valorTotal: finalValorTotal,
      orderType: orderData.orderType || 'MARKET',
      price: orderData.price || ativo.preco,
      originalCommand: orderData.originalCommand || 'Comando por partes'
    }
    
    setPendingOrder(ordem)
    setAwaitingConfirmation(true)
    pendingOrderRef.current = ordem
    awaitingConfirmationRef.current = true
    
    const orderTypeText = ordem.orderType === 'LIMIT' ? 'limitada' : 'a mercado'
    
    addYzzyMessage(
      `✅ **Ordem de ${orderData.operation === 'BUY' ? 'compra' : 'venda'} ${orderTypeText} preparada!**\n\n📊 **${ativo.codigo} - ${ativo.nome}**\n💰 **Preço:** R$ ${ativo.preco.toFixed(2)} por ação\n📈 **Quantidade:** ${finalQuantidade} ações\n💸 **Total:** R$ ${finalValorTotal.toLocaleString('pt-BR', {minimumFractionDigits: 2})}\n\n💰 **Saldo atual:** R$ ${userBalance.toLocaleString('pt-BR', {minimumFractionDigits: 2})}\n💰 **Saldo após compra:** R$ ${(userBalance - finalValorTotal).toLocaleString('pt-BR', {minimumFractionDigits: 2})}\n\n**Posso executar esta ordem?**`,
      [
        { text: "✅ Sim, executar", action: "confirmar" },
        { text: "❌ Cancelar", action: "cancelar" }
      ]
    )
  }

  // Verificar permissão do microfone
  const checkMicrophonePermission = async () => {
    try {
      if (navigator.permissions) {
        const permission = await navigator.permissions.query({ name: 'microphone' })
        setMicPermission(permission.state)
        
        permission.onchange = () => {
          setMicPermission(permission.state)
        }
      }
    } catch (error) {
      console.log('Permissions API não suportada:', error)
    }
  }

  // Solicitar permissão do microfone
  const requestMicrophonePermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      stream.getTracks().forEach(track => track.stop())
      setMicPermission('granted')
      addToast('🎤 Permissão concedida! Agora você pode usar comandos de voz.', 'success')
      return true
    } catch (error) {
      console.error('Erro ao solicitar permissão:', error)
      setMicPermission('denied')
      addToast('❌ Permissão negada. Clique no ícone 🔒 na barra de endereços para permitir o microfone.', 'error')
      return false
    }
  }

  // Scroll automático para o final das mensagens
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Inicializar conversa quando abrir
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setTimeout(() => {
        addYzzyMessage("👋 Olá! Sou a **YZZY**, sua assistente de investimentos!\n\n💰 **Seu saldo:** R$ " + userBalance.toLocaleString('pt-BR', {minimumFractionDigits: 2}) + "\n\n🧠 **Agora sou mais inteligente!** Entendo comandos como:\n• \"Compre R$ 1.000 de ações da Petrobras\"\n• \"Stop loss na VALE3 em R$ 60\"\n• \"Ordem móvel no Itaú com 5% de distância\"\n• \"Venda 100 MGLU3 a mercado\"\n\n⌨️ **Atalhos:**\n• **Ctrl+K** - Ativar/desativar microfone 🎤\n• **Enter** - Enviar mensagem\n• **Esc** - Fechar")
      }, 500)
    }
  }, [isOpen])

  // Auto-focus no input
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
    }
  }, [isOpen])

  // Monitorar mudanças no estado de confirmação
  useEffect(() => {
    console.log('🔄 ESTADO MUDOU - awaitingConfirmation:', awaitingConfirmation)
    console.log('🔄 ESTADO MUDOU - pendingOrder:', pendingOrder ? 'EXISTE' : 'NULL')
  }, [awaitingConfirmation, pendingOrder])

  // Configurar reconhecimento de voz
  useEffect(() => {
    checkMicrophonePermission()
    
    if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      const recognitionInstance = new SpeechRecognition()
      
      recognitionInstance.continuous = false
      recognitionInstance.interimResults = false
      recognitionInstance.lang = 'pt-BR'
      recognitionInstance.maxAlternatives = 1

      recognitionInstance.onstart = () => {
        setIsListening(true)
        console.log('Reconhecimento de voz iniciado')
      }

      recognitionInstance.onresult = (event) => {
        const transcript = event.results[0][0].transcript
        console.log('🎤 VOZ RECONHECIDA:', transcript)
        console.log('🎤 CONFIANÇA:', event.results[0][0].confidence)
        
        setCurrentInput(transcript)
        setIsListening(false)
        
        addUserMessage(`🎤 ${transcript}`)
        
        setTimeout(() => {
          processVoiceCommand(transcript)
        }, 100)
      }

      recognitionInstance.onerror = (event) => {
        console.error('Erro no reconhecimento de voz:', event.error)
        setIsListening(false)
        
        if (event.error === 'not-allowed') {
          setMicPermission('denied')
          addToast('❌ Permissão negada. Clique no ícone 🔒 na barra de endereços para permitir o microfone.', 'error')
        } else if (event.error === 'no-speech') {
          addToast('🔇 Nenhuma fala detectada. Tente falar mais alto.', 'warning')
        } else if (event.error === 'audio-capture') {
          addToast('🎤 Erro no microfone. Verifique se está conectado.', 'error')
        } else if (event.error === 'network') {
          addToast('🌐 Erro de rede. Verifique sua conexão.', 'error')
        } else {
          addToast(`❌ Erro: ${event.error}`, 'error')
        }
      }

      recognitionInstance.onend = () => {
        setIsListening(false)
      }

      setRecognition(recognitionInstance)
      setSpeechSupported(true)
    } else {
      setSpeechSupported(false)
    }
  }, [])

  // Função para adicionar mensagem da YZZY
  const addYzzyMessage = (content, buttons = []) => {
    setIsTyping(true)
    
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: Date.now(),
        sender: "yzzy",
        content: content,
        buttons: buttons,
        timestamp: new Date()
      }])
      
      setIsTyping(false)
    }, 800)
  }

  // Função para adicionar mensagem do usuário
  const addUserMessage = (text) => {
    setMessages(prev => [...prev, {
      id: Date.now(),
      sender: "user",
      content: text,
      timestamp: new Date()
    }])
  }

  // Função para processar comando de voz
  const processVoiceCommand = (transcript) => {
    console.log('🎯 PROCESSANDO COMANDO DE VOZ:', transcript)
    
    const ordemAtual = pendingOrderRef.current
    const aguardandoConfirmacao = awaitingConfirmationRef.current
    
    if (ordemAtual && aguardandoConfirmacao) {
      console.log('🎯 TEM ORDEM PENDENTE NA REF! VERIFICANDO CONFIRMAÇÃO...')
      
      const transcriptLower = transcript.toLowerCase().trim()
      
      const palavrasConfirmacao = ['sim', 'si', 'confirmar', 'executar', 'execute', 'confirme', 's', 'ok', 'okay', 'certo', 'correto', 'vai', 'vamos', 'pode', 'fazer']
      const palavrasCancelamento = ['não', 'nao', 'cancelar', 'cancele', 'para', 'parar', 'n', 'nunca', 'jamais']
      
      const temConfirmacao = palavrasConfirmacao.some(palavra => transcriptLower.includes(palavra))
      const temCancelamento = palavrasCancelamento.some(palavra => transcriptLower.includes(palavra))
      
      if (temConfirmacao && !temCancelamento) {
        console.log('✅ CONFIRMAÇÃO DETECTADA! EXECUTANDO IMEDIATAMENTE!')
        addYzzyMessage(`🎤 **"${transcript}" - EXECUTANDO AGORA!**`)
        
        const ordemParaExecutar = ordemAtual
        
        setPendingOrder(null)
        setAwaitingConfirmation(false)
        pendingOrderRef.current = null
        awaitingConfirmationRef.current = false
        
        const novoSaldo = userBalance - ordemParaExecutar.valorTotal
        setUserBalance(novoSaldo)
        
        setTimeout(() => {
          addYzzyMessage(
            `🎉 **ORDEM EXECUTADA COM SUCESSO!**\n\n✅ **Comprou:** ${ordemParaExecutar.quantidade} ações da ${ordemParaExecutar.ativo.nome}\n💰 **Valor:** R$ ${ordemParaExecutar.valorTotal.toLocaleString('pt-BR', {minimumFractionDigits: 2})}\n💰 **Novo saldo:** R$ ${novoSaldo.toLocaleString('pt-BR', {minimumFractionDigits: 2})}\n\n🎤 **Pressione Ctrl+K para nova compra!**`
          )
          addToast(`✅ Executado: ${ordemParaExecutar.quantidade} ${ordemParaExecutar.ativo.codigo}`, "success")
        }, 500)
        
        return
      } 
      else if (temCancelamento) {
        console.log('❌ CANCELAMENTO DETECTADO!')
        addYzzyMessage(`🎤 **"${transcript}" - CANCELANDO...**`)
        
        setPendingOrder(null)
        setAwaitingConfirmation(false)
        pendingOrderRef.current = null
        awaitingConfirmationRef.current = false
        return
      } 
      else {
        console.log('❓ COMANDO NÃO RECONHECIDO PARA CONFIRMAÇÃO')
        addYzzyMessage(`🎤 **Ouvi:** "${transcript}"\n\n❓ **Não entendi!** Tente falar:\n• **"SIM"** - bem claro\n• **"EXECUTAR"**\n• **"CONFIRMAR"**`)
        return
      }
    }
    
    // Se chegou aqui, não é confirmação - verificar se é follow-up de conversação  
    if (conversationState && partialOrder) {
      console.log('🔄 VOZ: PROCESSANDO FOLLOW-UP DA CONVERSAÇÃO')
      const wasProcessed = processFollowUp(transcript, conversationState, partialOrder)
      if (wasProcessed) return
    }
    
    // Processar como comando normal
    console.log('🎯 PROCESSANDO COMO COMANDO DE COMPRA')
    const isComandoCompra = processarComandoCompra(transcript)
    
    if (!isComandoCompra) {
      setTimeout(() => {
        addYzzyMessage(`🎤 **Comando:** "${transcript}"\n\nDiga comandos como:\n• "Compre mil reais da Petrobras"\n• "Quero investir quinhentos na Vale"\n\n💰 **Saldo:** R$ ${userBalance.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`)
      }, 800)
    }
  }

  // Função para iniciar comando de voz
  const toggleVoiceRecognition = async () => {
    if (!speechSupported) {
      addToast('❌ Reconhecimento de voz não suportado neste navegador.', 'error')
      return
    }

    if (micPermission === 'denied') {
      addToast('❌ Permissão negada. Recarregue a página e permita o acesso ao microfone.', 'error')
      return
    }

    if (micPermission === 'prompt') {
      const granted = await requestMicrophonePermission()
      if (!granted) return
    }

    if (!recognition) {
      addToast('❌ Erro ao inicializar reconhecimento de voz.', 'error')
      return
    }

    if (isListening) {
      recognition.stop()
    } else {
      try {
        recognition.start()
        addToast('🎤 Fale agora! Diga seu comando...', 'info')
      } catch (error) {
        console.error('Erro:', error)
        addToast('❌ Erro ao iniciar reconhecimento.', 'error')
      }
    }
  }

  // Função para processar comando de compra - NOVA VERSÃO COM FOLLOW-UP
  const processarComandoCompra = (input) => {
    console.log('🎯 PROCESSANDO COM YZZY BRAIN:', input)
    
    // Primeiro, tentar reconhecer valores por extenso no input original
    const valorPorExtenso = reconhecerValorPorExtenso(input.toLowerCase())
    console.log('🔢 VALOR POR EXTENSO DETECTADO:', valorPorExtenso)
    
    // Se só tem um valor (como "R$ 100"), assumir que precisa de mais informações
    const temAtivo = input.toLowerCase().includes('petrobras') || 
                     input.toLowerCase().includes('vale') || 
                     input.toLowerCase().includes('itau') || 
                     input.toLowerCase().includes('magazine') || 
                     input.toLowerCase().includes('bradesco') || 
                     input.toLowerCase().includes('petr4') || 
                     input.toLowerCase().includes('vale3') || 
                     input.toLowerCase().includes('itub4') || 
                     input.toLowerCase().includes('mglu3') || 
                     input.toLowerCase().includes('bbdc4')
    
    if (valorPorExtenso > 0 && !temAtivo) {
      addYzzyMessage(`💰 **Entendi que você quer investir R$ ${valorPorExtenso.toLocaleString('pt-BR', {minimumFractionDigits: 2})}!**\n\n📊 **Em qual ativo você quer investir?**\n\nExemplos:\n• **PETR4** (Petrobras)\n• **VALE3** (Vale)\n• **ITUB4** (Itaú)\n• **MGLU3** (Magazine Luiza)\n• **BBDC4** (Bradesco)`)
      
      setConversationState('waiting_asset')
      setPartialOrder({ 
        operation: 'BUY', 
        amount: valorPorExtenso,
        amountType: 'money',
        originalCommand: input 
      })
      return true
    }
    
    // Usar o brain para processar o comando (com proteção contra erro)
    let parsedCommand
    try {
      console.log('🧠 CHAMANDO BRAIN COM:', input)
      parsedCommand = processCommand(input)
      console.log('🧠 Comando parseado pelo BRAIN:', parsedCommand)
    } catch (error) {
      console.error('❌ Erro no YZZY Brain:', error)
      // Se houve erro no brain, mas temos valor por extenso, processar manualmente
      if (valorPorExtenso > 0) {
        parsedCommand = {
          operation: 'BUY',
          orderType: 'MARKET',
          asset: null,
          amount: valorPorExtenso,
          quantity: null,
          price: null,
          confidence: 0.8,
          errors: [],
          suggestions: []
        }
        console.log('🔧 Comando criado manualmente:', parsedCommand)
      } else {
        addYzzyMessage(`❓ **Não consegui processar seu comando!**\n\nTente comandos mais claros como:\n• **"Compre R$ 1.000 da Petrobras"**\n• **"Quero 100 ações da Vale"**`)
        return true
      }
    }
    
    // Se encontrou valor por extenso e o brain não detectou valor, adicionar
    if (valorPorExtenso > 0 && !parsedCommand.amount && !parsedCommand.quantity) {
      parsedCommand.amount = valorPorExtenso
      parsedCommand.confidence = Math.max(parsedCommand.confidence, 0.7)
      console.log('🔢 VALOR POR EXTENSO ADICIONADO AO BRAIN:', valorPorExtenso)
    }
    
    // Verificar se o comando tem informações suficientes
    let { operation, asset, amount, quantity, orderType, confidence, errors, suggestions } = parsedCommand;

    // NOVO: Sempre resolver asset via getAssetData se houver asset
    let ativo = null;
    if (asset) {
      ativo = getAssetData(asset);
      if (ativo) {
        asset = ativo.codigo; // Garante que asset seja sempre o código reconhecido
      } else {
        // Se não encontrou, já retorna erro
        addYzzyMessage(`❌ **Ativo ${asset} não encontrado!**\n\n📋 **Ativos disponíveis:**\n• **PETR4** (Petrobras)\n• **VALE3** (Vale)\n• **ITUB4** (Itaú)\n• **MGLU3** (Magazine Luiza)\n• **BBDC4** (Bradesco)`);
        return true;
      }
    }
    // NOVO: Se ainda não encontrou ativo, tenta extrair trecho do ativo do texto
    if (!ativo) {
      // Importa o dicionário de ativos do brain
      const { tradingDictionary } = require('./yzzybrain');
      const textoLower = input.toLowerCase();
      let encontrado = null;
      for (const [codigo, apelidos] of Object.entries(tradingDictionary.assets)) {
        // Testa o código
        if (textoLower.includes(codigo.toLowerCase())) {
          encontrado = getAssetData(codigo);
          break;
        }
        // Testa cada apelido
        for (const ap of apelidos) {
          if (textoLower.includes(ap.toLowerCase())) {
            encontrado = getAssetData(ap);
            break;
          }
        }
        if (encontrado) break;
      }
      if (encontrado) {
        ativo = encontrado;
        asset = encontrado.codigo;
        parsedCommand.asset = encontrado.codigo;
        console.log('📈 Ativo detectado via varredura de apelidos:', encontrado.codigo);
      }
    }

    // Se confiança muito baixa, mostrar erros e sugestões do brain
    if (confidence < 0.3) {
      let errorMessage = `❓ **Comando não entendido claramente!**\n\n`;
      if (errors && errors.length > 0) {
        errorMessage += `**Problemas encontrados:**\n${errors.map(e => `• ${e}`).join('\n')}\n\n`;
      }
      if (suggestions && suggestions.length > 0) {
        errorMessage += `**Sugestões:**\n${suggestions.map(s => `• ${s}`).join('\n')}`;
      } else {
        errorMessage += `**Tente ser mais específico:**\n• **"Compre R$ 1.000 da Petrobras"**\n• **"Venda 50 ações da Vale"**`;
      }
      addYzzyMessage(errorMessage);
      return true;
    }

    // Verificar se temos operação e ativo (mínimo necessário)
    if (!operation && !asset) {
      addYzzyMessage(`❓ **Não entendi seu comando!**\n\nTente comandos como:\n• **"Compre PETR4"**\n• **"Venda VALE3"**\n• **"Stop loss na ITUB4"**`);
      return true;
    }

    // Se só tem ativo mas não tem operação, assumir compra
    let finalOperation = operation;
    if (!operation && asset) {
      finalOperation = 'BUY';
      console.log('🎯 Assumindo operação de COMPRA para ativo:', asset);
    }

    // Se não tem ativo, perguntar qual
    if (!asset && finalOperation) {
      const operationText = finalOperation === 'BUY' ? 'comprar' : 'vender';
      addYzzyMessage(`💼 **${finalOperation === 'BUY' ? 'Compra' : 'Venda'} entendida!**\n\n📊 **Qual ativo você quer ${operationText}?**\n\nExemplos:\n• **PETR4** (Petrobras)\n• **VALE3** (Vale)\n• **ITUB4** (Itaú)\n• **MGLU3** (Magazine Luiza)`)
      
      setConversationState('waiting_asset')
      setPartialOrder({ 
        operation: finalOperation, 
        amount: amount,
        quantity: quantity,
        orderType: orderType || 'MARKET',
        originalCommand: input 
      })
      return true
    }
    
    // Se não tem valor nem quantidade, perguntar
    if (!amount && !quantity) {
      const operationText = finalOperation === 'BUY' ? 'investir' : 'vender';
      addYzzyMessage(`💰 **${finalOperation === 'BUY' ? 'Compra' : 'Venda'} de ${asset} entendida!**\n\n❓ **Quanto você quer ${operationText}?**\n\nVocê pode responder:\n• **"R$ 1.000"** (valor em dinheiro)\n• **"100 ações"** (quantidade específica)\n• **"mil reais"** (por extenso)\n\n💰 **Preço atual:** R$ ${ativo.preco.toFixed(2)} por ação`)
      
      setConversationState('waiting_amount')
      setPartialOrder({ 
        operation: finalOperation, 
        asset: asset, 
        orderType: orderType || 'MARKET',
        originalCommand: input 
      })
      return true
    }
    
    // Se tem tudo, processar normalmente
    console.log('🎯 Comando completo, processando...')
    
    setSelectedAsset(ativo)
    
    // Calcular quantidade e valor
    let finalQuantidade, finalValorTotal
    
    if (quantity) {
      finalQuantidade = quantity
      finalValorTotal = quantity * ativo.preco
    } else if (amount) {
      finalValorTotal = amount
      finalQuantidade = Math.floor(amount / ativo.preco)
    }
    
    // Verificar saldo
    if (finalValorTotal > userBalance) {
      addYzzyMessage(`❌ **Saldo insuficiente!**\n\n💰 **Seu saldo:** R$ ${userBalance.toLocaleString('pt-BR', {minimumFractionDigits: 2})}\n💸 **Valor necessário:** R$ ${finalValorTotal.toLocaleString('pt-BR', {minimumFractionDigits: 2})}\n\n🔍 **Sugestão:** Com seu saldo atual, você pode comprar ${Math.floor(userBalance / ativo.preco)} ações da ${ativo.nome}.`)
      return true
    }
    
    if (finalQuantidade === 0) {
      addYzzyMessage(`❌ **Valor muito baixo!**\n\nO valor informado não é suficiente para comprar nem 1 ação da ${ativo.nome}.\n\n💰 **Preço unitário:** R$ ${ativo.preco.toFixed(2)}`)
      return true
    }
    
    // Criar ordem com dados do brain
    const ordem = {
      ativo: ativo,
      quantidade: finalQuantidade,
      valorUnitario: ativo.preco,
      valorTotal: finalValorTotal,
      orderType: orderType || 'MARKET',
      price: parsedCommand.price || ativo.preco,
      originalCommand: input,
      parsedData: parsedCommand
    }
    
    console.log('💼 CRIANDO ORDEM COM BRAIN:', ordem)
    
    // Definir estados
    setPendingOrder(ordem)
    setAwaitingConfirmation(true)
    pendingOrderRef.current = ordem
    awaitingConfirmationRef.current = true
    
    // Gerar resposta usando o brain (com proteção contra erro)
    let confirmationMessage
    try {
      const response = generateResponse(parsedCommand)
      if (response.success) {
        confirmationMessage = response.message
      } else {
        throw new Error('Brain response failed')
      }
    } catch (error) {
      console.error('❌ Erro ao gerar resposta:', error)
      const operationText = finalOperation === 'BUY' ? 'compra' : 'venda'
      const orderTypeText = (orderType === 'LIMIT') ? 'limitada' : 'a mercado'
      confirmationMessage = `✅ **Ordem de ${operationText} ${orderTypeText} preparada!**\n\n📊 **${ativo.codigo} - ${ativo.nome}**\n💰 **Preço:** R$ ${ativo.preco.toFixed(2)} por ação\n📈 **Quantidade:** ${finalQuantidade} ações\n💸 **Total:** R$ ${finalValorTotal.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`
    }
    
    // Adicionar informações de saldo
    confirmationMessage += `\n\n💰 **Saldo atual:** R$ ${userBalance.toLocaleString('pt-BR', {minimumFractionDigits: 2})}\n💰 **Saldo após operação:** R$ ${(userBalance - finalValorTotal).toLocaleString('pt-BR', {minimumFractionDigits: 2})}\n\n🎤 **Diga "SIM" para executar!**`
    
    addYzzyMessage(
      confirmationMessage,
      [
        { text: "✅ Sim, executar", action: "confirmar" },
        { text: "❌ Cancelar", action: "cancelar" }
      ]
    )
    
    return true
  }
    

  // Função para encontrar ativo - MELHORADA para usar códigos do brain
  // Removido o objeto availableAssets e a função encontrarAtivo. Agora, utilize funções utilitárias do yzzybrain para buscar ativos.
  // const encontrarAtivo = (codigo) => {
  //   if (!codigo) return null
    
  //   // Tentar buscar direto pelo código
  //   if (availableAssets[codigo]) {
  //     return availableAssets[codigo]
  //   }
    
  //   // Buscar pelo código normalizado
  //   const codigoNormalizado = codigo.toLowerCase().trim()
    
  //   // Busca exata no objeto de ativos
  //   for (let key in availableAssets) {
  //     const ativo = availableAssets[key]
  //     if (ativo.codigo.toLowerCase() === codigoNormalizado) {
  //       return ativo
  //     }
  //   }
    
  //   // Busca por nome/apelido (compatibilidade com brain)
  //   for (let key in availableAssets) {
  //     if (key === codigoNormalizado) {
  //       return availableAssets[key]
  //     }
  //   }
    
  //   // Busca parcial para flexibilidade
  //   for (let key in availableAssets) {
  //     const ativo = availableAssets[key]
  //     if (ativo.nome.toLowerCase().includes(codigoNormalizado) || 
  //         key.includes(codigoNormalizado)) {
  //       return ativo
  //     }
  //   }
    
  //   // Se não encontrou, retorna null
  //   return null
  // }

  // Função para executar ordem
  const executarOrdem = () => {
    console.log('🚀 EXECUTANDO ORDEM!')
    console.log('🚀 ORDEM PENDENTE:', pendingOrder)
    
    if (!pendingOrder) {
      console.log('❌ NENHUMA ORDEM PENDENTE!')
      addYzzyMessage("❌ **Erro:** Nenhuma ordem pendente para executar.")
      return
    }

    const novoSaldo = userBalance - pendingOrder.valorTotal
    console.log('🚀 SALDO ANTERIOR:', userBalance)
    console.log('🚀 VALOR DA ORDEM:', pendingOrder.valorTotal)
    console.log('🚀 NOVO SALDO:', novoSaldo)

    // Atualizar saldo
    setUserBalance(novoSaldo)
    
    addYzzyMessage(
      `🎉 **ORDEM EXECUTADA COM SUCESSO!**\n\n✅ **Comprou:** ${pendingOrder.quantidade} ações da ${pendingOrder.ativo.nome}\n💰 **Valor investido:** R$ ${pendingOrder.valorTotal.toLocaleString('pt-BR', {minimumFractionDigits: 2})}\n💰 **Novo saldo:** R$ ${novoSaldo.toLocaleString('pt-BR', {minimumFractionDigits: 2})}\n\n📋 **A ordem foi enviada para execução no mercado!**\n\n🎤 **Dica:** Pressione Ctrl+K para fazer outra compra por voz!`
    )

    // Toast de sucesso
    addToast(`✅ Compra executada: ${pendingOrder.quantidade} ${pendingOrder.ativo.codigo} por R$ ${pendingOrder.valorTotal.toFixed(2)}`, "success")

    // Resetar estados
    console.log('🚀 RESETANDO ESTADOS...')
    setPendingOrder(null)
    setAwaitingConfirmation(false)
    pendingOrderRef.current = null
    awaitingConfirmationRef.current = false
    
    console.log('🚀 EXECUÇÃO CONCLUÍDA!')
  }

  // Função para cancelar ordem
  const cancelarOrdem = () => {
    addYzzyMessage("❌ **Ordem cancelada!**\n\nNenhuma operação foi realizada. Seu saldo permanece inalterado.\n\nPosso ajudar com outra operação?")
    
    setPendingOrder(null)
    setAwaitingConfirmation(false)
    pendingOrderRef.current = null
    awaitingConfirmationRef.current = false
  }

  // Função para lidar com clique nos botões
  const handleButtonClick = (action) => {
    switch (action) {
      case "confirmar":
        executarOrdem()
        break
      case "cancelar":
        cancelarOrdem()
        break
    }
  }

  // Função para enviar mensagem - ATUALIZADA para usar mesma lógica da voz
  const handleSendMessage = () => {
    if (!currentInput.trim()) return

    addUserMessage(currentInput)
    
    // USA A MESMA LÓGICA DA VOZ para processar TEXTO!
    const ordemAtual = pendingOrderRef.current
    const aguardandoConfirmacao = awaitingConfirmationRef.current
    
    console.log('📝 PROCESSANDO TEXTO:', currentInput)
    console.log('📝 ORDEM PENDENTE (ref):', ordemAtual ? 'SIM' : 'NÃO')
    console.log('📝 AGUARDANDO CONFIRMAÇÃO (ref):', aguardandoConfirmacao)
    
    if (ordemAtual && aguardandoConfirmacao) {
      console.log('📝 TEM ORDEM PENDENTE! VERIFICANDO CONFIRMAÇÃO...')
      
      const inputLower = currentInput.toLowerCase().trim()
      console.log('📝 INPUT NORMALIZADO:', `"${inputLower}"`)
      
      // Lista expandida de palavras de confirmação (MESMA DA VOZ)
      const palavrasConfirmacao = ['sim', 'si', 'confirmar', 'executar', 'execute', 'confirme', 's', 'ok', 'okay', 'certo', 'correto', 'vai', 'vamos', 'pode', 'fazer']
      const palavrasCancelamento = ['não', 'nao', 'cancelar', 'cancele', 'para', 'parar', 'n', 'nunca', 'jamais']
      
      // Verificar se alguma palavra de confirmação está presente
      const temConfirmacao = palavrasConfirmacao.some(palavra => inputLower.includes(palavra))
      const temCancelamento = palavrasCancelamento.some(palavra => inputLower.includes(palavra))
      
      console.log('📝 CONTÉM CONFIRMAÇÃO:', temConfirmacao)
      console.log('📝 CONTÉM CANCELAMENTO:', temCancelamento)
      
      if (temConfirmacao && !temCancelamento) {
        console.log('✅ CONFIRMAÇÃO POR TEXTO DETECTADA! EXECUTANDO!')
        addYzzyMessage(`📝 **"${currentInput}" - EXECUTANDO AGORA!**`)
        
        // EXECUTA com a ordem da REF (MESMA LÓGICA DA VOZ)
        const ordemParaExecutar = ordemAtual
        
        // Limpar TUDO
        setPendingOrder(null)
        setAwaitingConfirmation(false)
        pendingOrderRef.current = null
        awaitingConfirmationRef.current = false
        
        // Calcular novo saldo
        const novoSaldo = userBalance - ordemParaExecutar.valorTotal
        setUserBalance(novoSaldo)
        
        // Mensagem de sucesso
        setTimeout(() => {
          addYzzyMessage(
            `🎉 **ORDEM EXECUTADA COM SUCESSO!**\n\n✅ **Comprou:** ${ordemParaExecutar.quantidade} ações da ${ordemParaExecutar.ativo.nome}\n💰 **Valor:** R$ ${ordemParaExecutar.valorTotal.toLocaleString('pt-BR', {minimumFractionDigits: 2})}\n💰 **Novo saldo:** R$ ${novoSaldo.toLocaleString('pt-BR', {minimumFractionDigits: 2})}\n\n📝 **Digite outro comando ou use Ctrl+K para voz!**`
          )
          addToast(`✅ Executado: ${ordemParaExecutar.quantidade} ${ordemParaExecutar.ativo.codigo}`, "success")
        }, 500)
        
        setCurrentInput("")
        return
      } 
      else if (temCancelamento) {
        console.log('❌ CANCELAMENTO POR TEXTO DETECTADO!')
        addYzzyMessage(`📝 **"${currentInput}" - CANCELANDO...**`)
        
        // Limpar TUDO
        setPendingOrder(null)
        setAwaitingConfirmation(false)
        pendingOrderRef.current = null
        awaitingConfirmationRef.current = false
        
        setCurrentInput("")
        return
      } 
      else {
        console.log('❓ COMANDO DE TEXTO NÃO RECONHECIDO PARA CONFIRMAÇÃO')
        addYzzyMessage(`📝 **Recebi:** "${currentInput}"\n\n❓ **Não entendi!** Digite:\n• **"sim"** para confirmar\n• **"executar"** para confirmar\n• **"não"** para cancelar`)
        setCurrentInput("")
        return
      }
    }
    
    // Se chegou aqui, não é confirmação - verificar se é follow-up de conversação
    if (conversationState && partialOrder) {
      console.log('🔄 PROCESSANDO FOLLOW-UP DA CONVERSAÇÃO')
      const wasProcessed = processFollowUp(currentInput, conversationState, partialOrder)
      if (wasProcessed) {
        setCurrentInput("")
        return
      }
    }
    
    // Processar como comando normal
    console.log('📝 PROCESSANDO COMO COMANDO DE COMPRA/OPERAÇÃO')
    const isComandoCompra = processarComandoCompra(currentInput)
    
    if (!isComandoCompra) {
      setTimeout(() => {
        addYzzyMessage(`🤖 **Entendi!** Você disse: "${currentInput}"\n\nPara operar, use comandos como:\n• "Compre R$ 1.000 de ações da Petrobras"\n• "Stop loss na VALE3 em R$ 60"\n• "Ordem móvel no Itaú com 5%"\n\n💰 **Seu saldo:** R$ ${userBalance.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`)
      }, 800)
    }
    
    setCurrentInput("")
  }

  // Lidar com Enter
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  // Fechar com ESC e adicionar Ctrl+K para microfone
  useEffect(() => {
    const handleKeyDown = (event) => {
      // ESC para fechar
      if (event.key === "Escape") {
        onClose()
      }
      
      // Ctrl+K para ativar/desativar microfone
      if (event.ctrlKey && event.key === "k") {
        event.preventDefault()
        console.log('Atalho Ctrl+K pressionado')
        toggleVoiceRecognition()
      }
    }

    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown)
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [isOpen, onClose, speechSupported, recognition, isListening, micPermission])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[9999]" onClick={onClose}>
      <div
        className="bg-[#1a1a1a] rounded-lg w-[900px] h-[600px] shadow-xl border border-[#404040] relative z-[10000] mx-auto mt-12"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#F7941E] to-[#FF6B35] px-4 py-3 border-b border-[#404040] rounded-t-lg">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <span className="text-[#F7941E] font-bold text-sm">Y</span>
              </div>
              <div>
                <h2 className="text-white font-bold text-lg">YZZY - Agente de Compras</h2>
                <p className="text-orange-100 text-xs">
                  Compre ativos falando ou digitando! 
                  {speechSupported && <span className="ml-1">🎤</span>}
                </p>
              </div>
            </div>
            <button 
              className="p-1 hover:bg-white/20 rounded transition-colors" 
              onClick={onClose} 
              title="Fechar"
            >
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
                className="text-white"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>

        {/* Layout Principal */}
        <div className="flex h-[calc(100%-76px)]">
          {/* Área de Chat (60%) */}
          <div className="w-3/5 flex flex-col">
            {/* Mensagens */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* Estado para aguardar confirmação */}
              {awaitingConfirmation && (
                <div className="bg-yellow-900/30 border border-yellow-500 rounded-lg p-3 mb-4">
                  <div className="text-yellow-300 font-semibold text-sm mb-1">⏳ Aguardando Confirmação</div>
                  <div className="text-yellow-100 text-xs">
                    Digite "sim" para confirmar ou "não" para cancelar a operação
                  </div>
                </div>
              )}

              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] ${message.sender === "user" ? "bg-[#F7941E] text-white" : "bg-[#2a2a2a] text-white"} rounded-lg p-3`}>
                    <div className="whitespace-pre-line text-sm">
                      {message.content.split('**').map((part, index) => 
                        index % 2 === 1 ? <strong key={index}>{part}</strong> : part
                      )}
                    </div>
                    
                    {/* Botões de Ação */}
                    {message.buttons && message.buttons.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {message.buttons.map((button, index) => (
                          <button
                            key={index}
                            onClick={() => handleButtonClick(button.action)}
                            className={`${
                              button.action === "confirmar" 
                                ? "bg-green-600 hover:bg-green-700" 
                                : "bg-red-600 hover:bg-red-700"
                            } text-white px-3 py-1 rounded-full text-xs transition-colors`}
                          >
                            {button.text}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              {/* Indicador de digitação */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-[#2a2a2a] text-white rounded-lg p-3">
                    <div className="flex items-center gap-1">
                      <span className="text-sm">YZZY está digitando</span>
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-[#F7941E] rounded-full animate-pulse"></div>
                        <div className="w-2 h-2 bg-[#F7941E] rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                        <div className="w-2 h-2 bg-[#F7941E] rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input de Mensagem */}
            <div className="p-4 border-t border-[#404040]">
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={currentInput}
                  onChange={(e) => setCurrentInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={awaitingConfirmation ? "Digite 'sim' para confirmar ou 'não' para cancelar..." : "Digite 'Compre R$ 1.000 de ações da Petrobras'..."}
                  className="flex-1 bg-[#2a2a2a] border border-[#404040] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-1 focus:ring-[#F7941E] placeholder:text-[#666]"
                />
                
                {/* Botão de Comando de Voz */}
                {speechSupported && (
                  <button
                    onClick={toggleVoiceRecognition}
                    disabled={isListening}
                    className={`${
                      isListening 
                        ? 'bg-red-600 animate-pulse' 
                        : 'bg-blue-600 hover:bg-blue-700'
                    } text-white px-4 py-2 rounded-lg transition-all duration-200 disabled:cursor-not-allowed`}
                    title={isListening ? "Ouvindo... (Ctrl+K para parar)" : "Comando de voz (Ctrl+K)"}
                  >
                    {isListening ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect x="6" y="4" width="4" height="16"/>
                        <rect x="14" y="4" width="4" height="16"/>
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
                        <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                        <line x1="12" y1="19" x2="12" y2="23"/>
                        <line x1="8" y1="23" x2="16" y2="23"/>
                      </svg>
                    )}
                  </button>
                )}

                <button
                  onClick={handleSendMessage}
                  disabled={!currentInput.trim()}
                  className="bg-[#F7941E] hover:bg-[#e8851a] disabled:bg-[#666] disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="22" y1="2" x2="11" y2="13"></line>
                    <polygon points="22,2 15,22 11,13 2,9 22,2"></polygon>
                  </svg>
                </button>
              </div>
              
              {/* Indicador de status de voz */}
              {isListening && (
                <div className="mt-2 flex items-center justify-center gap-2 text-red-400 text-xs">
                  <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                  <span>🎤 Ouvindo... Fale seu comando! (Ctrl+K para parar)</span>
                  <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                </div>
              )}
              
              {speechSupported && !isListening && (
                <div className="mt-1 text-xs text-[#666] text-center">
                  💡 Dica: Pressione <kbd className="bg-gray-700 px-1 rounded text-gray-300">Ctrl+K</kbd> para ativar o microfone!
                </div>
              )}
            </div>
          </div>

          {/* Área de Dados (40%) */}
          
<div className="w-2/5 bg-[#242424] border-l border-[#404040] flex flex-col">
  {/* TABS */}
  <div className="p-4 border-b border-[#404040] flex space-x-4">
    <button
      className={`pb-1 ${activeTab === "account" ? "border-b-2 border-white text-white" : "text-[#888] hover:text-white"}`}
      onClick={() => setActiveTab("account")}
    >
      💰 Informações
    </button>
    <button
      className={`pb-1 ${activeTab === "orders" ? "border-b-2 border-white text-white" : "text-[#888] hover:text-white"}`}
      onClick={() => setActiveTab("orders")}
    >
      📋 Ordens
    </button>
  </div>

  {/* Conteúdo das Tabs */}
  {activeTab === "account" ? (
    <div className="p-4 flex-1 overflow-auto">
      
<div className="flex-1 p-4 space-y-4">
              {/* Saldo */}
              <div className="bg-[#2a2a2a] rounded-lg p-3">
                <div className="text-[#aaa] text-xs mb-1">SALDO DISPONÍVEL</div>
                <div className="text-white text-xl font-bold">R$ {userBalance.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</div>
              </div>

              {selectedAsset && (
                <>
                  {/* <div className="bg-[#2a2a2a] rounded-lg p-3">
                    <div className="text-white font-bold text-lg">{selectedAsset.codigo}</div>
                    <div className="text-[#aaa] text-sm">{selectedAsset.nome}</div>
                    <div className="mt-2">
                      <div className="text-white text-xl font-bold">R$ {selectedAsset.preco.toFixed(2)}</div>
                      <div className="text-[#aaa] text-sm">por ação</div>
                    </div>
                  </div> */}

                  <div className="bg-[#2a2a2a] rounded-lg p-3">
                    <div className="text-white font-semibold text-sm mb-2">🧮 Simulador Automático</div>
                    <div className="space-y-2">
                      <div className="text-xs text-[#aaa]">
                        <strong>Com R$ 1.000:</strong> {Math.floor(1000 / selectedAsset.preco)} ações
                      </div>
                      <div className="text-xs text-[#aaa]">
                        <strong>Com R$ 5.000:</strong> {Math.floor(5000 / selectedAsset.preco)} ações
                      </div>
                      <div className="text-xs text-[#aaa]">
                        <strong>Com seu saldo:</strong> {Math.floor(userBalance / selectedAsset.preco)} ações
                      </div>
                    </div>
                  </div>
                </>
              )}

              {pendingOrder && (
                <div className="bg-[#2a2a2a] rounded-lg p-3 border border-[#F7941E]">
                  <div className="text-[#F7941E] font-semibold text-sm mb-2">⏳ Ordem Pendente</div>
                  <div className="space-y-1">
                    <div className="text-xs text-[#ccc]">
                      <strong>{pendingOrder.ativo.codigo}:</strong> {pendingOrder.quantidade} ações
                    </div>
                    <div className="text-xs text-[#ccc]">
                      <strong>Total:</strong> R$ {pendingOrder.valorTotal.toLocaleString('pt-BR', {minimumFractionDigits: 2})}
                    </div>
                  </div>
                </div>
              )}
              
              {!selectedAsset && !pendingOrder && (
                <div className="text-center text-[#666] mt-8">
                  <div className="text-4xl mb-2">🤖</div>
                  <div className="text-sm">Digite um comando de compra para começar!</div>
                  <div className="text-xs mt-2 text-[#555]">Ex: "Compre R$ 1.000 de ações da Petrobras"</div>
                  {speechSupported && (
                    <div className="text-xs mt-1 text-blue-400">Ou use o botão 🎤 para falar!</div>
                  )}
                </div>
              )}
            </div>
    </div>
  ) : (
    <div className="p-4 flex-1 overflow-auto">
      {orders.length === 0 ? (
        <div className="text-center text-[#666] mt-8">Nenhuma ordem registrada ainda.</div>
      ) : (
        <ul className="space-y-2">
          {orders.map((ord, idx) => (
            <li key={idx} className="flex justify-between bg-[#2a2a2a] p-2 rounded border">
              <div>
                <strong>{ord.quantidade}</strong> {ord.ativo.codigo} — {ord.status === "executada" ? "✅ Executada" : "❌ Cancelada"}
              </div>
              <div className="text-xs text-[#aaa]">
                {new Date(ord.timestamp).toLocaleTimeString("pt-BR")}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )}
</div>

        </div>
      </div>
    </div>
  )
}

export default Yzzy