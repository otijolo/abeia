import { apiFetch } from './api'
import type { Producao } from '../data/types'

type NovaProducao = Omit<Producao, 'id'>

/**
 * Lista todas as produções através da API Java (Spring Boot MVC).
 * Endpoint: GET /api/producoes
 */
export async function listarProducoes(): Promise<Producao[]> {
  return apiFetch<Producao[]>('/producoes')
}

/**
 * Lista as produções de uma colmeia específica.
 * Endpoint: GET /api/producoes/colmeia/{colmeiaId}
 */
export async function listarProducoesDaColmeia(
  colmeiaId: string
): Promise<Producao[]> {
  return apiFetch<Producao[]>(`/producoes/colmeia/${colmeiaId}`)
}

/**
 * Busca uma produção pelo ID na API Java.
 * Endpoint: GET /api/producoes/{id}
 */
export async function buscarProducao(id: string): Promise<Producao | null> {
  try {
    return await apiFetch<Producao>(`/producoes/${id}`)
  } catch {
    return null
  }
}

/**
 * Registra uma nova produção através do ProducaoController em Java.
 * Endpoint: POST /api/producoes
 */
export async function criarProducao(dados: NovaProducao): Promise<Producao> {
  return apiFetch<Producao>('/producoes', {
    method: 'POST',
    body: JSON.stringify(dados)
  })
}

/**
 * Atualiza os campos de uma produção existente.
 * Endpoint: PUT /api/producoes/{id}
 */
export async function atualizarProducao(
  id: string,
  dados: Partial<Omit<Producao, 'id'>>
): Promise<void> {
  await apiFetch<Producao>(`/producoes/${id}`, {
    method: 'PUT',
    body: JSON.stringify(dados)
  })
}

/**
 * Exclui um registro de produção.
 * Endpoint: DELETE /api/producoes/{id}
 */
export async function excluirProducao(id: string): Promise<void> {
  await apiFetch<void>(`/producoes/${id}`, {
    method: 'DELETE'
  })
}
