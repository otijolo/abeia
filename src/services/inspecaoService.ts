
import { get, push, ref, update } from 'firebase/database'

import { auth, db } from './firebase'
import type { Inspecao, Status } from '../data/types'

type NovaInspecao = Omit<Inspecao, 'id'>

/**
 * Retorna o caminho dos dados do usuário autenticado.
 */
function obterCaminhoUsuario(): string {
  const usuario = auth.currentUser

  if (!usuario) {
    throw new Error(
      'Você precisa estar autenticado para acessar as inspeções.'
    )
  }

  return `usuarios/${usuario.uid}`
}

/**
 * Registra uma inspeção no Firebase e atualiza o resumo da colmeia.
 */
export async function criarInspecao(
  dados: NovaInspecao
): Promise<Inspecao> {
  const caminhoUsuario = obterCaminhoUsuario()

  const referenciaColmeia = ref(
    db,
    `${caminhoUsuario}/colmeias/${dados.colmeiaId}`
  )

  const snapshotColmeia = await get(referenciaColmeia)

  if (!snapshotColmeia.exists()) {
    throw new Error('A colmeia selecionada não foi encontrada.')
  }

  const referenciaInspecao = push(
    ref(db, `${caminhoUsuario}/inspecoes`)
  )

  if (!referenciaInspecao.key) {
    throw new Error('Não foi possível gerar o ID da inspeção.')
  }

  const inspecao: Inspecao = {
    ...dados,
    id: referenciaInspecao.key
  }

  const status: Status = inspecao.status

  const ultimaInspecao = {
    resumo: inspecao.resumo,
    detalhes: [
      `Força da colônia: ${inspecao.forcaColonia}`,
      `Qualidade da postura: ${inspecao.postura}`,
      `Quadros com abelhas: ${inspecao.quadrosAbelhas}`,
      `Quadros com cria: ${inspecao.quadrosCria}`,
      `Rainha observada: ${inspecao.rainhaObservada ? 'Sim' : 'Não'}`
    ],
    saude:
      status === 'normal'
        ? 'Saudável'
        : status === 'atencao'
          ? 'Atenção necessária'
          : 'Estado crítico'
  }

  const atualizacoes: Record<string, unknown> = {
    [`inspecoes/${inspecao.id}`]: inspecao,
    [`colmeias/${inspecao.colmeiaId}/status`]: status,
    [`colmeias/${inspecao.colmeiaId}/ultimaInspecao`]: ultimaInspecao
  }

  await update(ref(db, caminhoUsuario), atualizacoes)

  return inspecao
}

/**
 * Lista as inspeções de uma colmeia específica.
 * Ordena da mais recente para a mais antiga.
 */
export async function listarInspecoesDaColmeia(
  colmeiaId: string
): Promise<Inspecao[]> {
  const caminhoUsuario = obterCaminhoUsuario()

  const referenciaInspecoes = ref(
    db,
    `${caminhoUsuario}/inspecoes`
  )

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
    .filter(inspecao => inspecao.colmeiaId === colmeiaId)
    .sort((a, b) => b.data.localeCompare(a.data))
}

/**
 * Busca uma inspeção específica no Firebase.
 */
export async function buscarInspecao(
  id: string
): Promise<Inspecao | null> {
  const caminhoUsuario = obterCaminhoUsuario()

  const referenciaInspecao = ref(
    db,
    `${caminhoUsuario}/inspecoes/${id}`
  )

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
