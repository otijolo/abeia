import { ApiError, apiFetch } from './api'
import type { Perfil } from '../data/types'


/**
 * Obtém os dados do perfil através da API Java (Spring Boot MVC).
 * Endpoint: GET /api/perfil
 */
export async function buscarPerfil(): Promise<Perfil | null> {
  try {
    return await apiFetch<Perfil | null>('/perfil')
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null
    throw error
  }
}

/**
 * Cria os dados do perfil via API Java.
 * Endpoint: POST /api/perfil
 */
export async function criarPerfil(dados: Omit<Perfil, 'id'>): Promise<Perfil> {
  return apiFetch<Perfil>('/perfil', {
    method: 'POST',
    body: JSON.stringify(dados)
  })
}

/**
 * Atualiza os campos do perfil do usuário via API Java.
 * Endpoint: PUT /api/perfil
 */
export async function atualizarPerfil(dados: Partial<Perfil>): Promise<void> {
  await apiFetch<Perfil>('/perfil', {
    method: 'PUT',
    body: JSON.stringify(dados)
  })
}

/**
 * Exclui os dados do perfil na API, mantendo a conta de acesso.
 * Endpoint: DELETE /api/perfil
 */
export async function excluirPerfil(): Promise<void> {
  await apiFetch<void>('/perfil', {
    method: 'DELETE'
  })
}
