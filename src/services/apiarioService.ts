
import {
  get,
  push,
  ref,
  set,
  update,
  remove
} from 'firebase/database'

import { auth, db } from './firebase'
import type { Apiario } from '../data/types'

type NovoApiario = Omit<
  Apiario,
  'id' | 'totalColmeias' | 'status'
> & Partial<Pick<Apiario, 'totalColmeias' | 'status'>>

/**
 * Retorna o caminho dos apiários do usuário autenticado.
 */
function obterCaminhoApiarios(): string {
  const usuario = auth.currentUser

  if (!usuario) {
    throw new Error(
      'Você precisa estar autenticado para acessar os apiários.'
    )
  }

  return `usuarios/${usuario.uid}/apiarios`
}

/**
 * Lista todos os apiários do usuário autenticado.
 */
export async function listarApiarios(): Promise<Apiario[]> {
  const referencia = ref(db, obterCaminhoApiarios())
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
 * Busca um apiário pelo ID.
 */
export async function buscarApiario(
  id: string
): Promise<Apiario | null> {
  const referencia = ref(
    db,
    `${obterCaminhoApiarios()}/${id}`
  )

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
 * Cadastra um novo apiário.
 */
export async function criarApiario(
  dados: NovoApiario
): Promise<Apiario> {
  const referencia = push(ref(db, obterCaminhoApiarios()))

  if (!referencia.key) {
    throw new Error('Não foi possível gerar o ID do apiário.')
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
 * Atualiza os campos enviados de um apiário existente.
 */
export async function atualizarApiario(
  id: string,
  dados: Partial<Omit<Apiario, 'id'>>
): Promise<void> {
  const referencia = ref(
    db,
    `${obterCaminhoApiarios()}/${id}`
  )

  const snapshot = await get(referencia)

  if (!snapshot.exists()) {
    throw new Error('Apiário não encontrado.')
  }

  await update(referencia, dados)
}

/**
 * Exclui um apiário existente.
 */
export async function excluirApiario(
  id: string
): Promise<void> {
  const referencia = ref(
    db,
    `${obterCaminhoApiarios()}/${id}`
  )

  const snapshot = await get(referencia)

  if (!snapshot.exists()) {
    throw new Error('Apiário não encontrado.')
  }

  await remove(referencia)
}
