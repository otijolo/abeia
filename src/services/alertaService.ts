import {
  get,
  push,
  ref,
  set,
  update,
  remove
} from 'firebase/database'

import { auth, db } from './firebase'
import type { Alerta, AlertaEstado } from '../data/types'

type NovoAlerta = Omit<Alerta, 'id' | 'estado'> &
  Partial<Pick<Alerta, 'estado'>>

/**
 * Retorna o caminho dos alertas do usuário autenticado.
 */
function obterCaminhoAlertas(): string {
  const usuario = auth.currentUser

  if (!usuario) {
    throw new Error(
      'Você precisa estar autenticado para acessar os alertas.'
    )
  }

  return `usuarios/${usuario.uid}/alertas`
}

/**
 * Lista todos os alertas do usuário autenticado.
 */
export async function listarAlertas(): Promise<Alerta[]> {
  const referencia = ref(db, obterCaminhoAlertas())
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
 * Busca um alerta pelo ID.
 */
export async function buscarAlerta(
  id: string
): Promise<Alerta | null> {
  const referencia = ref(
    db,
    `${obterCaminhoAlertas()}/${id}`
  )

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
 * Cadastra um novo alerta no Firebase.
 */
export async function criarAlerta(
  dados: NovoAlerta
): Promise<Alerta> {
  const referencia = push(ref(db, obterCaminhoAlertas()))

  if (!referencia.key) {
    throw new Error('Não foi possível gerar o ID do alerta.')
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
 * Atualiza os campos de um alerta existente.
 */
export async function atualizarAlerta(
  id: string,
  dados: Partial<Omit<Alerta, 'id'>>
): Promise<void> {
  const referencia = ref(
    db,
    `${obterCaminhoAlertas()}/${id}`
  )

  const snapshot = await get(referencia)

  if (!snapshot.exists()) {
    throw new Error('Alerta não encontrado.')
  }

  await update(referencia, dados)
}

/**
 * Exclui um alerta existente.
 */
export async function excluirAlerta(
  id: string
): Promise<void> {
  const referencia = ref(
    db,
    `${obterCaminhoAlertas()}/${id}`
  )

  const snapshot = await get(referencia)

  if (!snapshot.exists()) {
    throw new Error('Alerta não encontrado.')
  }

  await remove(referencia)
}

/**
 * Altera o estado de um alerta ('ativo' | 'resolvido' | 'ignorado').
 */
export async function atualizarEstadoAlerta(
  id: string,
  estado: AlertaEstado
): Promise<void> {
  await atualizarAlerta(id, { estado })
}
