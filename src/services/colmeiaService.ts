import {
  get,
  push,
  ref,
  set,
  update,
  remove
} from 'firebase/database'
import { auth, db } from './firebase'
import { garantirDadosIniciaisFirebase } from './firebaseSync'
import { handleLocalMockRequest } from './mockStore'
import type { Colmeia } from '../data/types'

function obterCaminhoColmeias(): string | null {
  const usuario = auth.currentUser
  if (!usuario) return null
  return `usuarios/${usuario.uid}/colmeias`
}

/**
 * Lista as colmeias do usuário autenticado no Firebase Realtime Database.
 */
export async function listarColmeias(apiarioId?: string): Promise<Colmeia[]> {
  const caminho = obterCaminhoColmeias()
  if (!caminho || !auth.currentUser) {
    const query = apiarioId ? `?apiarioId=${encodeURIComponent(apiarioId)}` : ''
    return handleLocalMockRequest<Colmeia[]>(`/colmeias${query}`, { method: 'GET' })
  }

  await garantirDadosIniciaisFirebase(auth.currentUser.uid)

  const referencia = ref(db, caminho)
  const snapshot = await get(referencia)

  if (!snapshot.exists()) {
    return []
  }

  const dados = snapshot.val() as Record<string, Omit<Colmeia, 'id'>>
  const lista = Object.entries(dados).map(([id, colmeia]) => ({
    ...colmeia,
    id
  }))

  if (apiarioId) {
    return lista.filter((c) => c.apiarioId === apiarioId)
  }

  return lista
}

/**
 * Busca uma colmeia pelo ID no Firebase Realtime Database.
 */
export async function buscarColmeia(id: string): Promise<Colmeia | null> {
  const caminho = obterCaminhoColmeias()
  if (!caminho) {
    try {
      return await handleLocalMockRequest<Colmeia>(`/colmeias/${id}`, { method: 'GET' })
    } catch {
      return null
    }
  }

  const referencia = ref(db, `${caminho}/${id}`)
  const snapshot = await get(referencia)

  if (!snapshot.exists()) {
    return null
  }

  return {
    ...snapshot.val(),
    id
  } as Colmeia
}

/**
 * Cadastra uma nova colmeia no Firebase Realtime Database.
 */
export async function criarColmeia(dados: Omit<Colmeia, 'id'>): Promise<Colmeia> {
  const caminho = obterCaminhoColmeias()
  if (!caminho || !auth.currentUser) {
    return handleLocalMockRequest<Colmeia>('/colmeias', {
      method: 'POST',
      body: JSON.stringify(dados)
    })
  }

  const referencia = push(ref(db, caminho))
  if (!referencia.key) {
    throw new Error('Não foi possível gerar a chave da colmeia no Firebase.')
  }

  const colmeia: Colmeia = {
    ...dados,
    id: referencia.key
  }

  await set(referencia, colmeia)

  // Atualiza contagem no apiário correspondente
  try {
    const apiarioRef = ref(db, `usuarios/${auth.currentUser.uid}/apiarios/${colmeia.apiarioId}`)
    const apSnap = await get(apiarioRef)
    if (apSnap.exists()) {
      const ap = apSnap.val()
      await update(apiarioRef, { totalColmeias: (ap.totalColmeias || 0) + 1 })
    }
  } catch {
    // Ignora erro secundário de contagem
  }

  return colmeia
}

/**
 * Atualiza os campos de uma colmeia existente no Firebase.
 */
export async function atualizarColmeia(
  id: string,
  dados: Partial<Omit<Colmeia, 'id'>>
): Promise<void> {
  const caminho = obterCaminhoColmeias()
  if (!caminho) {
    await handleLocalMockRequest<void>(`/colmeias/${id}`, {
      method: 'PUT',
      body: JSON.stringify(dados)
    })
    return
  }

  const referencia = ref(db, `${caminho}/${id}`)
  const snapshot = await get(referencia)
  if (!snapshot.exists()) {
    throw new Error('Colmeia não encontrada no Firebase.')
  }

  await update(referencia, dados)
}

/**
 * Exclui uma colmeia do usuário autenticado no Firebase.
 */
export async function excluirColmeia(id: string): Promise<void> {
  const caminho = obterCaminhoColmeias()
  if (!caminho || !auth.currentUser) {
    await handleLocalMockRequest<void>(`/colmeias/${id}`, {
      method: 'DELETE'
    })
    return
  }

  const referencia = ref(db, `${caminho}/${id}`)
  const snap = await get(referencia)
  if (snap.exists()) {
    const colmeia = snap.val()
    await remove(referencia)

    // Decrementa total no apiário
    try {
      const apiarioRef = ref(db, `usuarios/${auth.currentUser.uid}/apiarios/${colmeia.apiarioId}`)
      const apSnap = await get(apiarioRef)
      if (apSnap.exists()) {
        const ap = apSnap.val()
        await update(apiarioRef, { totalColmeias: Math.max(0, (ap.totalColmeias || 1) - 1) })
      }
    } catch {
      // Ignora erro secundário
    }
  }
}
