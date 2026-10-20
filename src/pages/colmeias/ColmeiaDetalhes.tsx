
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { Columns, Screen, Stack } from '../../components/layout/Screen'
import { Button } from '../../components/ui/Button'
import { ConfirmDialog } from '../../components/ui/ConfirmDialog'
import { Divider } from '../../components/ui/Divider'
import { InfoCard, PositiveNote } from '../../components/ui/InfoCard'
import { SectionTitle } from '../../components/ui/SectionTitle'
import { StatusBadge } from '../../components/ui/StatusBadge'

import { buscarApiario } from '../../services/apiarioService'
import {
  buscarColmeia,
  excluirColmeia
} from '../../services/colmeiaService'

import type { Apiario, Colmeia } from '../../data/types'

import { NotFound } from '../NotFound'
import { Actions } from '../shared/Actions'
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

        const colmeiaEncontrada = await buscarColmeia(id)

        if (!ativo) return

        if (!colmeiaEncontrada) {
          setColmeia(null)
          setApiario(null)
          return
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

    void carregarDados()

    return () => {
      ativo = false
    }
  }, [id])

  async function handleExcluir() {
    if (!id || !colmeia) return

    try {
      setExcluindo(true)
      setErro('')

      await excluirColmeia(id)

      navigate('/colmeias', { replace: true })
    } catch (error) {
      console.error('Erro ao excluir colmeia:', error)

      setErro(
        error instanceof Error
          ? error.message
          : 'Não foi possível excluir a colmeia.'
      )

      setConfirmando(false)
    } finally {
      setExcluindo(false)
    }
  }

  if (carregando) {
    return (
      <Screen title="Detalhes da Colmeia">
        <p>Carregando dados da colmeia...</p>
      </Screen>
    )
  }

  if (erro && !colmeia) {
    return (
      <Screen title="Detalhes da Colmeia">
        <Stack gap={16}>
          <p role="alert">{erro}</p>
          <Button to="/colmeias">Voltar para colmeias</Button>
        </Stack>
      </Screen>
    )
  }

  if (!colmeia) {
    return <NotFound />
  }

  const inspecao = colmeia.ultimaInspecao

  return (
    <Screen title="Detalhes da Colmeia">
      <Stack gap={22}>
        {erro && <p role="alert">{erro}</p>}

        <DetailHeading
          title={colmeia.nome}
          status={colmeia.status}
        />

        <InfoCard
          title={apiario?.nome ?? 'Apiário não encontrado'}
          lines={[
            `Tipo: ${colmeia.tipo}`,
            `Posição: ${colmeia.posicao || 'Não informada'}`,
            `Instalada em: ${colmeia.instaladaEm || 'Não informada'}`
          ]}
        />

        {inspecao && (
          <Stack gap={18}>
            <SectionTitle>Última inspeção</SectionTitle>

            <InfoCard
              title={inspecao.resumo}
              lines={inspecao.detalhes}
            >
              <StatusBadge
                status={colmeia.status}
                label={inspecao.saude}
                block
                className={styles.health}
              />
            </InfoCard>
          </Stack>
        )}

        <Stack gap={18}>
          <SectionTitle>Principais problemas</SectionTitle>

          <InfoCard minHeight={100}>
            {colmeia.problemas.length === 0 ? (
              <PositiveNote>
                Nenhum problema sanitário identificado.
              </PositiveNote>
            ) : (
              colmeia.problemas.map((problema) => (
                <p
                  key={problema}
                  className={`${styles.problem} ${styles[colmeia.status]}`}
                >
                  {problema}
                </p>
              ))
            )}
          </InfoCard>
        </Stack>
      </Stack>

      <Actions>
        <Button to={`/colmeias/${colmeia.id}/inspecoes/nova`}>
          + Nova Inspeção
        </Button>

        <Columns gap={14}>
          <Button
            variant="secondary"
            to={`/colmeias/${colmeia.id}/inspecoes`}
          >
            Histórico
          </Button>

          <Button
            variant="secondary"
            to="/producao/registrar"
          >
            Produção
          </Button>
        </Columns>

        <Button
          variant="secondary"
          to={`/colmeias/${colmeia.id}/editar`}
        >
          Editar
        </Button>

        <Divider />

        <Button
          variant="danger"
          disabled={excluindo}
          onClick={() => setConfirmando(true)}
        >
          Excluir Colmeia
        </Button>
      </Actions>

      <ConfirmDialog
        open={confirmando}
        title={`Excluir ${colmeia.nome}?`}
        description={
          excluindo
            ? 'Excluindo colmeia...'
            : 'Essa ação removerá a colmeia do banco de dados. Confirme explicitamente para continuar.'
        }
        onConfirm={handleExcluir}
        onCancel={() => {
          if (!excluindo) setConfirmando(false)
        }}
      />
    </Screen>
  )
}
