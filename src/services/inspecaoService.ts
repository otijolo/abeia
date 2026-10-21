import { apiFetch } from './api'
import type { Inspecao } from '../data/types'

type NovaInspecao = Omit<Inspecao, 'id'>

/**
 * Registra uma inspeção no backend Java através do InspecaoController.
 * Endpoint: POST /api/inspecoes
 */
export async function criarInspecao(dados: NovaInspecao): Promise<Inspecao> {
  return apiFetch<Inspecao>('/inspecoes', {
    method: 'POST',
    body: JSON.stringify(dados)
  })
}

/**
 * Lista as inspeções de uma colmeia específica via API Java.
 * Endpoint: GET /api/inspecoes?colmeiaId={colmeiaId}
 */
export async function listarInspecoesDaColmeia(
  colmeiaId: string
): Promise<Inspecao[]> {
  return apiFetch<Inspecao[]>(`/inspecoes?colmeiaId=${encodeURIComponent(colmeiaId)}`)
}

/**
 * Busca uma inspeção específica na API Java.
 * Endpoint: GET /api/inspecoes/{id}
 */
export async function buscarInspecao(id: string): Promise<Inspecao | null> {
  try {
    return await apiFetch<Inspecao>(`/inspecoes/${id}`)
  } catch {
    return null
  }
}
