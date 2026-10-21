import { apiFetch } from './api'
import type { Colmeia } from '../data/types'

/**
 * Lista todas as colmeias através da API Java (Spring Boot MVC).
 * Endpoint: GET /api/colmeias
 */
export async function listarColmeias(apiarioId?: string): Promise<Colmeia[]> {
  const query = apiarioId ? `?apiarioId=${encodeURIComponent(apiarioId)}` : ''
  return apiFetch<Colmeia[]>(`/colmeias${query}`)
}

/**
 * Busca uma colmeia pelo ID na API Java.
 * Endpoint: GET /api/colmeias/{id}
 */
export async function buscarColmeia(id: string): Promise<Colmeia | null> {
  try {
    return await apiFetch<Colmeia>(`/colmeias/${id}`)
  } catch {
    return null
  }
}

/**
 * Cadastra uma nova colmeia no backend Java.
 * Endpoint: POST /api/colmeias
 */
export async function criarColmeia(
  dados: Omit<Colmeia, 'id'>
): Promise<Colmeia> {
  return apiFetch<Colmeia>('/colmeias', {
    method: 'POST',
    body: JSON.stringify(dados)
  })
}

/**
 * Atualiza os campos de uma colmeia existente via API Java.
 * Endpoint: PUT /api/colmeias/{id}
 */
export async function atualizarColmeia(
  id: string,
  dados: Partial<Omit<Colmeia, 'id'>>
): Promise<void> {
  await apiFetch<Colmeia>(`/colmeias/${id}`, {
    method: 'PUT',
    body: JSON.stringify(dados)
  })
}

/**
 * Exclui uma colmeia existente via API Java.
 * Endpoint: DELETE /api/colmeias/{id}
 */
export async function excluirColmeia(id: string): Promise<void> {
  await apiFetch<void>(`/colmeias/${id}`, {
    method: 'DELETE'
  })
}
