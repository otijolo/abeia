import {
  get,
  ref,
  set,
  update,
  remove
} from 'firebase/database'
import { auth, db } from './firebase'
import { handleLocalMockRequest } from './mockStore'
import type { Perfil } from '../data/types'

function obterCaminhoPerfil(): string | null {
  const usuario = auth.currentUser
  if (!usuario) return null
  return `usuarios/${usuario.uid}/perfil`
}

/**
 * Busca os dados do perfil do usuário autenticado no Firebase Realtime Database.
 */
export async function buscarPerfil(): Promise<Perfil | null> {
  const caminho = obterCaminhoPerfil()
  if (!caminho || !auth.currentUser) {
    return handleLocalMockRequest<Perfil | null>('/perfil', { method: 'GET' })
  }

  const referencia = ref(db, caminho)
  const snapshot = await get(referencia)

  if (!snapshot.exists()) {
    const usuarioAuth = auth.currentUser
    if (!usuarioAuth) return null

    return {
      id: usuarioAuth.uid,
      nome: usuarioAuth.displayName ?? '',
      email: usuarioAuth.email ?? '',
      iniciais: usuarioAuth.displayName
        ? usuarioAuth.displayName
            .split(/\s+/)
            .map((p) => p[0])
            .slice(0, 2)
            .join('')
            .toUpperCase()
        : 'U'
    }
  }

  return snapshot.val() as Perfil
}

/**
 * Cria ou inicializa os dados do perfil do usuário autenticado no Firebase.
 */
export async function criarPerfil(dados: Omit<Perfil, 'id'>): Promise<Perfil> {
  const usuario = auth.currentUser
  if (!usuario) {
    return handleLocalMockRequest<Perfil>('/perfil', {
      method: 'POST',
      body: JSON.stringify(dados)
    })
  }

  const perfil: Perfil = {
    ...dados,
    id: usuario.uid,
    email: dados.email || usuario.email || ''
  }

  const referencia = ref(db, `usuarios/${usuario.uid}/perfil`)
  await set(referencia, perfil)
  return perfil
}

/**
 * Atualiza os campos do perfil do usuário autenticado no Firebase.
 */
export async function atualizarPerfil(dados: Partial<Perfil>): Promise<void> {
  const usuario = auth.currentUser
  if (!usuario) {
    await handleLocalMockRequest<void>('/perfil', {
      method: 'PUT',
      body: JSON.stringify(dados)
    })
    return
  }

  const referencia = ref(db, `usuarios/${usuario.uid}/perfil`)
  const snapshot = await get(referencia)

  if (!snapshot.exists()) {
    await criarPerfil({
      nome: dados.nome ?? '',
      email: dados.email ?? usuario.email ?? '',
      ...dados
    })
    return
  }

  await update(referencia, dados)
}

/**
 * Exclui os dados do perfil do usuário autenticado no Firebase Realtime Database.
 */
export async function excluirPerfil(): Promise<void> {
  const caminho = obterCaminhoPerfil()
  if (!caminho) {
    await handleLocalMockRequest<void>('/perfil', {
      method: 'DELETE'
    })
    return
  }

  const referencia = ref(db, caminho)
  await remove(referencia)
}
