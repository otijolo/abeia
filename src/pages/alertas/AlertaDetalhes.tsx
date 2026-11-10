import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Screen, Stack } from '../../components/layout/Screen'
import { Button } from '../../components/ui/Button'
import { AlertBanner } from '../../components/ui/AlertBanner'
import { ConfirmDialog } from '../../components/ui/ConfirmDialog'
import { SectionTitle } from '../../components/ui/SectionTitle'
import { StatusBadge } from '../../components/ui/StatusBadge'
import { buscarAlerta, atualizarEstadoAlerta, excluirAlerta } from '../../services/alertaService'
import type { Alerta } from '../../data/types'
import { NotFound } from '../NotFound'
import { DetailHeading } from '../shared/DetailHeading'
import styles from './AlertaDetalhes.module.css'

/** Tela de Detalhes do Alerta */
export function AlertaDetalhes() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [alerta, setAlerta] = useState<Alerta | null>(null)
  const [carregando, setCarregando] = useState(true)
  const [atualizando, setAtualizando] = useState(false)
  const [confirmandoExclusao, setConfirmandoExclusao] = useState(false)
  const [excluindo, setExcluindo] = useState(false)
  const [erro, setErro] = useState('')

  const handleExcluirAlerta = async () => {
    if (!id || excluindo) return
    setErro('')
    try {
      setExcluindo(true)
      await excluirAlerta(id)
      navigate('/alertas', { replace: true })
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'Não foi possível excluir o alerta.')
    } finally {
      setExcluindo(false)
      setConfirmandoExclusao(false)
    }
  }

  useEffect(() => {
    let ativo = true

    async function carregarAlerta() {
      if (!id) {
        setCarregando(false)
        return
      }

      try {
        setCarregando(true)
        setErro('')

        const encontrado = await buscarAlerta(id)

        if (ativo) {
          setAlerta(encontrado ?? null)
        }
      } catch (error) {
        console.error('Erro ao buscar alerta:', error)
        if (ativo) {
          setErro(
            error instanceof Error
              ? error.message
              : 'Não foi possível carregar o alerta.'
          )
        }
      } finally {
        if (ativo) {
          setCarregando(false)
        }
      }
    }

    void carregarAlerta()

    return () => {
      ativo = false
    }
  }, [id])

  const handleResolverAlerta = async () => {
    if (!id || !alerta || atualizando) return
    setErro('')
    try {
      setAtualizando(true)
      await atualizarEstadoAlerta(id, 'resolvido')
      setAlerta({ ...alerta, estado: 'resolvido' })
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'Não foi possível atualizar o alerta.')
    } finally {
      setAtualizando(false)
    }
  }

  if (carregando) {
    return (
      <Screen title="Detalhes do Alerta">
        <p style={{ color: 'var(--color-text-muted)', padding: '20px 0' }}>
          Carregando alerta...
        </p>
      </Screen>
    )
  }

  if (erro && !alerta) {
    return (
      <Screen title="Detalhes do Alerta">
        <AlertBanner variant="error">{erro}</AlertBanner>
        <div style={{ marginTop: 16 }}>
          <Button onClick={() => window.location.reload()}>Tentar novamente</Button>
        </div>
      </Screen>
    )
  }

  if (!alerta) return <NotFound />

  const afetados = Array.isArray(alerta.afetados) ? alerta.afetados : []

  return (
    <Screen title="Detalhes do Alerta" backTo="/alertas">
      <div className={styles.layout}>
        {/* Coluna Principal: Informações do Alerta */}
        <div className={styles.mainCol}>
          {erro && <AlertBanner variant="error">{erro}</AlertBanner>}

          <DetailHeading
            title={alerta.tituloDetalhe || alerta.titulo}
            date={alerta.data}
            status={alerta.status}
          />

          <Stack gap={14}>
            <SectionTitle>Motivo do alerta</SectionTitle>
            <div className={styles.cardBox}>
              <p className={styles.bodyText}>{alerta.motivo}</p>
            </div>
          </Stack>

          <Stack gap={14}>
            <SectionTitle>Elemento(s) afetado(s)</SectionTitle>
            <div className={styles.cardBox}>
              {afetados.length === 0 ? (
                <p className={styles.bodyText}>Nenhum elemento específico associado.</p>
              ) : (
                <div className={styles.affectedList}>
                  {afetados.map((item) => (
                    <span key={item} className={styles.affectedTag}>
                      {item}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </Stack>
        </div>

        {/* Coluna Lateral: Ações e Metadados */}
        <aside className={styles.sideCol}>
          <div className={styles.actionPanel}>
            <h3 className={styles.actionPanelTitle}>Ações de Alerta</h3>
            <p className={styles.actionPanelSubtitle}>
              Resolução e tratativas sanitárias
            </p>

            <div className={styles.actionList}>
              {alerta.estado === 'ativo' && (
                <Button onClick={handleResolverAlerta} disabled={atualizando}>
                  {atualizando ? 'Resolvendo...' : '✓ Marcar como Resolvido'}
                </Button>
              )}

              {alerta.colmeiaId && (
                <Button variant="secondary" to={`/colmeias/${alerta.colmeiaId}`}>
                  Ir para a Colmeia
                </Button>
              )}

              <Button variant="secondary" to={`/alertas/${alerta.id}/editar`}>
                Editar Alerta
              </Button>

              <div className={styles.actionDivider} />

              <Button
                variant="danger"
                onClick={() => setConfirmandoExclusao(true)}
                disabled={excluindo}
              >
                Excluir Alerta
              </Button>
            </div>
          </div>

          {/* Card de Metadados */}
          <div className={styles.metricsCard}>
            <div className={styles.metricsRow}>
              <span className={styles.metricsLabel}>Gravidade</span>
              <StatusBadge status={alerta.status} />
            </div>
            <div className={styles.metricsDivider} />
            <div className={styles.metricsRow}>
              <span className={styles.metricsLabel}>Situação</span>
              <span
                className={styles.metricsValue}
                style={{
                  color: alerta.estado === 'ativo' ? 'var(--status-critical-fg)' : 'var(--color-primary-text)'
                }}
              >
                {alerta.estado === 'ativo' ? 'Ativo' : 'Resolvido'}
              </span>
            </div>
            <div className={styles.metricsDivider} />
            <div className={styles.metricsRow}>
              <span className={styles.metricsLabel}>Data de Registro</span>
              <span className={styles.metricsValue}>{alerta.data}</span>
            </div>
          </div>
        </aside>
      </div>

      <ConfirmDialog
        open={confirmandoExclusao}
        title="Excluir alerta?"
        description="Esta ação removerá o alerta permanentemente. Confirme para prosseguir."
        confirmLabel={excluindo ? 'Excluindo...' : 'Excluir'}
        onConfirm={handleExcluirAlerta}
        onCancel={() => {
          if (!excluindo) setConfirmandoExclusao(false)
        }}
      />
    </Screen>
  )
}
