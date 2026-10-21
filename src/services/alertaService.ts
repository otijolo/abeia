import { apiFetch } from './api'
import type { Alerta, AlertaEstado } from '../data/types'

type NovoAlerta = Omit<Alerta, 'id' | 'estado'> &
  Partial<Pick<Alerta, 'estado'>>

/**
 * Lista todos os alertas através da API Java (Spring Boot MVC).
 * Endpoint: GET /api/alertas
 */
export async function listarAlertas(): Promise<Alerta[]> {
  return apiFetch<Alerta[]>('/alertas')
}

/**
 * Busca um alerta pelo ID na API Java.
 * Endpoint: GET /api/alertas/{id}
 */
export async function buscarAlerta(id: string): Promise<Alerta | null> {
  try {
    return await apiFetch<Alerta>(`/alertas/${id}`)
  } catch {
    return null
  }
}

/**
 * Cadastra um novo alerta através do AlertaController em Java.
 * Endpoint: POST /api/alertas
 */
export async function criarAlerta(dados: NovoAlerta): Promise<Alerta> {
  return apiFetch<Alerta>('/alertas', {
    method: 'POST',
    body: JSON.stringify({
      ...dados,
      estado: dados.estado ?? 'ativo'
    })
  })
}

/**
 * Atualiza os campos de um alerta via API Java.
 * Endpoint: PUT /api/alertas/{id}
 */
export async function atualizarAlerta(
  id: string,
  dados: Partial<Omit<Alerta, 'id'>>
): Promise<void> {
  await apiFetch<Alerta>(`/alertas/${id}`, {
    method: 'PUT',
    body: JSON.stringify(dados)
  })
}

/**
 * Atualiza apenas o estado de um alerta (ativo/resolvido/ignorado).
 * Endpoint: PATCH /api/alertas/{id}/estado
 */
export async function atualizarEstadoAlerta(
  id: string,
  estado: AlertaEstado
): Promise<void> {
  await apiFetch<Alerta>(`/alertas/${id}/estado`, {
    method: 'PATCH',
    body: JSON.stringify({ estado })
  })
}

/**
 * Exclui um alerta via API Java.
 * Endpoint: DELETE /api/alertas/{id}
 */
export async function excluirAlerta(id: string): Promise<void> {
  await apiFetch<void>(`/alertas/${id}`, {
    method: 'DELETE'
  })
}
