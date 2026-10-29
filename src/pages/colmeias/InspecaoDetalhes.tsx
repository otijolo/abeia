
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import { Columns, Screen, Stack } from '../../components/layout/Screen'
import { Button } from '../../components/ui/Button'
import {
  BodyText,
  InfoCard,
  PositiveNote
} from '../../components/ui/InfoCard'
import { KeyValueList } from '../../components/ui/KeyValueList'
import { SectionTitle } from '../../components/ui/SectionTitle'

import { buscarColmeia } from '../../services/colmeiaService'
import { buscarInspecao } from '../../services/inspecaoService'

import type { Colmeia, Inspecao } from '../../data/types'
import { formatarData } from '../../data/datas'

import { NotFound } from '../NotFound'
import { DetailHeading } from '../shared/DetailHeading'

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
        <p>Carregando detalhes da inspeção...</p>
      </Screen>
    )
  }

  if (erro) {
    return (
      <Screen title="Detalhes da Inspeção">
        <Stack gap={16}>
          <p role="alert">{erro}</p>
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
    <Screen title="Detalhes da Inspeção">
      <Stack gap={24}>
        <DetailHeading
          title={colmeia.nome}
          date={formatarData(inspecao.data)}
          status={inspecao.status}
        />

        <KeyValueList
          items={[
            ['Força da colônia', forcaLabel[inspecao.forcaColonia] || inspecao.forcaColonia],
            [
              'Rainha observada',
              inspecao.rainhaObservada ? 'Sim' : 'Não'
            ],
            ['Quadros com abelhas', inspecao.quadrosAbelhas],
            ['Quadros com cria', inspecao.quadrosCria],
            ['Postura', posturaLabel[inspecao.postura] || inspecao.postura]
          ]}
        />

        <Stack gap={18}>
          <SectionTitle>Pragas e doenças</SectionTitle>

          <InfoCard minHeight={100}>
            {pragas.length === 0 ? (
              <PositiveNote>
                Nenhuma ocorrência relevante.
              </PositiveNote>
            ) : (
              pragas.map(praga => (
                <BodyText key={praga}>{praga}</BodyText>
              ))
            )}
          </InfoCard>
        </Stack>

        <Stack gap={18}>
          <SectionTitle>Observações</SectionTitle>

          <InfoCard minHeight={100}>
            <BodyText>
              {inspecao.observacoes || 'Nenhuma observação registrada.'}
            </BodyText>
          </InfoCard>
        </Stack>
      </Stack>

      <div style={{ marginTop: 36, padding: '0 12px' }}>
        <Columns gap={14}>
          <Button to={`/colmeias/${colmeia.id}`}>
            Ver Colmeia
          </Button>

          <Button
            variant="secondary"
            to={`/colmeias/${colmeia.id}/inspecoes`}
          >
            Histórico
          </Button>
        </Columns>
      </div>
    </Screen>
  )
}
