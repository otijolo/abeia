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
import { listarProducoes, excluirProducao } from '../../services/producaoService'
import { listarColmeias } from '../../services/colmeiaService'
import { listarApiarios } from '../../services/apiarioService'
import type { Apiario, Colmeia, Producao as ProducaoType, ProducaoMensal } from '../../data/types'
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
          setColmeias(dadosColmeias)
          setApiarios(dadosApiarios)
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

  // Calcula total em kg
  const totalKg = producoes.reduce((acc, p) => acc + (Number(p.quantidade) || 0), 0)

  // Ranking das colmeias cadastradas com maior produção
  const rankingColmeias = [...colmeias]
    .sort((a, b) => (b.producaoPeriodoKg || 0) - (a.producaoPeriodoKg || 0))
    .slice(0, 3)

  // Gráfico mensal baseado nas produções cadastradas
  const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
  const dadosGrafico: ProducaoMensal[] = meses.map((mes) => ({ mes, kg: 0 }))
  producoes.forEach((p) => {
    if (!p.data) return
    let mIndex = -1
    if (p.data.includes('-')) {
      const partes = p.data.split('-')
      mIndex = parseInt(partes[1], 10) - 1
    } else if (p.data.includes('/')) {
      const partes = p.data.split('/')
      mIndex = parseInt(partes[1], 10) - 1
    }
    if (mIndex >= 0 && mIndex < 12) {
      dadosGrafico[mIndex].kg += Number(p.quantidade) || 0
    }
  })

  const handleExcluirProducao = async (id: string) => {
    try {
      await excluirProducao(id)
      setProducoes((prev) => prev.filter((p) => p.id !== id))
    } catch (err) {
      console.error('Erro ao excluir produção:', err)
    }
  }

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
          <StatusBadge status="normal" />
        </Card>

        {producoes.length > 0 && (
          <Stack gap={18}>
            <SectionTitle>Colheitas registradas</SectionTitle>
            <ListStack gap={10}>
              {producoes.slice(-4).reverse().map((p) => {
                const colmeiaNome =
                  colmeias.find((c) => c.id === p.colmeiaId)?.nome || `Colmeia ${p.colmeiaId}`
                return (
                  <Card
                    key={p.id}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '12px 16px'
                    }}
                  >
                    <div>
                      <strong style={{ display: 'block', fontSize: '15px' }}>{colmeiaNome}</strong>
                      <span style={{ fontSize: '13px', color: '#666' }}>
                        {p.data} • <strong>{p.quantidade} {p.unidade}</strong>
                        {p.observacoes ? ` • ${p.observacoes}` : ''}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleExcluirProducao(p.id)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: '#d32f2f',
                        cursor: 'pointer',
                        padding: '6px 8px',
                        fontSize: '13px',
                        fontWeight: 600
                      }}
                      title="Excluir registro"
                    >
                      Excluir
                    </button>
                  </Card>
                )
              })}
            </ListStack>
          </Stack>
        )}

        <Stack gap={18}>
          <SectionTitle>Evolução da produção</SectionTitle>
          <BarChart data={dadosGrafico} label="Produção mensal em kg" />
        </Stack>

        <Stack gap={18}>
          <SectionTitle>Ranking das colmeias</SectionTitle>
          <ListStack gap={12}>
            {rankingColmeias.length > 0 ? (
              rankingColmeias.map((c, i) => (
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
              ))
            ) : (
              <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>
                Nenhuma colmeia cadastrada para o ranking.
              </p>
            )}
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
