// Dados do Tesouro Direto (anteriormente Renda Fixa Pública)
// Atualizado conforme especificação fixedIncomePosition
export const rfPublicaData = {
  id: "rfPublica",
  label: "Renda Fixa Pública",
  title: "Tesouro Direto",
  total: 30000,
  items: [
    {
      id: "tesouroPrefixado",
      label: "Tesouro Prefixado",
      value: "R$ 12.144,00",
      rawValue: 12144,
      percent: "40,48%",
      up: true,
      change: "+1,2%",
      ativos: [
        {
          // ** Infos do papel
          cod: "LTN010126",
          description: "Letra do Tesouro Nacional 2026",
          isin: "BRSTNCLTN126",
          typeName: "LTN",
          indexer: "Prefixado",
          issuer: "Tesouro Nacional",
          earlyRedemption: false,
          expiredDate: "2026-01-01",
          fgc: false,
          rating: "AAA",

          // ** Infos da posição
          value: 12000,
          valueUpdated: 12144,
          qty: 14,
          blockedQty: 0,
          redemptionQty: 0,
          shareValue: 867.43,
          shareValueMin: 800.00,
          shareValueMax: 900.00,
          performanceFee: 0.50,
          performanceFeeMin: 11.25,
          performanceFeeMax: 11.50,
          admin_fee: 0.30,

          // ** Valores do dia
          valueRedemptionToday: 0,
          valueInvestedToday: 1000,
        },
      ],
    },
    {
      id: "tesouroSelic",
      label: "Tesouro Selic",
      value: "R$ 10.080,00",
      rawValue: 10080,
      percent: "33,60%",
      up: true,
      change: "+0,8%",
      ativos: [
        {
          // ** Infos do papel
          cod: "LFT010327",
          description: "Letra Financeira do Tesouro 2027",
          isin: "BRSTNCLFT127",
          typeName: "LFT",
          indexer: "SELIC",
          issuer: "Tesouro Nacional",
          earlyRedemption: true,
          expiredDate: "2027-03-01",
          fgc: false,
          rating: "AAA",

          // ** Infos da posição
          value: 10000,
          valueUpdated: 10080,
          qty: 1,
          blockedQty: 0,
          redemptionQty: 0,
          shareValue: 10080.00,
          shareValueMin: 9500.00,
          shareValueMax: 10500.00,
          performanceFee: 0.25,
          performanceFeeMin: 0.00,
          performanceFeeMax: 0.50,
          admin_fee: 0.25,

          // ** Valores do dia
          valueRedemptionToday: 0,
          valueInvestedToday: 0,
        },
      ],
    },
    {
      id: "tesouroIPCA",
      label: "Tesouro IPCA+",
      value: "R$ 7.960,00",
      rawValue: 7960,
      percent: "26,53%",
      up: false,
      change: "-0,5%",
      ativos: [
        {
          // ** Infos do papel
          cod: "NTN-B150535",
          description: "Nota do Tesouro Nacional Série B 2035",
          isin: "BRSTNTNB1535",
          typeName: "NTN-B",
          indexer: "IPCA+",
          issuer: "Tesouro Nacional",
          earlyRedemption: true,
          expiredDate: "2035-05-15",
          fgc: false,
          rating: "AAA",

          // ** Infos da posição
          value: 8000,
          valueUpdated: 7960,
          qty: 3,
          blockedQty: 1,
          redemptionQty: 0,
          shareValue: 2653.33,
          shareValueMin: 2500.00,
          shareValueMax: 3000.00,
          performanceFee: 0.75,
          performanceFeeMin: 5.83,
          performanceFeeMax: 6.00,
          admin_fee: 0.50,

          // ** Valores do dia
          valueRedemptionToday: 500,
          valueInvestedToday: 0,
        },
      ],
    },
    {
      id: "tesouroEduca",
      label: "Tesouro Educa+",
      value: "R$ 5.200,00",
      rawValue: 5200,
      percent: "17,33%",
      up: true,
      change: "+0,3%",
      ativos: [
        {
          // ** Infos do papel
          cod: "NTN-B1P240831",
          description: "Nota do Tesouro Nacional Série B1 Principal 2031",
          isin: "BRSTNTNB1P31",
          typeName: "NTN-B1P",
          indexer: "IPCA+",
          issuer: "Tesouro Nacional",
          earlyRedemption: false,
          expiredDate: "2031-08-31",
          fgc: false,
          rating: "AAA",

          // ** Infos da posição
          value: 5000,
          valueUpdated: 5200,
          qty: 52,
          blockedQty: 5,
          redemptionQty: 3,
          shareValue: 100.00,
          shareValueMin: 95.00,
          shareValueMax: 105.00,
          performanceFee: 1.00,
          performanceFeeMin: 4.50,
          performanceFeeMax: 5.00,
          admin_fee: 0.75,

          // ** Valores do dia
          valueRedemptionToday: 300,
          valueInvestedToday: 500,
        },
      ],
    },
    {
      id: "cdb",
      label: "CDB Banco Inter",
      value: "R$ 15.750,00",
      rawValue: 15750,
      percent: "52,50%",
      up: true,
      change: "+2,1%",
      ativos: [
        {
          // ** Infos do papel
          cod: "CDB77493542",
          description: "CDB Banco Inter S.A. 2026",
          isin: "BRCDBINTER26",
          typeName: "CDB",
          indexer: "CDI",
          issuer: "Banco Inter S.A.",
          earlyRedemption: true,
          expiredDate: "2026-12-15",
          fgc: true,
          rating: "BB+",

          // ** Infos da posição
          value: 15000,
          valueUpdated: 15750,
          qty: 150,
          blockedQty: 10,
          redemptionQty: 5,
          shareValue: 105.00,
          shareValueMin: 100.00,
          shareValueMax: 110.00,
          performanceFee: 1.50,
          performanceFeeMin: 108.5,
          performanceFeeMax: 110.0,
          admin_fee: 1.25,

          // ** Valores do dia
          valueRedemptionToday: 0,
          valueInvestedToday: 2000,
        },
      ],
    },
  ],
}