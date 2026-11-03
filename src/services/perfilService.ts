import { ApiError, apiFetch } from './api'
import { auth } from './firebase'
import type { Perfil } from '../data/types'

async function endpointPerfil() {
  await auth.authStateReady()
  return `/perfil/${encodeURIComponent(auth.currentUser?.uid ?? 'usr-1')}`
}

/**
 * Obtém os dados do perfil através da API Java (Spring Boot MVC).
 * Endpoint: GET /api/perfil/{uid}
 */
export async function buscarPerfil(): Promise<Perfil | null> {
  try {
    return await apiFetch<Perfil | null>(await endpointPerfil())
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null
    throw error
  }
}

/**
 * Cria os dados do perfil via API Java.
 * Endpoint: POST /api/perfil/{uid}
 */
export async function criarPerfil(dados: Omit<Perfil, 'id'>): Promise<Perfil> {
  return apiFetch<Perfil>(await endpointPerfil(), {
    method: 'POST',
    body: JSON.stringify(dados)
  })
}

/**
 * Atualiza os campos do perfil do usuário via API Java.
 * Endpoint: PUT /api/perfil/{uid}
 */
export async function atualizarPerfil(dados: Partial<Perfil>): Promise<void> {
  await apiFetch<Perfil>(await endpointPerfil(), {
    method: 'PUT',
    body: JSON.stringify(dados)
  })
}

/**
 * Exclui os dados do perfil na API, mantendo a conta de acesso.
 * Endpoint: DELETE /api/perfil/{uid}
 */
export async function excluirPerfil(): Promise<void> {
  await apiFetch<void>(await endpointPerfil(), {
    method: 'DELETE'
  })
}
