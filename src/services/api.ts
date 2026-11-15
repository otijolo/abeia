import { auth } from './firebase'
import { handleLocalMockRequest } from './mockStore'

/** Endereço da API Java. O modo de demonstração é usado somente sem login. */
export const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8088/api').replace(/\/$/, '')

export class ApiError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

export async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  await auth.authStateReady()
  const usuario = auth.currentUser
  if (!usuario) return handleLocalMockRequest<T>(endpoint, options)

  const headers = new Headers(options.headers)
  headers.set('Content-Type', 'application/json')
  headers.set('Authorization', `Bearer ${await usuario.getIdToken()}`)

  let response: Response
  try {
    response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
      signal: options.signal ?? AbortSignal.timeout(90000)
    })
  } catch {
    // Falhas de rede não devem fazer uma gravação parecer salva no banco.
    throw new Error('Não foi possível acessar o servidor. Ele pode estar iniciando; tente novamente em instantes.')
  }

  if (!response.ok) {
    const dados = await response.json().catch(() => null) as { message?: string } | null
    throw new ApiError(response.status, dados?.message || `Não foi possível concluir a operação (${response.status}).`)
  }
  if (response.status === 204) return null as T
  return response.json() as Promise<T>
}
