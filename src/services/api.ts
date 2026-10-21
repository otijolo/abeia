/**
 * Cliente HTTP para comunicação com o backend em Java (Spring Boot MVC).
 * Endpoints baseados em http://localhost:8080/api
 */
export const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:8088/api'

export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  }

  const response = await fetch(url, {
    ...options,
    headers
  })

  if (!response.ok) {
    const errorText = await response.text().catch(() => '')
    throw new Error(
      errorText || `Erro na requisição (${response.status} ${response.statusText})`
    )
  }

  // Resposta vazia (ex.: 204 No Content)
  if (response.status === 204) {
    return {} as T
  }

  return response.json() as Promise<T>
}
