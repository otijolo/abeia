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
import type { Alerta, AlertaEstado } from '../data/types'

type NovoAlerta = Omit<Alerta, 'id' | 'estado'> &
  Partial<Pick<Alerta, 'estado'>>

function obterCaminhoAlertas(): string | null {
  const usuario = auth.currentUser
  if (!usuario) return null
  return `usuarios/${usuario.uid}/alertas`
}

/**
 * Lista todos os alertas do usuário autenticado no Firebase Realtime Database.
 */
export async function listarAlertas(): Promise<Alerta[]> {
  const caminho = obterCaminhoAlertas()
  if (!caminho || !auth.currentUser) {
    return handleLocalMockRequest<Alerta[]>('/alertas', { method: 'GET' })
  }

  await garantirDadosIniciaisFirebase(auth.currentUser.uid)

  const referencia = ref(db, caminho)
  const snapshot = await get(referencia)

  if (!snapshot.exists()) {
    return []
  }

  const dados = snapshot.val() as Record<string, Omit<Alerta, 'id'>>
  return Object.entries(dados).map(([id, alerta]) => ({
    ...alerta,
    id
  }))
}

/**
 * Busca um alerta pelo ID no Firebase Realtime Database.
 */
export async function buscarAlerta(id: string): Promise<Alerta | null> {
  const caminho = obterCaminhoAlertas()
  if (!caminho) {
    try {
      return await handleLocalMockRequest<Alerta>(`/alertas/${id}`, { method: 'GET' })
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
  } as Alerta
}

/**
 * Cadastra um novo alerta no Firebase Realtime Database.
 */
export async function criarAlerta(dados: NovoAlerta): Promise<Alerta> {
  const caminho = obterCaminhoAlertas()
  if (!caminho) {
    return handleLocalMockRequest<Alerta>('/alertas', {
      method: 'POST',
      body: JSON.stringify(dados)
    })
  }

  const referencia = push(ref(db, caminho))
  if (!referencia.key) {
    throw new Error('Não foi possível gerar o ID do alerta no Firebase.')
  }

  const alerta: Alerta = {
    ...dados,
    id: referencia.key,
    estado: dados.estado ?? 'ativo'
  }

  await set(referencia, alerta)
  return alerta
}

/**
 * Atualiza os campos de um alerta existente no Firebase.
 */
export async function atualizarAlerta(
  id: string,
  dados: Partial<Omit<Alerta, 'id'>>
): Promise<void> {
  const caminho = obterCaminhoAlertas()
  if (!caminho) {
    await handleLocalMockRequest<void>(`/alertas/${id}`, {
      method: 'PUT',
      body: JSON.stringify(dados)
    })
    return
  }

  const referencia = ref(db, `${caminho}/${id}`)
  const snapshot = await get(referencia)
  if (!snapshot.exists()) {
    throw new Error('Alerta não encontrado no Firebase.')
  }

  await update(referencia, dados)
}

/**
 * Exclui um alerta existente no Firebase.
 */
export async function excluirAlerta(id: string): Promise<void> {
  const caminho = obterCaminhoAlertas()
  if (!caminho) {
    await handleLocalMockRequest<void>(`/alertas/${id}`, {
      method: 'DELETE'
    })
    return
  }

  const referencia = ref(db, `${caminho}/${id}`)
  await remove(referencia)
}

/**
 * Altera o estado de um alerta ('ativo' | 'resolvido' | 'ignorado') no Firebase.
 */
export async function atualizarEstadoAlerta(
  id: string,
  estado: AlertaEstado
): Promise<void> {
  await atualizarAlerta(id, { estado })
}
