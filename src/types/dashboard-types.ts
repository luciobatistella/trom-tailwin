// Financeiro
export interface AssetsSummaryResponse {
  value: number
  extrato: {
    lancamento: number
    descricao: string
    liquidacao: string
    movimentacao: string
    valorLancamento: number
  }[]
}

// Renda Variável
export interface RendaVariavelData {
  // Infos do símbolo
  descricaoCompleta: string
  cotacaoTempoReal: number
  percentualUltimo: number
  valorizacaoDia: number
  indicacaoAlta: boolean

  // Proventos
  proventosPagos: Provento[]
  proventosProvisionados: Provento[]
}

export interface Provento {
  numDist: number
  bonusDescription: string
  qty: number
  inclusiveValue: number
  ir: number
  value: number
  paymentDate: string
}

// Renda Fixa
export interface FixedIncomePosition {
  // Infos do papel
  cod: string
  description: string
  isin: string
  typeName: string
  indexer: string
  issuer: string
  earlyRedemption: boolean
  expiredDate: string
  fgc: boolean
  rating: string

  // Infos da posição
  value: number
  valueUpdated: number
  qty: number
  blockedQty: number
  redemptionQty: number
  shareValue: number
  shareValueMin: number
  shareValueMax: number
  performanceFee: number
  performanceFeeMin: number
  performanceFeeMax: number
  adminFee: number
  valueRedemptionToday: number
  valueInvestedToday: number
}

// Fundos e Clubes
export interface BondPosition {
  // Infos do Fundo
  bond: string
  description: string
  classification: string
  category: string
  strategy: string
  idRegulator: string
  isin: string
  manager: string
  administrator: string
  quoteValue: number
  quoteValueDate: string
  adminFee: number
  benchmark: string
  discountQuote: boolean
  investmentQuote: string
  redemptionQuote: string
  levelRisk: number
  profileRisk: string

  // Performance
  performanceMonth: number
  performanceYear: number
  performanceLast12M: number

  // Posição
  qtyQuote: number
  valueInvested: number
  valueTotal: number
  valueNet: number
  valueRedemption: number
  valueRedemptionToday: number
  valueInvestedToday: number
}

// Tesouro Direto
export interface TreasuryDirectData {
  typeName: string
  description: string
  securitiesName: string
  dueDate: string
  buyPrice: number
  currentBalance: number
  value: number
  netValue: number
  monthProfitability: number
  yearProfitability: number
  last12monthsProfitability: number
  accumulatedProfitability: number
}

// Garantias
export interface CollateralPosition {
  dtCollateral: string
  collateral: string
  description: string
  qty: number
  value: number
  currency: string
  dtExpired: string
  origin: string
}

export type DashboardData =
  | { type: "financeiro"; data: AssetsSummaryResponse }
  | { type: "renda-variavel"; data: RendaVariavelData }
  | { type: "renda-fixa"; data: FixedIncomePosition }
  | { type: "fundos-clubes"; data: BondPosition }
  | { type: "tesouro-direto"; data: TreasuryDirectData }
  | { type: "garantias"; data: CollateralPosition }
