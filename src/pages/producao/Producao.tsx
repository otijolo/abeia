import { useEffect, useState } from 'react'
import { Columns, Screen, Stack } from '../../components/layout/Screen'
import { BarChart } from '../../components/ui/BarChart'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { ConfirmDialog } from '../../components/ui/ConfirmDialog'
import { DesignIcon } from '../../components/ui/DesignIcon'
import { EmptyState } from '../../components/ui/EmptyState'
import { FilterDropdown } from '../../components/ui/FilterDropdown'
import { IconBubble } from '../../components/ui/IconBubble'
import { ListCard, ListStack } from '../../components/ui/ListCard'
import { SectionTitle } from '../../components/ui/SectionTitle'
import { StatusBadge } from '../../components/ui/StatusBadge'
import { dataDaProducao, dentroDoPeriodo, quantidadeEmKg } from '../../data/producao'
import { listarProducoes, excluirProducao } from '../../services/producaoService'
import { listarColmeias } from '../../services/colmeiaService'
import { listarApiarios } from '../../services/apiarioService'
import type { Apiario, Colmeia, Producao as ProducaoType, ProducaoMensal } from '../../data/types'
import { Actions } from '../shared/Actions'
import styles from './Producao.module.css'

const podio = ['honey', 'silver', 'bronze'] as const
const trofeus = ['trofeu-ouro', 'trofeu-prata', 'trofeu-bronze'] as const
const periodos = ['Últimos 30 dias', 'Últimos 6 meses', 'Este ano']
const formatarKg = (valor: number) => valor.toLocaleString('pt-BR', { maximumFractionDigits: 2 })

/** Tela de Produção */
export function Producao() {
  const [periodo, setPeriodo] = useState('')
  const [apiario, setApiario] = useState('')
  const [colmeia, setColmeia] = useState('')
  const [producoes, setProducoes] = useState<ProducaoType[]>([])
  const [colmeias, setColmeias] = useState<Colmeia[]>([])
  const [apiarios, setApiarios] = useState<Apiario[]>([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')
  const [exclusao, setExclusao] = useState<ProducaoType | null>(null)
  const [excluindo, setExcluindo] = useState(false)

  useEffect(() => {
    let ativo = true
    async function carregarDados() {
      try {
        const [dadosProducoes, dadosColmeias, dadosApiarios] = await Promise.all([
          listarProducoes(), listarColmeias(), listarApiarios()
        ])
        if (!ativo) return
        setProducoes(dadosProducoes)
        setColmeias(dadosColmeias)
        setApiarios(dadosApiarios)
      } catch (err) {
        if (ativo) setErro(err instanceof Error ? err.message : 'Não foi possível carregar a produção.')
      } finally {
        if (ativo) setCarregando(false)
      }
    }
    void carregarDados()
    return () => { ativo = false }
  }, [])

  const colmeiasDoFiltro = colmeias.filter((c) =>
    !apiario || apiarios.find((a) => a.id === c.apiarioId)?.nome === apiario
  )
  const registros = producoes.filter((p) => {
    const origem = colmeiasDoFiltro.find((c) => c.id === p.colmeiaId)
    return (!apiario || !!origem) &&
      (!colmeia || origem?.nome === colmeia) &&
      dentroDoPeriodo(p.data, periodo)
  })
  const totalKg = registros.reduce((total, p) => total + quantidadeEmKg(p), 0)
  const totalLitros = registros.filter((p) => p.unidade === 'litros')
    .reduce((total, p) => total + Number(p.quantidade), 0)
  const ranking = colmeiasDoFiltro
    .filter((c) => !colmeia || c.nome === colmeia)
    .map((c) => ({
      colmeia: c,
      kg: registros.filter((p) => p.colmeiaId === c.id)
        .reduce((total, p) => total + quantidadeEmKg(p), 0),
    }))
    .filter((item) => item.kg > 0)
    .sort((a, b) => b.kg - a.kg)
    .slice(0, 3)

  const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
  const dadosGrafico: ProducaoMensal[] = meses.map((mes) => ({ mes, kg: 0 }))
  registros.forEach((p) => {
    const data = dataDaProducao(p.data)
    if (data) dadosGrafico[data.getMonth()].kg += quantidadeEmKg(p)
  })
  const recentes = [...registros].sort((a, b) =>
    (dataDaProducao(b.data)?.getTime() ?? 0) - (dataDaProducao(a.data)?.getTime() ?? 0)
  ).slice(0, 4)

  async function handleExcluirProducao() {
    if (!exclusao || excluindo) return
    try {
      setExcluindo(true)
      await excluirProducao(exclusao.id)
      setProducoes((prev) => prev.filter((p) => p.id !== exclusao.id))
      setExclusao(null)
    } catch (err) {
      setErro(err instanceof Error ? err.message : 'Não foi possível excluir o registro.')
      setExclusao(null)
    } finally {
      setExcluindo(false)
    }
  }

  return (
    <Screen title="Produção" nav="producao">
      <div className={styles.filters}>
        <Columns gap={8} count={3}>
          <FilterDropdown label="Período" options={periodos} value={periodo} onChange={setPeriodo} />
          <FilterDropdown label="Apiário" options={apiarios.map((a) => a.nome)} value={apiario}
            onChange={(valor) => {
              setApiario(valor)
              setColmeia('')
            }} />
          <FilterDropdown label="Colmeia" options={colmeiasDoFiltro.map((c) => c.nome)}
            value={colmeia} onChange={setColmeia} />
        </Columns>
      </div>
      {erro && <p role="alert" className={styles.error}>{erro}</p>}

      <Stack gap={30}>
        <Card className={styles.total}>
          <div>
            <span className={styles.totalLabel}>Produção total</span>
            <strong className={styles.totalValue}>{carregando ? '...' : `${formatarKg(totalKg)} kg`}</strong>
            {totalLitros > 0 && <span className={styles.volume}>+ {formatarKg(totalLitros)} litros registrados</span>}
          </div>
          <StatusBadge status="normal" />
        </Card>

        <Stack gap={18}>
          <SectionTitle>Evolução da produção</SectionTitle>
          <BarChart data={dadosGrafico} label="Produção mensal em kg" />
        </Stack>

        <Stack gap={18}>
          <SectionTitle>Ranking das colmeias</SectionTitle>
          <ListStack gap={12}>
            {ranking.map(({ colmeia: c, kg }, i) => (
              <ListCard key={c.id} to={`/colmeias/${c.id}`} title={c.nome}
                subtitle={`${formatarKg(kg)} kg no período`} status="normal"
                icon={<IconBubble tone={podio[i]}><DesignIcon name={trofeus[i]} /></IconBubble>} />
            ))}
            {!carregando && ranking.length === 0 && <EmptyState>Nenhuma produção para os filtros selecionados.</EmptyState>}
          </ListStack>
        </Stack>
      </Stack>

      <Actions>
        <Button to="/producao/registrar">+ Registrar produção</Button>
        <Button variant="secondary" to="/relatorios">Relatórios</Button>
      </Actions>

      {recentes.length > 0 && (
        <Stack gap={18} className={styles.harvests}>
          <SectionTitle>Colheitas registradas</SectionTitle>
          <ListStack gap={10}>
            {recentes.map((p) => (
              <Card key={p.id} className={styles.harvest}>
                <div>
                  <strong>{colmeias.find((c) => c.id === p.colmeiaId)?.nome || 'Colmeia'}</strong>
                  <span>{p.data} • {p.quantidade} {p.unidade}</span>
                  {p.observacoes && <span>{p.observacoes}</span>}
                </div>
                <button type="button" className={styles.delete} onClick={() => setExclusao(p)}
                  aria-label={`Excluir registro de ${p.data}`}>Excluir</button>
              </Card>
            ))}
          </ListStack>
        </Stack>
      )}
      <ConfirmDialog open={!!exclusao} title="Excluir registro de produção?"
        description="Essa ação removerá a colheita registrada."
        confirmLabel={excluindo ? 'Excluindo...' : 'Confirmar exclusão'}
        onConfirm={() => void handleExcluirProducao()}
        onCancel={() => { if (!excluindo) setExclusao(null) }} />
    </Screen>
  )
}
