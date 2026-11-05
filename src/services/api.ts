import { handleLocalMockRequest } from './mockStore'

/**
 * Cliente HTTP para comunicação com o backend em Java (Spring Boot MVC).
 * Endpoints baseados em http://localhost:8088/api.
 * Quando o backend está offline, utiliza automaticamente os dados de demonstração
 * locais (mockStore) para garantir a navegabilidade completa do protótipo.
 */
export const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:8088/api'

export class ApiError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers
    })

    if (!response.ok) {
      const errorText = await response.text().catch(() => '')
      let mensagem = errorText
      try {
        const dados = JSON.parse(errorText)
        mensagem = dados.message || dados.mensagem || `Erro na requisição (${response.status})`
      } catch { /* A API também pode retornar mensagens em texto. */ }
      throw new ApiError(response.status, mensagem || `Erro na requisição (${response.status})`)
    }

    // Resposta vazia (ex.: 204 No Content)
    if (response.status === 204) {
      return null as T
    }

    return response.json() as Promise<T>
  } catch (error) {
    // Se o erro foi um ApiError retornado pelo backend (ex: 400, 404), propaga
    if (error instanceof ApiError) {
      throw error
    }

    // Backend offline / erro de rede: aciona o armazenamento de demonstração local
    return handleLocalMockRequest<T>(endpoint, options)
  }
}
