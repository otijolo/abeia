import { apiFetch } from './api'
import type { Apiario } from '../data/types'

type NovoApiario = Omit<
  Apiario,
  'id' | 'totalColmeias' | 'status'
> & Partial<Pick<Apiario, 'totalColmeias' | 'status'>>

/**
 * Lista todos os apiários através da API Java (Spring Boot MVC).
 * Endpoint: GET /api/apiarios
 */
export async function listarApiarios(): Promise<Apiario[]> {
  return apiFetch<Apiario[]>('/apiarios')
}

/**
 * Busca um apiário pelo ID na API Java.
 * Endpoint: GET /api/apiarios/{id}
 */
export async function buscarApiario(id: string): Promise<Apiario | null> {
  try {
    return await apiFetch<Apiario>(`/apiarios/${id}`)
  } catch {
    return null
  }
}

/**
 * Cadastra um novo apiário no backend Java.
 * Endpoint: POST /api/apiarios
 */
export async function criarApiario(dados: NovoApiario): Promise<Apiario> {
  return apiFetch<Apiario>('/apiarios', {
    method: 'POST',
    body: JSON.stringify({
      ...dados,
      totalColmeias: dados.totalColmeias ?? 0,
      status: dados.status ?? 'normal'
    })
  })
}

/**
 * Atualiza os campos de um apiário via API Java.
 * Endpoint: PUT /api/apiarios/{id}
 */
export async function atualizarApiario(
  id: string,
  dados: Partial<Omit<Apiario, 'id'>>
): Promise<void> {
  await apiFetch<Apiario>(`/apiarios/${id}`, {
    method: 'PUT',
    body: JSON.stringify(dados)
  })
}

/**
 * Exclui um apiário existente via API Java.
 * Endpoint: DELETE /api/apiarios/{id}
 */
export async function excluirApiario(id: string): Promise<void> {
  await apiFetch<void>(`/apiarios/${id}`, {
    method: 'DELETE'
  })
}
