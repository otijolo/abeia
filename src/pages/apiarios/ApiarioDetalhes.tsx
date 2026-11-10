import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Screen, Stack } from '../../components/layout/Screen'
import { Button } from '../../components/ui/Button'
import { AlertBanner } from '../../components/ui/AlertBanner'
import { ConfirmDialog } from '../../components/ui/ConfirmDialog'
import { ListCard, ListStack } from '../../components/ui/ListCard'
import { MapPreview } from '../../components/ui/MapPreview'
import { SectionTitle } from '../../components/ui/SectionTitle'
import { StatusBadge } from '../../components/ui/StatusBadge'
import { EmptyState } from '../../components/ui/EmptyState'
import {
  buscarApiario,
  excluirApiario
} from '../../services/apiarioService'
import { listarColmeias } from '../../services/colmeiaService'
import type { Apiario, Colmeia } from '../../data/types'
import { NotFound } from '../NotFound'
import { DetailHeading } from '../shared/DetailHeading'
import styles from './ApiarioDetalhes.module.css'

/** 7 - Tela de Detalhes do Apiário */
export function ApiarioDetalhes() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [confirmando, setConfirmando] = useState(false)
  const [apiario, setApiario] = useState<Apiario | null>(null)
  const [colmeias, setColmeias] = useState<Colmeia[]>([])
  const [carregando, setCarregando] = useState(true)
  const [excluindo, setExcluindo] = useState(false)
  const [erro, setErro] = useState('')

  useEffect(() => {
    let ativo = true

    async function carregarDados() {
      if (!id) {
        setCarregando(false)
        setErro('O identificador do apiário não foi informado.')
        return
      }

      try {
        setCarregando(true)
        setErro('')

        const [resultado, colmeiasDoApiario] = await Promise.all([
          buscarApiario(id),
          listarColmeias(id).catch(() => [])
        ])

        if (!ativo) return

        setApiario(resultado)
        setColmeias(colmeiasDoApiario)
      } catch (error) {
        console.error('Erro ao carregar detalhes do apiário:', error)

        if (ativo) {
          setErro(
            error instanceof Error
              ? error.message
              : 'Não foi possível carregar os dados do apiário.'
          )
        }
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
  }, [id])

  async function handleExcluir() {
    if (!id || !apiario) return

    try {
      setExcluindo(true)
      setErro('')

      await excluirApiario(id)

      navigate('/apiarios', { replace: true })
    } catch (error) {
      console.error('Erro ao excluir apiário:', error)

      setErro(
        error instanceof Error
          ? error.message
          : 'Não foi possível excluir o apiário.'
      )
    } finally {
      setExcluindo(false)
      setConfirmando(false)
    }
  }

  if (carregando) {
    return (
      <Screen title="Detalhes do Apiário">
        <p style={{ color: 'var(--color-text-muted)', padding: '20px 0' }}>
          Carregando dados do apiário...
        </p>
      </Screen>
    )
  }

  if (erro && !apiario) {
    return (
      <Screen title="Detalhes do Apiário">
        <AlertBanner variant="error">{erro}</AlertBanner>
        <div style={{ marginTop: 16 }}>
          <Button onClick={() => navigate('/apiarios')}>
            Voltar para apiários
          </Button>
        </div>
      </Screen>
    )
  }

  if (!apiario) {
    return <NotFound />
  }

  const colmeiasEmAtencao = colmeias.filter(
    (c) => c.status === 'atencao' || c.status === 'critico'
  ).length

  return (
    <Screen title="Detalhes do Apiário" backTo="/apiarios">
      <div className={styles.layout}>
        {/* Coluna Principal: Informações e Lista de Colmeias */}
        <div className={styles.mainCol}>
          {erro && <AlertBanner variant="error">{erro}</AlertBanner>}

          <DetailHeading
            title={apiario.nome}
            status={apiario.status}
          />

          {/* Cartão de Informações Gerais */}
          <div className={styles.cardBox}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>Dados do Apiário</h2>
              <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text-muted)' }}>
                {apiario.cidade} - {apiario.uf}
              </span>
            </div>
            <div className={styles.specGrid}>
              <div className={styles.specItem}>
                <span className={styles.specLabel}>Localização</span>
                <strong className={styles.specValue}>
                  {apiario.cidade} - {apiario.uf}
                </strong>
              </div>
              <div className={styles.specItem}>
                <span className={styles.specLabel}>Vegetação Predominante</span>
                <strong className={styles.specValue}>
                  {apiario.vegetacao || 'Não informada'}
                </strong>
              </div>
              <div className={styles.specItem}>
                <span className={styles.specLabel}>Fonte de Água</span>
                <strong className={styles.specValue}>
                  {apiario.fonteAgua ? 'Disponível no local' : 'Não disponível'}
                </strong>
              </div>
              <div className={styles.specItem}>
                <span className={styles.specLabel}>Total de Colmeias</span>
                <strong className={styles.specValue}>
                  {colmeias.length} colmeias
                </strong>
              </div>
            </div>
            {apiario.descricao && (
              <p className={styles.observacoesText}>
                <strong>Descrição:</strong> {apiario.descricao}
              </p>
            )}
            {apiario.observacoes && (
              <p className={styles.observacoesText}>
                <strong>Observações:</strong> {apiario.observacoes}
              </p>
            )}
          </div>

          {/* Colmeias do Apiário */}
          <Stack gap={16}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <SectionTitle>Colmeias instaladas</SectionTitle>
              <Button
                to={`/colmeias/nova?apiarioId=${apiario.id}`}
                variant="secondary"
                style={{ padding: '6px 14px', fontSize: '13px' }}
              >
                + Nova Colmeia
              </Button>
            </div>

            <ListStack gap={10}>
              {colmeias.map((colmeia) => (
                <ListCard
                  key={colmeia.id}
                  to={`/colmeias/${colmeia.id}`}
                  title={colmeia.nome}
                  subtitle={colmeia.resumoInspecao}
                  status={colmeia.status}
                />
              ))}

              {colmeias.length === 0 && (
                <EmptyState
                  title="Nenhuma colmeia neste apiário"
                  description={`O apiário ${apiario.nome} ainda não possui colmeias cadastradas.`}
                  action={{
                    label: '+ Adicionar Colmeia',
                    to: `/colmeias/nova?apiarioId=${apiario.id}`
                  }}
                />
              )}
            </ListStack>
          </Stack>
        </div>

        {/* Coluna Lateral: Mapa, Gestão e Indicadores */}
        <aside className={styles.sideCol}>
          {/* Mapa de Localização */}
          <div style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
            <MapPreview to={`/mapa?apiario=${apiario.id}`} />
          </div>

          {/* Painel de Gestão */}
          <div className={styles.actionPanel}>
            <h3 className={styles.actionPanelTitle}>Gestão do Apiário</h3>
            <p className={styles.actionPanelSubtitle}>
              Operações de manejo e configurações
            </p>

            <div className={styles.actionList}>
              <Button to={`/colmeias/nova?apiarioId=${apiario.id}`}>
                + Adicionar Colmeia
              </Button>

              <Button
                variant="secondary"
                to={`/apiarios/${apiario.id}/editar`}
              >
                Editar Apiário
              </Button>

              <div className={styles.actionDivider} />

              <Button
                variant="danger"
                onClick={() => setConfirmando(true)}
                disabled={excluindo}
              >
                Excluir Apiário
              </Button>
            </div>
          </div>

          {/* Card de Indicadores Rápidos */}
          <div className={styles.metricsCard}>
            <div className={styles.metricsRow}>
              <span className={styles.metricsLabel}>Status Sanitário</span>
              <StatusBadge status={apiario.status} />
            </div>
            <div className={styles.metricsDivider} />
            <div className={styles.metricsRow}>
              <span className={styles.metricsLabel}>Colmeias Totais</span>
              <span className={styles.metricsValue}>{colmeias.length}</span>
            </div>
            <div className={styles.metricsDivider} />
            <div className={styles.metricsRow}>
              <span className={styles.metricsLabel}>Atenção / Críticas</span>
              <span
                className={styles.metricsValue}
                style={{
                  color: colmeiasEmAtencao > 0 ? 'var(--status-attention-fg)' : 'inherit'
                }}
              >
                {colmeiasEmAtencao}
              </span>
            </div>
          </div>
        </aside>
      </div>

      <ConfirmDialog
        open={confirmando}
        title={`Excluir ${apiario.nome}?`}
        description="Essa ação removerá o apiário permanentemente do banco de dados. Confirme para continuar."
        onConfirm={() => void handleExcluir()}
        onCancel={() => setConfirmando(false)}
      />
    </Screen>
  )
}
