/** Exibe também as datas ISO da API no formato usado nas telas. */
export function formatarData(valor: string): string {
  return valor.replace(/^(\d{4})-(\d{2})-(\d{2})$/, '$3/$2/$1')
}

export function compararDatasDecrescente(a: string, b: string): number {
  const primeira = formatarData(a).split('/').reverse().join('-')
  const segunda = formatarData(b).split('/').reverse().join('-')
  return segunda.localeCompare(primeira)
}
