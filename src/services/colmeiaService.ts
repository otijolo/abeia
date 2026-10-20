
import {
  get,
  push,
  ref,
  set,
  update,
remove
} from 'firebase/database'

import { auth, db } from './firebase'
import type { Colmeia } from '../data/types'

function obterCaminhoColmeias(): string {
  const usuario = auth.currentUser

  if (!usuario) {
    throw new Error(
      'Você precisa estar autenticado para acessar as colmeias.'
    )
  }

  return `usuarios/${usuario.uid}/colmeias`
}

/** Lista as colmeias do usuário autenticado. */
export async function listarColmeias(): Promise<Colmeia[]> {
  const referencia = ref(db, obterCaminhoColmeias())
  const snapshot = await get(referencia)

  if (!snapshot.exists()) {
    return []
  }

  const dados = snapshot.val() as Record<string, Omit<Colmeia, 'id'>>

  return Object.entries(dados).map(([id, colmeia]) => ({
    ...colmeia,
    id
  }))
}

/** Busca uma colmeia pelo ID. */
export async function buscarColmeia(
  id: string
): Promise<Colmeia | null> {
  const referencia = ref(
    db,
    `${obterCaminhoColmeias()}/${id}`
  )

  const snapshot = await get(referencia)

  if (!snapshot.exists()) {
    return null
  }

  return {
    ...snapshot.val(),
    id
  } as Colmeia
}

/** Cadastra uma nova colmeia. */
export async function criarColmeia(
  dados: Omit<Colmeia, 'id'>
): Promise<Colmeia> {
  const referencia = push(ref(db, obterCaminhoColmeias()))

  if (!referencia.key) {
    throw new Error('Não foi possível gerar o ID da colmeia.')
  }

  const colmeia: Colmeia = {
    ...dados,
    id: referencia.key
  }

  await set(referencia, colmeia)

  return colmeia
}

/** Atualiza os campos de uma colmeia existente. */
export async function atualizarColmeia(
  id: string,
  dados: Partial<Omit<Colmeia, 'id'>>
): Promise<void> {
  const referencia = ref(
    db,
    `${obterCaminhoColmeias()}/${id}`
  )

  const snapshot = await get(referencia)

  if (!snapshot.exists()) {
    throw new Error('Colmeia não encontrada.')
  }

  await update(referencia, dados)
}

/** Exclui uma colmeia do usuário autenticado. */
export async function excluirColmeia(
  id: string
): Promise<void> {
  const referencia = ref(
    db,
    `${obterCaminhoColmeias()}/${id}`
  )

  const snapshot = await get(referencia)

  if (!snapshot.exists()) {
    throw new Error('Colmeia não encontrada.')
  }

  await remove(referencia)
}
