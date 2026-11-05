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
import type { Apiario } from '../data/types'

type NovoApiario = Omit<
  Apiario,
  'id' | 'totalColmeias' | 'status'
> & Partial<Pick<Apiario, 'totalColmeias' | 'status'>>

function obterCaminhoApiarios(): string | null {
  const usuario = auth.currentUser
  if (!usuario) return null
  return `usuarios/${usuario.uid}/apiarios`
}

/**
 * Lista todos os apiários do usuário autenticado no Firebase Realtime Database.
 * Em modo de demonstração sem login, utiliza o armazenamento local.
 */
export async function listarApiarios(): Promise<Apiario[]> {
  const caminho = obterCaminhoApiarios()
  if (!caminho || !auth.currentUser) {
    return handleLocalMockRequest<Apiario[]>('/apiarios', { method: 'GET' })
  }

  await garantirDadosIniciaisFirebase(auth.currentUser.uid)

  const referencia = ref(db, caminho)
  const snapshot = await get(referencia)

  if (!snapshot.exists()) {
    return []
  }

  const dados = snapshot.val() as Record<string, Omit<Apiario, 'id'>>
  return Object.entries(dados).map(([id, apiario]) => ({
    ...apiario,
    id
  }))
}

/**
 * Busca um apiário pelo ID no Firebase Realtime Database.
 */
export async function buscarApiario(id: string): Promise<Apiario | null> {
  const caminho = obterCaminhoApiarios()
  if (!caminho) {
    try {
      return await handleLocalMockRequest<Apiario>(`/apiarios/${id}`, { method: 'GET' })
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
  } as Apiario
}

/**
 * Cadastra um novo apiário no Firebase Realtime Database.
 */
export async function criarApiario(dados: NovoApiario): Promise<Apiario> {
  const caminho = obterCaminhoApiarios()
  if (!caminho) {
    return handleLocalMockRequest<Apiario>('/apiarios', {
      method: 'POST',
      body: JSON.stringify(dados)
    })
  }

  const referencia = push(ref(db, caminho))
  if (!referencia.key) {
    throw new Error('Não foi possível gerar a chave do apiário no Firebase.')
  }

  const apiario: Apiario = {
    ...dados,
    id: referencia.key,
    totalColmeias: dados.totalColmeias ?? 0,
    status: dados.status ?? 'normal'
  }

  await set(referencia, apiario)
  return apiario
}

/**
 * Atualiza os campos de um apiário existente no Firebase.
 */
export async function atualizarApiario(
  id: string,
  dados: Partial<Omit<Apiario, 'id'>>
): Promise<void> {
  const caminho = obterCaminhoApiarios()
  if (!caminho) {
    await handleLocalMockRequest<void>(`/apiarios/${id}`, {
      method: 'PUT',
      body: JSON.stringify(dados)
    })
    return
  }

  const referencia = ref(db, `${caminho}/${id}`)
  const snapshot = await get(referencia)
  if (!snapshot.exists()) {
    throw new Error('Apiário não encontrado no Firebase.')
  }

  await update(referencia, dados)
}

/**
 * Exclui um apiário existente no Firebase.
 */
export async function excluirApiario(id: string): Promise<void> {
  const caminho = obterCaminhoApiarios()
  if (!caminho) {
    await handleLocalMockRequest<void>(`/apiarios/${id}`, {
      method: 'DELETE'
    })
    return
  }

  const referencia = ref(db, `${caminho}/${id}`)
  await remove(referencia)
}
