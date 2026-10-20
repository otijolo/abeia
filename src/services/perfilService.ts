import {
  get,
  ref,
  set,
  update,
  remove
} from 'firebase/database'

import { auth, db } from './firebase'
import type { Perfil } from '../data/types'

/**
 * Retorna o caminho do perfil do usuário autenticado.
 */
function obterCaminhoPerfil(): string {
  const usuario = auth.currentUser

  if (!usuario) {
    throw new Error(
      'Você precisa estar autenticado para acessar o perfil.'
    )
  }

  return `usuarios/${usuario.uid}/perfil`
}

/**
 * Busca os dados do perfil do usuário autenticado.
 */
export async function buscarPerfil(): Promise<Perfil | null> {
  const referencia = ref(db, obterCaminhoPerfil())
  const snapshot = await get(referencia)

  if (!snapshot.exists()) {
    const usuarioAuth = auth.currentUser

    if (!usuarioAuth) {
      return null
    }

    // Retorna fallback básico com os dados do próprio Firebase Auth caso ainda não tenha perfil salvo
    return {
      id: usuarioAuth.uid,
      nome: usuarioAuth.displayName ?? '',
      email: usuarioAuth.email ?? '',
      iniciais: usuarioAuth.displayName
        ? usuarioAuth.displayName
            .split(' ')
            .map((p) => p[0])
            .slice(0, 2)
            .join('')
            .toUpperCase()
        : ''
    }
  }

  return snapshot.val() as Perfil
}

/**
 * Cria ou inicializa os dados do perfil do usuário autenticado.
 */
export async function criarPerfil(
  dados: Omit<Perfil, 'id'>
): Promise<Perfil> {
  const usuario = auth.currentUser

  if (!usuario) {
    throw new Error('Você precisa estar autenticado para criar o perfil.')
  }

  const perfil: Perfil = {
    ...dados,
    id: usuario.uid,
    email: dados.email || usuario.email || ''
  }

  const referencia = ref(db, obterCaminhoPerfil())
  await set(referencia, perfil)

  return perfil
}

/**
 * Atualiza os campos do perfil do usuário autenticado.
 */
export async function atualizarPerfil(
  dados: Partial<Perfil>
): Promise<void> {
  const referencia = ref(db, obterCaminhoPerfil())
  const snapshot = await get(referencia)

  if (!snapshot.exists()) {
    // Se ainda não existir o nó de perfil, cria um novo
    await criarPerfil({
      nome: dados.nome ?? '',
      email: dados.email ?? auth.currentUser?.email ?? '',
      ...dados
    })
    return
  }

  await update(referencia, dados)
}

/**
 * Exclui/reseta os dados do perfil do usuário autenticado no banco.
 */
export async function excluirPerfil(): Promise<void> {
  const referencia = ref(db, obterCaminhoPerfil())
  const snapshot = await get(referencia)

  if (!snapshot.exists()) {
    throw new Error('Perfil não encontrado.')
  }

  await remove(referencia)
}
