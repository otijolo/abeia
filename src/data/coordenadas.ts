import type { Apiario } from './types'

/** Coordenadas incompletas não devem virar marcadores em locais incorretos. */
export function coordenadasDoApiario(apiario: Apiario): [number, number] | null {
  const latitude = String(apiario.latitude ?? '').trim().replace(',', '.')
  const longitude = String(apiario.longitude ?? '').trim().replace(',', '.')
  const decimal = /^-?\d+(\.\d+)?$/
  if (!decimal.test(latitude) || !decimal.test(longitude)) return null

  const lat = Number(latitude)
  const lng = Number(longitude)
  return Math.abs(lat) <= 90 && Math.abs(lng) <= 180 ? [lat, lng] : null
}
