import type { Producao } from './types'

export function dataDaProducao(valor: string): Date | null {
  const partes = valor.includes('/') ? valor.split('/').reverse() : valor.split('-')
  if (partes.length !== 3 || partes.some((parte) => !/^\d+$/.test(parte))) return null
  const [ano, mes, dia] = partes.map(Number)
  const data = new Date(ano, mes - 1, dia)
  return data.getFullYear() === ano && data.getMonth() === mes - 1 && data.getDate() === dia
    ? data : null
}

export function dentroDoPeriodo(valor: string, periodo: string, hoje = new Date()): boolean {
  if (!periodo) return true
  const data = dataDaProducao(valor)
  if (!data) return false
  const fim = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate(), 23, 59, 59, 999)
  const inicio = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate())
  if (periodo === 'Últimos 30 dias') inicio.setDate(inicio.getDate() - 29)
  else if (periodo === 'Últimos 6 meses') inicio.setMonth(inicio.getMonth() - 6)
  else inicio.setMonth(0, 1)
  return data >= inicio && data <= fim
}

/** Volume em litros permanece separado: não há conversão exata para massa. */
export function quantidadeEmKg(producao: Producao): number {
  const quantidade = Number(producao.quantidade) || 0
  if (producao.unidade === 'g') return quantidade / 1000
  return producao.unidade === 'kg' ? quantidade : 0
}
