import { get, push, ref, update } from 'firebase/database'
import { auth, db } from './firebase'
import { garantirDadosIniciaisFirebase } from './firebaseSync'
import { handleLocalMockRequest } from './mockStore'
import type { Inspecao, Status } from '../data/types'

type NovaInspecao = Omit<Inspecao, 'id'>

function obterCaminhoUsuario(): string | null {
  const usuario = auth.currentUser
  if (!usuario) return null
  return `usuarios/${usuario.uid}`
}

/**
 * Registra uma inspeção no Firebase Realtime Database e atualiza a colmeia.
 */
export async function criarInspecao(dados: NovaInspecao): Promise<Inspecao> {
  const caminhoUsuario = obterCaminhoUsuario()
  if (!caminhoUsuario || !auth.currentUser) {
    return handleLocalMockRequest<Inspecao>('/inspecoes', {
      method: 'POST',
      body: JSON.stringify(dados)
    })
  }

  const referenciaInspecao = push(ref(db, `${caminhoUsuario}/inspecoes`))
  if (!referenciaInspecao.key) {
    throw new Error('Não foi possível gerar a chave da inspeção no Firebase.')
  }

  const inspecao: Inspecao = {
    ...dados,
    id: referenciaInspecao.key
  }

  const status: Status = inspecao.status

  const ultimaInspecao = {
    resumo: inspecao.resumo,
    detalhes: [
      `${inspecao.quadrosCria} quadros com cria`,
      ...(inspecao.pragas && inspecao.pragas.length > 0 ? inspecao.pragas : ['Sem sinais de pragas'])
    ],
    saude:
      status === 'normal'
        ? 'Saudável'
        : status === 'atencao'
          ? 'Atenção'
          : 'Crítico'
  }

  const atualizacoes: Record<string, unknown> = {
    [`inspecoes/${inspecao.id}`]: inspecao,
    [`colmeias/${inspecao.colmeiaId}/status`]: status,
    [`colmeias/${inspecao.colmeiaId}/resumoInspecao`]: inspecao.resumo,
    [`colmeias/${inspecao.colmeiaId}/ultimaInspecao`]: ultimaInspecao
  }

  await update(ref(db, caminhoUsuario), atualizacoes)
  return inspecao
}

/**
 * Lista as inspeções de uma colmeia específica no Firebase Realtime Database.
 */
export async function listarInspecoesDaColmeia(
  colmeiaId: string
): Promise<Inspecao[]> {
  const caminhoUsuario = obterCaminhoUsuario()
  if (!caminhoUsuario || !auth.currentUser) {
    return handleLocalMockRequest<Inspecao[]>(`/inspecoes?colmeiaId=${encodeURIComponent(colmeiaId)}`, {
      method: 'GET'
    })
  }

  await garantirDadosIniciaisFirebase(auth.currentUser.uid)

  const referenciaInspecoes = ref(db, `${caminhoUsuario}/inspecoes`)
  const snapshot = await get(referenciaInspecoes)

  if (!snapshot.exists()) {
    return []
  }

  const dados = snapshot.val() as Record<string, Omit<Inspecao, 'id'> & { id?: string }>
  return Object.entries(dados)
    .map(([id, inspecao]) => ({
      ...inspecao,
      id
    }))
    .filter((inspecao) => inspecao.colmeiaId === colmeiaId)
}

/**
 * Busca uma inspeção específica no Firebase.
 */
export async function buscarInspecao(id: string): Promise<Inspecao | null> {
  const caminhoUsuario = obterCaminhoUsuario()
  if (!caminhoUsuario) {
    try {
      return await handleLocalMockRequest<Inspecao>(`/inspecoes/${id}`, { method: 'GET' })
    } catch {
      return null
    }
  }

  const referenciaInspecao = ref(db, `${caminhoUsuario}/inspecoes/${id}`)
  const snapshot = await get(referenciaInspecao)

  if (!snapshot.exists()) {
    return null
  }

  const dados = snapshot.val() as Omit<Inspecao, 'id'>
  return {
    ...dados,
    id
  }
}
