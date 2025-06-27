/**
 * Formata um valor numérico para o formato de moeda brasileira (R$)
 * @param value - O valor a ser formatado
 * @param currency - O símbolo da moeda (padrão: R$)
 * @returns String formatada no padrão de moeda
 */
export function formatCurrency(value: number, currency = "R$"): string {
  return `${currency} ${value.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

/**
 * Formata um valor numérico para o formato de percentual
 * @param value - O valor a ser formatado
 * @returns String formatada no padrão de percentual
 */
export function formatPercent(value: number): string {
  return `${value.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}%`
}

/**
 * Formata um valor numérico para o formato de número com separadores de milhar
 * @param value - O valor a ser formatado
 * @returns String formatada com separadores de milhar
 */
export function formatNumber(value: number): string {
  return value.toLocaleString("pt-BR")
}
