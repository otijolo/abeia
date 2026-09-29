export type Status = 'normal' | 'atencao' | 'critico'

export interface User {
  nome: string
  email: string
  iniciais: string
}

export interface Apiario {
  id: string
  nome: string
  cidade: string
  uf: string
  descricao: string
  vegetacao: string
  fonteAgua: boolean
  latitude: string
  longitude: string
  observacoes: string
  totalColmeias: number
  status: Status
}

export interface Colmeia {
  id: string
  nome: string
  apiarioId: string
  tipo: string
  posicao: string
  instaladaEm: string
  observacoes: string
  status: Status
  /** Texto curto exibido nas listas (ex.: "Em 3 dias", "Atrasada") */
  prazoInspecao: string
  /** Texto exibido na lista do apiário (ex.: "Inspeção daqui 3 dias") */
  resumoInspecao: string
  producaoPeriodoKg: number
  ultimaInspecao?: {
    resumo: string
    detalhes: string[]
    saude: string
  }
  problemas: string[]
}

export interface Inspecao {
  id: string
  colmeiaId: string
  data: string
  resumo: string
  status: Status
  forcaColonia: string
  rainhaObservada: boolean
  quadrosAbelhas: number
  quadrosCria: number
  postura: string
  pragas: string[]
  observacoes: string
}

export type AlertaEstado = 'ativo' | 'resolvido' | 'ignorado'

export interface Alerta {
  id: string
  titulo: string
  tituloDetalhe: string
  origem: string
  quando: string
  data: string
  status: Status
  estado: AlertaEstado
  motivo: string
  afetados: string[]
  colmeiaId?: string
}

export interface ProducaoMensal {
  mes: string
  kg: number
}
