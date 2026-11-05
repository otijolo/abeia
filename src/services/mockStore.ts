import {
  apiarios as mockApiarios,
  colmeias as mockColmeias,
  inspecoes as mockInspecoes,
  alertas as mockAlertas,
  producoes as mockProducoes,
  perfilInicial as mockPerfil
} from '../data/mock'
import type {
  Apiario,
  Colmeia,
  Inspecao,
  Alerta,
  Producao,
  Perfil,
  AlertaEstado
} from '../data/types'
import { ApiError } from './api'

const STORAGE_KEY = 'abeia_local_store_v2'

interface StoreData {
  apiarios: Apiario[]
  colmeias: Colmeia[]
  inspecoes: Inspecao[]
  alertas: Alerta[]
  producoes: Producao[]
  perfis: Record<string, Perfil>
}

function carregarDadosIniciais(): StoreData {
  return {
    apiarios: [...mockApiarios],
    colmeias: [...mockColmeias],
    inspecoes: [...mockInspecoes],
    alertas: [...mockAlertas],
    producoes: [...mockProducoes],
    perfis: {
      'usr-1': { ...mockPerfil }
    }
  }
}

function obterStore(): StoreData {
  try {
    const salvo = localStorage.getItem(STORAGE_KEY)
    if (salvo) {
      const parsed = JSON.parse(salvo) as StoreData
      if (
        Array.isArray(parsed.apiarios) &&
        Array.isArray(parsed.colmeias) &&
        Array.isArray(parsed.alertas) &&
        Array.isArray(parsed.producoes)
      ) {
        return parsed
      }
    }
  } catch {
    // Ignora e usa dados padrão
  }

  const inicial = carregarDadosIniciais()
  salvarStore(inicial)
  return inicial
}

function salvarStore(store: StoreData) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store))
  } catch {
    // Falha silenciosa em ambientes restritos de armazenamento
  }
}

function gerarId(): string {
  return 'id-' + Math.random().toString(36).substring(2, 9) + Date.now().toString(36)
}

/**
 * Roteia requisições localmente quando o backend Spring Boot estiver indisponível.
 * Garante que a apresentação e todos os fluxos de tela funcionem sem falhas.
 */
export async function handleLocalMockRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const method = (options.method || 'GET').toUpperCase()
  const [caminho, queryString] = endpoint.split('?')
  const partes = caminho.replace(/^\/+|\/+$/g, '').split('/')
  const params = new URLSearchParams(queryString || '')
  const corpo = options.body ? JSON.parse(options.body as string) : null

  const store = obterStore()

  // 1. APIÁRIOS: /apiarios
  if (partes[0] === 'apiarios') {
    if (partes.length === 1) {
      if (method === 'GET') {
        return store.apiarios as unknown as T
      }
      if (method === 'POST') {
        const novo: Apiario = {
          id: corpo.id || gerarId(),
          nome: corpo.nome || '',
          cidade: corpo.cidade || '',
          uf: corpo.uf || 'CE',
          descricao: corpo.descricao || '',
          vegetacao: corpo.vegetacao || '',
          fonteAgua: Boolean(corpo.fonteAgua),
          latitude: corpo.latitude || '',
          longitude: corpo.longitude || '',
          observacoes: corpo.observacoes || '',
          totalColmeias: corpo.totalColmeias ?? 0,
          status: corpo.status || 'normal'
        }
        store.apiarios.unshift(novo)
        salvarStore(store)
        return novo as unknown as T
      }
    }

    if (partes.length === 2) {
      const id = decodeURIComponent(partes[1])
      const index = store.apiarios.findIndex((a) => a.id === id)

      if (method === 'GET') {
        if (index === -1) throw new ApiError(404, 'Apiário não encontrado.')
        return store.apiarios[index] as unknown as T
      }
      if (method === 'PUT') {
        if (index === -1) throw new ApiError(404, 'Apiário não encontrado.')
        const atualizado = { ...store.apiarios[index], ...corpo, id }
        store.apiarios[index] = atualizado
        salvarStore(store)
        return atualizado as unknown as T
      }
      if (method === 'DELETE') {
        if (index !== -1) {
          store.apiarios.splice(index, 1)
          salvarStore(store)
        }
        return null as unknown as T
      }
    }
  }

  // 2. COLMEIAS: /colmeias
  if (partes[0] === 'colmeias') {
    if (partes.length === 1) {
      if (method === 'GET') {
        const apiarioId = params.get('apiarioId')
        if (apiarioId) {
          return store.colmeias.filter(
            (c) => c.apiarioId === apiarioId
          ) as unknown as T
        }
        return store.colmeias as unknown as T
      }
      if (method === 'POST') {
        const nova: Colmeia = {
          id: corpo.id || gerarId(),
          nome: corpo.nome || '',
          apiarioId: corpo.apiarioId || '',
          tipo: corpo.tipo || 'Langstroth',
          posicao: corpo.posicao || '',
          instaladaEm: corpo.instaladaEm || '',
          observacoes: corpo.observacoes || '',
          status: corpo.status || 'normal',
          prazoInspecao: corpo.prazoInspecao || 'Dentro do prazo',
          resumoInspecao: corpo.resumoInspecao || 'Inspeção em dia',
          producaoPeriodoKg: corpo.producaoPeriodoKg ?? 0,
          problemas: corpo.problemas || []
        }
        store.colmeias.unshift(nova)

        // Atualiza contagem no apiário
        const ap = store.apiarios.find((a) => a.id === nova.apiarioId)
        if (ap) {
          ap.totalColmeias = store.colmeias.filter(
            (c) => c.apiarioId === ap.id
          ).length
        }

        salvarStore(store)
        return nova as unknown as T
      }
    }

    if (partes.length === 2) {
      const id = decodeURIComponent(partes[1])
      const index = store.colmeias.findIndex((c) => c.id === id)

      if (method === 'GET') {
        if (index === -1) throw new ApiError(404, 'Colmeia não encontrada.')
        return store.colmeias[index] as unknown as T
      }
      if (method === 'PUT') {
        if (index === -1) throw new ApiError(404, 'Colmeia não encontrada.')
        const atualizada = { ...store.colmeias[index], ...corpo, id }
        store.colmeias[index] = atualizada
        salvarStore(store)
        return atualizada as unknown as T
      }
      if (method === 'DELETE') {
        if (index !== -1) {
          const removida = store.colmeias.splice(index, 1)[0]
          const ap = store.apiarios.find((a) => a.id === removida.apiarioId)
          if (ap) {
            ap.totalColmeias = store.colmeias.filter(
              (c) => c.apiarioId === ap.id
            ).length
          }
          salvarStore(store)
        }
        return null as unknown as T
      }
    }
  }

  // 3. INSPEÇÕES: /inspecoes
  if (partes[0] === 'inspecoes') {
    if (partes.length === 1) {
      if (method === 'GET') {
        const colmeiaId = params.get('colmeiaId')
        if (colmeiaId) {
          return store.inspecoes.filter(
            (i) => i.colmeiaId === colmeiaId
          ) as unknown as T
        }
        return store.inspecoes as unknown as T
      }
      if (method === 'POST') {
        const nova: Inspecao = {
          id: corpo.id || gerarId(),
          colmeiaId: corpo.colmeiaId || '',
          data: corpo.data || new Date().toLocaleDateString('pt-BR'),
          resumo: corpo.resumo || 'Inspeção realizada',
          status: corpo.status || 'normal',
          forcaColonia: corpo.forcaColonia || 'Média',
          rainhaObservada: Boolean(corpo.rainhaObservada),
          quadrosAbelhas: corpo.quadrosAbelhas ?? 0,
          quadrosCria: corpo.quadrosCria ?? 0,
          postura: corpo.postura || 'Padrão',
          pragas: corpo.pragas || [],
          observacoes: corpo.observacoes || ''
        }
        store.inspecoes.unshift(nova)

        // Atualiza status e resumo na colmeia
        const c = store.colmeias.find((col) => col.id === nova.colmeiaId)
        if (c) {
          c.status = nova.status
          c.resumoInspecao = nova.resumo
          c.ultimaInspecao = {
            resumo: nova.resumo,
            detalhes: [
              `${nova.quadrosCria} quadros com cria`,
              ...(nova.pragas.length > 0 ? nova.pragas : ['Sem pragas'])
            ],
            saude:
              nova.status === 'normal'
                ? 'Saudável'
                : nova.status === 'atencao'
                  ? 'Atenção'
                  : 'Crítico'
          }
        }

        salvarStore(store)
        return nova as unknown as T
      }
    }

    if (partes.length === 2) {
      const id = decodeURIComponent(partes[1])
      const inspecao = store.inspecoes.find((i) => i.id === id)
      if (method === 'GET') {
        if (!inspecao) throw new ApiError(404, 'Inspeção não encontrada.')
        return inspecao as unknown as T
      }
    }
  }

  // 4. ALERTAS: /alertas
  if (partes[0] === 'alertas') {
    if (partes.length === 1) {
      if (method === 'GET') {
        return store.alertas as unknown as T
      }
      if (method === 'POST') {
        const novo: Alerta = {
          id: corpo.id || gerarId(),
          titulo: corpo.titulo || '',
          tituloDetalhe: corpo.tituloDetalhe || corpo.titulo || '',
          origem: corpo.origem || 'Apiário',
          quando: corpo.quando || 'Hoje',
          data: corpo.data || new Date().toLocaleDateString('pt-BR'),
          status: corpo.status || 'atencao',
          estado: (corpo.estado as AlertaEstado) || 'ativo',
          motivo: corpo.motivo || '',
          afetados: Array.isArray(corpo.afetados) ? corpo.afetados : [],
          colmeiaId: corpo.colmeiaId || undefined
        }
        store.alertas.unshift(novo)
        salvarStore(store)
        return novo as unknown as T
      }
    }

    if (partes.length >= 2) {
      const id = decodeURIComponent(partes[1])
      const index = store.alertas.findIndex((a) => a.id === id)

      if (partes.length === 2) {
        if (method === 'GET') {
          if (index === -1) throw new ApiError(404, 'Alerta não encontrado.')
          return store.alertas[index] as unknown as T
        }
        if (method === 'PUT') {
          if (index === -1) throw new ApiError(404, 'Alerta não encontrado.')
          const atualizado = { ...store.alertas[index], ...corpo, id }
          store.alertas[index] = atualizado
          salvarStore(store)
          return atualizado as unknown as T
        }
        if (method === 'DELETE') {
          if (index !== -1) {
            store.alertas.splice(index, 1)
            salvarStore(store)
          }
          return null as unknown as T
        }
      }

      if (partes.length === 3 && partes[2] === 'estado') {
        if (method === 'PATCH') {
          if (index === -1) throw new ApiError(404, 'Alerta não encontrado.')
          store.alertas[index].estado = corpo.estado
          salvarStore(store)
          return store.alertas[index] as unknown as T
        }
      }
    }
  }

  // 5. PRODUÇÕES: /producoes
  if (partes[0] === 'producoes') {
    if (partes.length === 1) {
      if (method === 'GET') {
        return store.producoes as unknown as T
      }
      if (method === 'POST') {
        const nova: Producao = {
          id: corpo.id || gerarId(),
          colmeiaId: corpo.colmeiaId || '',
          data: corpo.data || new Date().toLocaleDateString('pt-BR'),
          quantidade: Number(corpo.quantidade) || 0,
          unidade: corpo.unidade || 'kg',
          observacoes: corpo.observacoes || ''
        }
        store.producoes.unshift(nova)
        salvarStore(store)
        return nova as unknown as T
      }
    }

    if (partes.length === 2) {
      const id = decodeURIComponent(partes[1])
      const index = store.producoes.findIndex((p) => p.id === id)

      if (method === 'GET') {
        if (index === -1) throw new ApiError(404, 'Produção não encontrada.')
        return store.producoes[index] as unknown as T
      }
      if (method === 'PUT') {
        if (index === -1) throw new ApiError(404, 'Produção não encontrada.')
        const atualizada = { ...store.producoes[index], ...corpo, id }
        store.producoes[index] = atualizada
        salvarStore(store)
        return atualizada as unknown as T
      }
      if (method === 'DELETE') {
        if (index !== -1) {
          store.producoes.splice(index, 1)
          salvarStore(store)
        }
        return null as unknown as T
      }
    }

    if (partes.length === 3 && partes[1] === 'colmeia') {
      const colmeiaId = decodeURIComponent(partes[2])
      if (method === 'GET') {
        return store.producoes.filter(
          (p) => p.colmeiaId === colmeiaId
        ) as unknown as T
      }
    }
  }

  // 6. PERFIL: /perfil
  if (partes[0] === 'perfil') {
    const uid = partes[1] ? decodeURIComponent(partes[1]) : 'usr-1'

    if (method === 'GET') {
      const perfil = store.perfis[uid] || store.perfis['usr-1']
      if (!perfil) return null as unknown as T
      return perfil as unknown as T
    }

    if (method === 'POST' || method === 'PUT') {
      const existente = store.perfis[uid] || store.perfis['usr-1']
      const atualizado: Perfil = {
        id: uid,
        nome: corpo.nome ?? existente?.nome ?? '',
        email: corpo.email ?? existente?.email ?? '',
        telefone: corpo.telefone ?? existente?.telefone ?? '',
        iniciais: corpo.iniciais ?? existente?.iniciais ?? 'U'
      }
      store.perfis[uid] = atualizado
      salvarStore(store)
      return atualizado as unknown as T
    }

    if (method === 'DELETE') {
      delete store.perfis[uid]
      salvarStore(store)
      return null as unknown as T
    }
  }

  // 7. DEMO: /demo
  if (partes[0] === 'demo') {
    if (partes[1] === 'seed') {
      const inicial = carregarDadosIniciais()
      salvarStore(inicial)
      return { mensagem: 'Dados de demonstração inseridos com sucesso!' } as unknown as T
    }
    if (partes[1] === 'reset') {
      const vazio: StoreData = {
        apiarios: [],
        colmeias: [],
        inspecoes: [],
        alertas: [],
        producoes: [],
        perfis: {}
      }
      salvarStore(vazio)
      return { mensagem: 'Todos os dados foram resetados!' } as unknown as T
    }
  }

  // Fallback genérico caso a rota não seja mapeada
  console.warn(`[abeia-mock] Rota não tratada: ${method} ${endpoint}`)
  return null as unknown as T
}
