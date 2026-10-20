import {
  get,
  push,
  ref,
  set,
  update,
  remove
} from 'firebase/database'

import { auth, db } from './firebase'
import type { Producao } from '../data/types'

type NovaProducao = Omit<Producao, 'id'>

/**
 * Retorna o caminho das produções do usuário autenticado.
 */
function obterCaminhoProducoes(): string {
  const usuario = auth.currentUser

  if (!usuario) {
    throw new Error(
      'Você precisa estar autenticado para acessar as produções.'
    )
  }

  return `usuarios/${usuario.uid}/producoes`
}

/**
 * Lista todas as produções cadastradas pelo usuário autenticado.
 */
export async function listarProducoes(): Promise<Producao[]> {
  const referencia = ref(db, obterCaminhoProducoes())
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
 * Lista todas as produções de uma colmeia específica.
 */
export async function listarProducoesDaColmeia(
  colmeiaId: string
): Promise<Producao[]> {
  const producoes = await listarProducoes()
  return producoes.filter((p) => p.colmeiaId === colmeiaId)
}

/**
 * Busca uma produção pelo ID.
 */
export async function buscarProducao(
  id: string
): Promise<Producao | null> {
  const referencia = ref(
    db,
    `${obterCaminhoProducoes()}/${id}`
  )

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
 * Cadastra uma nova produção no Firebase.
 */
export async function criarProducao(
  dados: NovaProducao
): Promise<Producao> {
  const referencia = push(ref(db, obterCaminhoProducoes()))

  if (!referencia.key) {
    throw new Error('Não foi possível gerar o ID da produção.')
  }

  const producao: Producao = {
    ...dados,
    id: referencia.key
  }

  await set(referencia, producao)

  return producao
}

/**
 * Atualiza os campos de uma produção existente.
 */
export async function atualizarProducao(
  id: string,
  dados: Partial<Omit<Producao, 'id'>>
): Promise<void> {
  const referencia = ref(
    db,
    `${obterCaminhoProducoes()}/${id}`
  )

  const snapshot = await get(referencia)

  if (!snapshot.exists()) {
    throw new Error('Produção não encontrada.')
  }

  await update(referencia, dados)
}

/**
 * Exclui um registro de produção existente.
 */
export async function excluirProducao(
  id: string
): Promise<void> {
  const referencia = ref(
    db,
    `${obterCaminhoProducoes()}/${id}`
  )

  const snapshot = await get(referencia)

  if (!snapshot.exists()) {
    throw new Error('Produção não encontrada.')
  }

  await remove(referencia)
}
