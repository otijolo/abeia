
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Screen, Stack } from '../../components/layout/Screen'
import { Button } from '../../components/ui/Button'
import { ConfirmDialog } from '../../components/ui/ConfirmDialog'
import { Divider } from '../../components/ui/Divider'
import { InfoCard } from '../../components/ui/InfoCard'
import { ListCard, ListStack } from '../../components/ui/ListCard'
import { MapPreview } from '../../components/ui/MapPreview'
import { SectionTitle } from '../../components/ui/SectionTitle'
import { EmptyState } from '../../components/ui/EmptyState'
import {
  buscarApiario,
  excluirApiario
} from '../../services/apiarioService'
import { listarColmeias } from '../../services/colmeiaService'
import type { Apiario, Colmeia } from '../../data/types'
import { NotFound } from '../NotFound'
import { Actions } from '../shared/Actions'
import { DetailHeading } from '../shared/DetailHeading'

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

      setConfirmando(false)
    } finally {
      setExcluindo(false)
    }
  }

  if (carregando) {
    return (
      <Screen title="Detalhes do Apiário">
        <p>Carregando dados do apiário...</p>
      </Screen>
    )
  }

  if (erro && !apiario) {
    return (
      <Screen title="Detalhes do Apiário">
        <p role="alert">{erro}</p>
        <Button onClick={() => navigate('/apiarios')}>
          Voltar para apiários
        </Button>
      </Screen>
    )
  }

  if (!apiario) {
    return <NotFound />
  }

  return (
    <Screen title="Detalhes do Apiário">
      <Stack gap={22}>
        {erro && <p role="alert">{erro}</p>}

        <DetailHeading
          title={apiario.nome}
          status={apiario.status}
        />

        <InfoCard
          title={`${apiario.cidade} - ${apiario.uf}`}
          lines={[
            `Descrição: ${apiario.descricao || 'Não informada'}`,
            `Vegetação: ${apiario.vegetacao || 'Não informada'}`,
            `Fonte de água: ${apiario.fonteAgua ? 'Sim' : 'Não'}`,
            `${apiario.totalColmeias} colmeias cadastradas`,
            `Latitude: ${apiario.latitude || 'Não informada'}`,
            `Longitude: ${apiario.longitude || 'Não informada'}`,
            `Observações: ${apiario.observacoes || 'Nenhuma'}`
          ]}
        />

        <div style={{ padding: '0 7px' }}>
          <MapPreview label={`Mapa do ${apiario.nome}`} />
        </div>

        <Stack gap={18}>
          <SectionTitle>Colmeias</SectionTitle>

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
              <EmptyState>
                Nenhuma colmeia carregada do Firebase ainda.
              </EmptyState>
            )}
          </ListStack>
        </Stack>
      </Stack>

      <Actions>
        <Button to={`/colmeias/nova?apiarioId=${apiario.id}`}>
          + Adicionar Colmeia
        </Button>

        <Button
          variant="secondary"
          to={`/apiarios/${apiario.id}/editar`}
        >
          Editar Apiário
        </Button>

        <Divider />

        <Button
          variant="danger"
          onClick={() => setConfirmando(true)}
          disabled={excluindo}
        >
          Excluir Apiário
        </Button>
      </Actions>

      <ConfirmDialog
        open={confirmando}
        title={`Excluir ${apiario.nome}?`}
        description="Essa ação removerá o apiário e não poderá ser desfeita. Confirme explicitamente para continuar."
        onConfirm={() => void handleExcluir()}
        onCancel={() => setConfirmando(false)}
      />
    </Screen>
  )
}
