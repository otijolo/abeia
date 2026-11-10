import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import { Screen, Stack } from '../../components/layout/Screen'
import { Button } from '../../components/ui/Button'
import { AlertBanner } from '../../components/ui/AlertBanner'
import {
  BodyText,
  PositiveNote
} from '../../components/ui/InfoCard'
import { KeyValueList } from '../../components/ui/KeyValueList'
import { SectionTitle } from '../../components/ui/SectionTitle'
import { StatusBadge } from '../../components/ui/StatusBadge'

import { buscarColmeia } from '../../services/colmeiaService'
import { buscarInspecao } from '../../services/inspecaoService'

import type { Colmeia, Inspecao } from '../../data/types'
import { formatarData } from '../../data/datas'

import { NotFound } from '../NotFound'
import { DetailHeading } from '../shared/DetailHeading'
import styles from './InspecaoDetalhes.module.css'

const forcaLabel: Record<string, string> = { fraca: 'Fraca', media: 'Média', forte: 'Forte' }
const posturaLabel: Record<string, string> = { ruim: 'Ruim', padrao: 'Padrão', boa: 'Boa' }

/** Tela de Detalhes da Inspeção */
export function InspecaoDetalhes() {
  const { id } = useParams()

  const [inspecao, setInspecao] = useState<Inspecao | null>(null)
  const [colmeia, setColmeia] = useState<Colmeia | null>(null)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')

  useEffect(() => {
    let ativo = true

    async function carregarDados() {
      if (!id) {
        setInspecao(null)
        setColmeia(null)
        setCarregando(false)
        return
      }

      try {
        setCarregando(true)
        setErro('')

        const inspecaoEncontrada = await buscarInspecao(id)

        if (!ativo) return

        if (!inspecaoEncontrada) {
          setInspecao(null)
          setColmeia(null)
          return
        }

        const colmeiaEncontrada = await buscarColmeia(
          inspecaoEncontrada.colmeiaId
        )

        if (!ativo) return

        if (!colmeiaEncontrada) {
          setInspecao(null)
          setColmeia(null)
          setErro('A colmeia associada a esta inspeção não foi encontrada.')
          return
        }

        setInspecao(inspecaoEncontrada)
        setColmeia(colmeiaEncontrada)
      } catch (error) {
        if (!ativo) return

        setErro(
          error instanceof Error
            ? error.message
            : 'Não foi possível carregar os detalhes da inspeção.'
        )
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

  if (carregando) {
    return (
      <Screen title="Detalhes da Inspeção">
        <p style={{ color: 'var(--color-text-muted)', padding: '20px 0' }}>
          Carregando detalhes da inspeção...
        </p>
      </Screen>
    )
  }

  if (erro) {
    return (
      <Screen title="Detalhes da Inspeção">
        <Stack gap={16}>
          <AlertBanner variant="error">{erro}</AlertBanner>
          <Button variant="secondary" to="/colmeias">
            Voltar para colmeias
          </Button>
        </Stack>
      </Screen>
    )
  }

  if (!inspecao || !colmeia) {
    return <NotFound />
  }

  const pragas = inspecao.pragas ?? []

  return (
    <Screen
      title="Detalhes da Inspeção"
      backTo={`/colmeias/${colmeia.id}/inspecoes`}
    >
      <div className={styles.layout}>
        {/* Coluna Principal: Informações Técnicas e Avaliações */}
        <div className={styles.mainCol}>
          <DetailHeading
            title={colmeia.nome}
            date={formatarData(inspecao.data)}
            status={inspecao.status}
          />

          <Stack gap={14}>
            <SectionTitle>Parâmetros da Colônia</SectionTitle>
            <div className={styles.cardBox}>
              <KeyValueList
                items={[
                  ['Força da colônia', forcaLabel[inspecao.forcaColonia] || inspecao.forcaColonia],
                  ['Rainha observada', inspecao.rainhaObservada ? 'Sim' : 'Não'],
                  ['Quadros com abelhas', inspecao.quadrosAbelhas],
                  ['Quadros com cria', inspecao.quadrosCria],
                  ['Postura da rainha', posturaLabel[inspecao.postura] || inspecao.postura]
                ]}
              />
            </div>
          </Stack>

          <Stack gap={14}>
            <SectionTitle>Pragas e doenças</SectionTitle>
            <div className={styles.cardBox}>
              {pragas.length === 0 ? (
                <PositiveNote>Nenhuma ocorrência relevante de pragas.</PositiveNote>
              ) : (
                pragas.map((praga) => <BodyText key={praga}>{praga}</BodyText>)
              )}
            </div>
          </Stack>

          <Stack gap={14}>
            <SectionTitle>Observações de Campo</SectionTitle>
            <div className={styles.cardBox}>
              <p className={styles.bodyText}>
                {inspecao.observacoes || 'Nenhuma observação adicional registrada.'}
              </p>
            </div>
          </Stack>
        </div>

        {/* Coluna Lateral: Ações e Resumo */}
        <aside className={styles.sideCol}>
          <div className={styles.actionPanel}>
            <h3 className={styles.actionPanelTitle}>Navegação</h3>
            <p className={styles.actionPanelSubtitle}>
              Retorno e histórico da colmeia
            </p>

            <div className={styles.actionList}>
              <Button to={`/colmeias/${colmeia.id}`}>
                Ver Colmeia
              </Button>

              <Button
                variant="secondary"
                to={`/colmeias/${colmeia.id}/inspecoes`}
              >
                Histórico de Inspeções
              </Button>

              <Button
                variant="secondary"
                to={`/producao/registrar?colmeiaId=${colmeia.id}`}
              >
                Registrar Produção
              </Button>
            </div>
          </div>

          <div className={styles.metricsCard}>
            <div className={styles.metricsRow}>
              <span className={styles.metricsLabel}>Avaliação Sanitária</span>
              <StatusBadge status={inspecao.status} />
            </div>
            <div className={styles.metricsDivider} />
            <div className={styles.metricsRow}>
              <span className={styles.metricsLabel}>Data da Inspeção</span>
              <span className={styles.metricsValue}>
                {formatarData(inspecao.data)}
              </span>
            </div>
          </div>
        </aside>
      </div>
    </Screen>
  )
}
