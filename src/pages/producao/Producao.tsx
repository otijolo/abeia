import { useEffect, useState } from 'react'
import { TrophyIcon } from '../../components/icons'
import { Columns, Screen, Stack } from '../../components/layout/Screen'
import { BarChart } from '../../components/ui/BarChart'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { FilterDropdown } from '../../components/ui/FilterDropdown'
import { IconBubble } from '../../components/ui/IconBubble'
import { ListCard, ListStack } from '../../components/ui/ListCard'
import { SectionTitle } from '../../components/ui/SectionTitle'
import { StatusBadge } from '../../components/ui/StatusBadge'
import {
  apiarios as mockApiarios,
  colmeias as mockColmeias,
  findColmeia,
  producaoMensal,
  producaoResumo
} from '../../data/mock'
import { listarProducoes } from '../../services/producaoService'
import { listarColmeias } from '../../services/colmeiaService'
import { listarApiarios } from '../../services/apiarioService'
import type { Apiario, Colmeia, Producao as ProducaoType } from '../../data/types'
import { Actions } from '../shared/Actions'
import styles from './Producao.module.css'

const podio = ['honey', 'silver', 'bronze'] as const
const periodos = ['Últimos 30 dias', 'Últimos 6 meses', 'Este ano']

/** Tela de Produção */
export function Producao() {
  const [periodo, setPeriodo] = useState('')
  const [apiario, setApiario] = useState('')
  const [colmeia, setColmeia] = useState('')

  const [producoes, setProducoes] = useState<ProducaoType[]>([])
  const [colmeias, setColmeias] = useState<Colmeia[]>([])
  const [apiarios, setApiarios] = useState<Apiario[]>([])
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    let ativo = true

    async function carregarDados() {
      try {
        setCarregando(true)
        const [dadosProducoes, dadosColmeias, dadosApiarios] = await Promise.all([
          listarProducoes().catch(() => []),
          listarColmeias().catch(() => []),
          listarApiarios().catch(() => [])
        ])

        if (ativo) {
          setProducoes(dadosProducoes)
          setColmeias(dadosColmeias.length > 0 ? dadosColmeias : mockColmeias)
          setApiarios(dadosApiarios.length > 0 ? dadosApiarios : mockApiarios)
        }
      } catch (err) {
        console.error('Erro ao carregar dados de produção:', err)
      } finally {
        if (ativo) {
          setCarregando(false)
        }
      }
    }

    void carregarDados()

    return () => {
      ativo = false
    }
  }, [])

  // Calcula total em kg se houver produções registradas pelo usuário
  const totalKg =
    producoes.length > 0
      ? producoes.reduce((acc, p) => acc + (Number(p.quantidade) || 0), 0)
      : producaoResumo.totalKg

  // Ranking com fallback para mock caso ainda não tenha colmeias suficientes
  const rankingColmeias =
    producaoResumo.ranking
      .map((id) => colmeias.find((c) => c.id === id) || findColmeia(id))
      .filter((c): c is Colmeia => Boolean(c))

  return (
    <Screen title="Produção" nav="producao">
      <div className={styles.filters}>
        <Columns gap={12} count={3}>
          <FilterDropdown label="Período" options={periodos} value={periodo} onChange={setPeriodo} />
          <FilterDropdown
            label="Apiário"
            options={apiarios.map((a) => a.nome)}
            value={apiario}
            onChange={setApiario}
          />
          <FilterDropdown
            label="Colmeia"
            options={colmeias.map((c) => c.nome)}
            value={colmeia}
            onChange={setColmeia}
          />
        </Columns>
      </div>

      <Stack gap={30}>
        <Card className={styles.total}>
          <div>
            <span className={styles.totalLabel}>Produção total</span>
            <strong className={styles.totalValue}>
              {carregando ? '...' : `${totalKg} kg`}
            </strong>
          </div>
          <StatusBadge status={producaoResumo.status} />
        </Card>

        <Stack gap={18}>
          <SectionTitle>Evolução da produção</SectionTitle>
          <BarChart data={producaoMensal} label="Produção mensal em kg" />
        </Stack>

        <Stack gap={18}>
          <SectionTitle>Ranking das colmeias</SectionTitle>
          <ListStack gap={12}>
            {rankingColmeias.map((c, i) => (
              <ListCard
                key={c.id}
                to={`/colmeias/${c.id}`}
                title={c.nome}
                subtitle={`${c.producaoPeriodoKg || 0}kg no período`}
                status="normal"
                icon={
                  <IconBubble tone={podio[i] || 'honey'}>
                    <TrophyIcon size={18} />
                  </IconBubble>
                }
              />
            ))}
          </ListStack>
        </Stack>
      </Stack>

      <Actions>
        <Button to="/producao/registrar">+ Registrar produção</Button>
        <Button variant="secondary" to="/relatorios">
          Relatórios
        </Button>
      </Actions>
    </Screen>
  )
}
