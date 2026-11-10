import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'

import { Screen, Stack } from '../../components/layout/Screen'
import { Button } from '../../components/ui/Button'
import { AlertBanner } from '../../components/ui/AlertBanner'
import { ConfirmDialog } from '../../components/ui/ConfirmDialog'
import { PositiveNote } from '../../components/ui/InfoCard'
import { SectionTitle } from '../../components/ui/SectionTitle'
import { StatusBadge } from '../../components/ui/StatusBadge'

import { buscarApiario } from '../../services/apiarioService'
import {
  buscarColmeia,
  excluirColmeia
} from '../../services/colmeiaService'
import { listarInspecoesDaColmeia } from '../../services/inspecaoService'

import type { Apiario, Colmeia } from '../../data/types'
import { NotFound } from '../NotFound'
import { DetailHeading } from '../shared/DetailHeading'

import styles from './ColmeiaDetalhes.module.css'

/** Tela de Detalhes da Colmeia */
export function ColmeiaDetalhes() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [colmeia, setColmeia] = useState<Colmeia | null>(null)
  const [apiario, setApiario] = useState<Apiario | null>(null)
  const [carregando, setCarregando] = useState(true)
  const [confirmando, setConfirmando] = useState(false)
  const [excluindo, setExcluindo] = useState(false)
  const [erro, setErro] = useState('')

  useEffect(() => {
    let ativo = true

    async function carregarDados() {
      if (!id) {
        setCarregando(false)
        setErro('O identificador da colmeia não foi informado.')
        return
      }

      try {
        setCarregando(true)
        setErro('')

        const [colmeiaEncontrada, inspecoes] = await Promise.all([
          buscarColmeia(id),
          listarInspecoesDaColmeia(id).catch(() => [])
        ])

        if (!ativo) return

        if (!colmeiaEncontrada) {
          setColmeia(null)
          setApiario(null)
          return
        }

        // Garante que problemas seja sempre um array seguro
        if (!Array.isArray(colmeiaEncontrada.problemas)) {
          colmeiaEncontrada.problemas = []
        }

        if (!colmeiaEncontrada.ultimaInspecao && inspecoes.length > 0) {
          const ult = inspecoes[0]
          colmeiaEncontrada.ultimaInspecao = {
            resumo: ult.resumo,
            detalhes: [
              `${ult.quadrosCria} quadros com cria`,
              ...(Array.isArray(ult.pragas) && ult.pragas.length > 0
                ? ult.pragas
                : ['Sem sinais de pragas'])
            ],
            saude:
              ult.status === 'normal'
                ? 'Saudável'
                : ult.status === 'atencao'
                  ? 'Atenção'
                  : 'Crítico'
          }
        }

        setColmeia(colmeiaEncontrada)

        const apiarioEncontrado = await buscarApiario(
          colmeiaEncontrada.apiarioId
        )

        if (ativo) {
          setApiario(apiarioEncontrado)
        }
      } catch (error) {
        console.error('Erro ao carregar detalhes da colmeia:', error)

        if (ativo) {
          setErro(
            error instanceof Error
              ? error.message
              : 'Não foi possível carregar os dados da colmeia.'
          )
        }
      } finally {
        if (ativo) {
          setCarregando(false)
        }
      }
    }

    carregarDados()

    return () => {
      ativo = false
    }
  }, [id])

  async function handleExcluir() {
    if (!id) return

    try {
      setExcluindo(true)
      setErro('')

      await excluirColmeia(id)

      navigate(apiario ? `/apiarios/${apiario.id}` : '/colmeias', {
        replace: true
      })
    } catch (error) {
      console.error('Erro ao excluir colmeia:', error)

      setErro(
        error instanceof Error
          ? error.message
          : 'Não foi possível excluir a colmeia.'
      )
    } finally {
      setExcluindo(false)
      setConfirmando(false)
    }
  }

  if (carregando) {
    return (
      <Screen title="Detalhes da Colmeia">
        <p style={{ color: 'var(--color-text-muted)', padding: '20px 0' }}>
          Carregando dados da colmeia...
        </p>
      </Screen>
    )
  }

  if (erro && !colmeia) {
    return (
      <Screen title="Detalhes da Colmeia">
        <AlertBanner variant="error">{erro}</AlertBanner>
        <div style={{ marginTop: 16 }}>
          <Button onClick={() => window.location.reload()}>Tentar novamente</Button>
        </div>
      </Screen>
    )
  }

  if (!colmeia) {
    return <NotFound />
  }

  const inspecao = colmeia.ultimaInspecao
  const problemas = Array.isArray(colmeia.problemas) ? colmeia.problemas : []

  return (
    <Screen
      title="Detalhes da Colmeia"
      backTo={apiario ? `/apiarios/${apiario.id}` : '/colmeias'}
    >
      <div className={styles.layout}>
        {/* Coluna Principal: Informações e Diagnósticos */}
        <div className={styles.mainCol}>
          {erro && <AlertBanner variant="error">{erro}</AlertBanner>}

          <DetailHeading
            title={colmeia.nome}
            status={colmeia.status}
          />

          {/* Cartão de Informações Gerais */}
          <div className={styles.cardBox}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>Dados da Colmeia</h2>
              {apiario && (
                <Link to={`/apiarios/${apiario.id}`} className={styles.apiarioLink}>
                  Ver {apiario.nome} →
                </Link>
              )}
            </div>
            <div className={styles.specGrid}>
              <div className={styles.specItem}>
                <span className={styles.specLabel}>Apiário</span>
                <strong className={styles.specValue}>
                  {apiario?.nome ?? 'Não encontrado'}
                </strong>
              </div>
              <div className={styles.specItem}>
                <span className={styles.specLabel}>Tipo de Caixa</span>
                <strong className={styles.specValue}>{colmeia.tipo || 'Langstroth'}</strong>
              </div>
              <div className={styles.specItem}>
                <span className={styles.specLabel}>Posição</span>
                <strong className={styles.specValue}>
                  {colmeia.posicao || 'Não informada'}
                </strong>
              </div>
              <div className={styles.specItem}>
                <span className={styles.specLabel}>Instalada em</span>
                <strong className={styles.specValue}>
                  {colmeia.instaladaEm || 'Não informada'}
                </strong>
              </div>
            </div>
            {colmeia.observacoes && (
              <p className={styles.observacoesText}>
                <strong>Observações:</strong> {colmeia.observacoes}
              </p>
            )}
          </div>

          {/* Última Inspeção */}
          {inspecao && (
            <Stack gap={14}>
              <SectionTitle>Última inspeção</SectionTitle>
              <div className={styles.cardBox}>
                <div className={styles.cardHeader}>
                  <h3 className={styles.cardTitle}>{inspecao.resumo}</h3>
                  <StatusBadge
                    status={colmeia.status}
                    label={inspecao.saude}
                  />
                </div>
                <ul className={styles.bulletList}>
                  {(inspecao.detalhes ?? []).map((det, i) => (
                    <li key={i} className={styles.bulletItem}>
                      <span className={styles.bulletDot} />
                      <span>{det}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Stack>
          )}

          {/* Principais Problemas Sanitários */}
          <Stack gap={14}>
            <SectionTitle>Principais problemas</SectionTitle>
            <div className={styles.cardBox}>
              {problemas.length === 0 ? (
                <PositiveNote>
                  Nenhum problema sanitário identificado na colmeia.
                </PositiveNote>
              ) : (
                <div className={styles.problemList}>
                  {problemas.map((prob) => (
                    <div
                      key={prob}
                      className={`${styles.problemTag} ${styles[colmeia.status] || ''}`}
                    >
                      <span className={styles.problemDot} />
                      <span>{prob}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Stack>
        </div>

        {/* Coluna Lateral: Painel de Gestão e Indicadores */}
        <aside className={styles.sideCol}>
          <div className={styles.actionPanel}>
            <h3 className={styles.actionPanelTitle}>Gestão da Colmeia</h3>
            <p className={styles.actionPanelSubtitle}>
              Ações rápidas e registros de campo
            </p>

            <div className={styles.actionList}>
              <Button to={`/colmeias/${colmeia.id}/inspecoes/nova`}>
                + Nova Inspeção
              </Button>

              <div className={styles.actionGrid}>
                <Button
                  variant="secondary"
                  to={`/colmeias/${colmeia.id}/inspecoes`}
                >
                  Histórico
                </Button>

                <Button
                  variant="secondary"
                  to={`/producao/registrar?colmeiaId=${colmeia.id}`}
                >
                  Produção
                </Button>

                <Button
                  variant="secondary"
                  to={`/alertas/novo?colmeiaId=${colmeia.id}`}
                >
                  Criar Alerta
                </Button>

                <Button
                  variant="secondary"
                  to={`/colmeias/${colmeia.id}/editar`}
                >
                  Editar
                </Button>
              </div>

              <div className={styles.actionDivider} />

              <Button
                variant="danger"
                disabled={excluindo}
                onClick={() => setConfirmando(true)}
              >
                Excluir Colmeia
              </Button>
            </div>
          </div>

          {/* Card de Indicadores Rápidos */}
          <div className={styles.metricsCard}>
            <div className={styles.metricsRow}>
              <span className={styles.metricsLabel}>Status Geral</span>
              <StatusBadge status={colmeia.status} />
            </div>
            <div className={styles.metricsDivider} />
            <div className={styles.metricsRow}>
              <span className={styles.metricsLabel}>Prazo de Inspeção</span>
              <span className={styles.metricsValue}>
                {colmeia.prazoInspecao || 'Em dia'}
              </span>
            </div>
            <div className={styles.metricsDivider} />
            <div className={styles.metricsRow}>
              <span className={styles.metricsLabel}>Produção do Período</span>
              <span className={styles.metricsValue}>
                {(colmeia.producaoPeriodoKg ?? 0).toLocaleString('pt-BR', {
                  maximumFractionDigits: 1
                })}{' '}
                kg
              </span>
            </div>
          </div>
        </aside>
      </div>

      <ConfirmDialog
        open={confirmando}
        title={`Excluir ${colmeia.nome}?`}
        description={
          excluindo
            ? 'Excluindo colmeia...'
            : 'Essa ação removerá a colmeia permanentemente do banco de dados. Confirme para continuar.'
        }
        onConfirm={handleExcluir}
        onCancel={() => {
          if (!excluindo) setConfirmando(false)
        }}
      />
    </Screen>
  )
}
