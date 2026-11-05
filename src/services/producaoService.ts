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
import type { Producao } from '../data/types'

type NovaProducao = Omit<Producao, 'id'>

function obterCaminhoProducoes(): string | null {
  const usuario = auth.currentUser
  if (!usuario) return null
  return `usuarios/${usuario.uid}/producoes`
}

/**
 * Lista todas as produções cadastradas pelo usuário autenticado no Firebase Realtime Database.
 */
export async function listarProducoes(): Promise<Producao[]> {
  const caminho = obterCaminhoProducoes()
  if (!caminho || !auth.currentUser) {
    return handleLocalMockRequest<Producao[]>('/producoes', { method: 'GET' })
  }

  await garantirDadosIniciaisFirebase(auth.currentUser.uid)

  const referencia = ref(db, caminho)
  const snapshot = await get(referencia)

  if (!snapshot.exists()) {
    return []
  }

  const dados = snapshot.val() as Record<string, Omit<Producao, 'id'>>
  return Object.entries(dados).map(([id, producao]) => ({
    ...producao,
    id
  }))
}

/**
 * Lista todas as produções de uma colmeia específica no Firebase.
 */
export async function listarProducoesDaColmeia(
  colmeiaId: string
): Promise<Producao[]> {
  const producoes = await listarProducoes()
  return producoes.filter((p) => p.colmeiaId === colmeiaId)
}

/**
 * Busca uma produção pelo ID no Firebase Realtime Database.
 */
export async function buscarProducao(id: string): Promise<Producao | null> {
  const caminho = obterCaminhoProducoes()
  if (!caminho) {
    try {
      return await handleLocalMockRequest<Producao>(`/producoes/${id}`, { method: 'GET' })
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
  } as Producao
}

/**
 * Cadastra uma nova produção no Firebase Realtime Database.
 */
export async function criarProducao(dados: NovaProducao): Promise<Producao> {
  const caminho = obterCaminhoProducoes()
  if (!caminho) {
    return handleLocalMockRequest<Producao>('/producoes', {
      method: 'POST',
      body: JSON.stringify(dados)
    })
  }

  const referencia = push(ref(db, caminho))
  if (!referencia.key) {
    throw new Error('Não foi possível gerar a chave da produção no Firebase.')
  }

  const producao: Producao = {
    ...dados,
    id: referencia.key
  }

  await set(referencia, producao)
  return producao
}

/**
 * Atualiza os campos de uma produção existente no Firebase.
 */
export async function atualizarProducao(
  id: string,
  dados: Partial<Omit<Producao, 'id'>>
): Promise<void> {
  const caminho = obterCaminhoProducoes()
  if (!caminho) {
    await handleLocalMockRequest<void>(`/producoes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(dados)
    })
    return
  }

  const referencia = ref(db, `${caminho}/${id}`)
  const snapshot = await get(referencia)
  if (!snapshot.exists()) {
    throw new Error('Produção não encontrada no Firebase.')
  }

  await update(referencia, dados)
}

/**
 * Exclui um registro de produção existente no Firebase.
 */
export async function excluirProducao(id: string): Promise<void> {
  const caminho = obterCaminhoProducoes()
  if (!caminho) {
    await handleLocalMockRequest<void>(`/producoes/${id}`, {
      method: 'DELETE'
    })
    return
  }

  const referencia = ref(db, `${caminho}/${id}`)
  await remove(referencia)
}
