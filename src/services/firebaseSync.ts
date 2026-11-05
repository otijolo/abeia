import { get, ref, set } from 'firebase/database'
import { auth, db } from './firebase'
import {
  apiarios as mockApiarios,
  colmeias as mockColmeias,
  inspecoes as mockInspecoes,
  alertas as mockAlertas,
  producoes as mockProducoes,
  perfilInicial as mockPerfil
} from '../data/mock'

/**
 * Garante que a conta do usuário no Firebase Realtime Database possua os dados iniciais
 * caso seja um cadastro novo ou ainda não possua apiários cadastrados.
 */
export async function garantirDadosIniciaisFirebase(uid: string): Promise<void> {
  try {
    const userRef = ref(db, `usuarios/${uid}`)
    const snap = await get(userRef)

    const dados = snap.val()

    // Se o usuário ainda não tiver apiários cadastrados, inicializa com o dataset de demonstração
    if (!dados || !dados.apiarios || Object.keys(dados.apiarios).length === 0) {
      const apiariosMap: Record<string, unknown> = {}
      mockApiarios.forEach((a) => {
        apiariosMap[a.id] = a
      })

      const colmeiasMap: Record<string, unknown> = {}
      mockColmeias.forEach((c) => {
        colmeiasMap[c.id] = c
      })

      const inspecoesMap: Record<string, unknown> = {}
      mockInspecoes.forEach((i) => {
        inspecoesMap[i.id] = i
      })

      const alertasMap: Record<string, unknown> = {}
      mockAlertas.forEach((al) => {
        alertasMap[al.id] = al
      })

      const producoesMap: Record<string, unknown> = {}
      mockProducoes.forEach((p) => {
        producoesMap[p.id] = p
      })

      const perfilObj = {
        ...mockPerfil,
        id: uid,
        nome: auth.currentUser?.displayName || mockPerfil.nome,
        email: auth.currentUser?.email || mockPerfil.email,
        iniciais: auth.currentUser?.displayName
          ? auth.currentUser.displayName
              .split(/\s+/)
              .map((p) => p[0])
              .slice(0, 2)
              .join('')
              .toUpperCase()
          : mockPerfil.iniciais
      }

      await set(userRef, {
        ...(dados || {}),
        apiarios: apiariosMap,
        colmeias: colmeiasMap,
        inspecoes: inspecoesMap,
        alertas: alertasMap,
        producoes: producoesMap,
        perfil: perfilObj,
        email: auth.currentUser?.email || '',
        atualizadoEm: new Date().toISOString()
      })
    }
  } catch (err) {
    console.warn('Não foi possível verificar/semear dados iniciais no Firebase:', err)
  }
}
