import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Screen, Stack } from '../../components/layout/Screen'
import { Button } from '../../components/ui/Button'
import { ConfirmDialog } from '../../components/ui/ConfirmDialog'
import { BodyText, InfoCard } from '../../components/ui/InfoCard'
import { SectionTitle } from '../../components/ui/SectionTitle'
import { buscarAlerta, atualizarEstadoAlerta, excluirAlerta } from '../../services/alertaService'
import type { Alerta } from '../../data/types'
import { NotFound } from '../NotFound'
import { DetailHeading } from '../shared/DetailHeading'

/** Tela de Detalhes do Alerta */
export function AlertaDetalhes() {
  const [idParam] = [useParams().id]
  const navigate = useNavigate()
  const id = idParam
  const [alerta, setAlerta] = useState<Alerta | null>(null)
  const [carregando, setCarregando] = useState(true)
  const [atualizando, setAtualizando] = useState(false)
  const [confirmandoExclusao, setConfirmandoExclusao] = useState(false)
  const [excluindo, setExcluindo] = useState(false)
  const [erro, setErro] = useState('')

  const handleExcluirAlerta = async () => {
    if (!id) return
    try {
      setExcluindo(true)
      await excluirAlerta(id)
      navigate('/alertas', { replace: true })
    } catch (e) {
      console.error('Erro ao excluir alerta:', e)
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
    if (!id || !alerta) return
    try {
      setAtualizando(true)
      await atualizarEstadoAlerta(id, 'resolvido')
      setAlerta({ ...alerta, estado: 'resolvido' })
    } catch (e) {
      console.error('Erro ao resolver alerta:', e)
    } finally {
      setAtualizando(false)
    }
  }

  if (carregando) {
    return (
      <Screen title="Detalhes do Alerta" avatar={false}>
        <p>Carregando alerta...</p>
      </Screen>
    )
  }

  if (erro) {
    return (
      <Screen title="Detalhes do Alerta" avatar={false}>
        <div role="alert">
          <p>{erro}</p>
          <Button onClick={() => window.location.reload()}>Tentar novamente</Button>
        </div>
      </Screen>
    )
  }

  if (!alerta) return <NotFound />

  return (
    <Screen title="Detalhes do Alerta" avatar={false}>
      <Stack gap={30}>
        <DetailHeading
          title={alerta.tituloDetalhe || alerta.titulo}
          date={alerta.data}
          status={alerta.status}
          badgeBelow
        />
        <Stack gap={18}>
          <SectionTitle>Motivo do alerta</SectionTitle>
          <InfoCard minHeight={137}>
            <BodyText>{alerta.motivo}</BodyText>
          </InfoCard>
        </Stack>
        <Stack gap={18}>
          <SectionTitle>Afetado(s)</SectionTitle>
          <InfoCard minHeight={100}>
            {alerta.afetados?.map((a) => (
              <BodyText key={a}>{a}</BodyText>
            ))}
          </InfoCard>
        </Stack>
      </Stack>

      <div style={{ marginTop: 34, padding: '0 12px' }}>
        <Stack gap={12}>
          {alerta.estado === 'ativo' && (
            <Button onClick={handleResolverAlerta} disabled={atualizando}>
              {atualizando ? 'Resolvendo...' : 'Marcar como resolvido'}
            </Button>
          )}
          {alerta.colmeiaId && (
            <Button variant="secondary" to={`/colmeias/${alerta.colmeiaId}`}>
              Ver Colmeia
            </Button>
          )}

          <Button
            variant="danger"
            onClick={() => setConfirmandoExclusao(true)}
            disabled={excluindo}
          >
            Excluir alerta
          </Button>
        </Stack>
      </div>

      <ConfirmDialog
        open={confirmandoExclusao}
        title="Excluir alerta?"
        description="Esta ação não poderá ser desfeita e removerá o alerta do sistema."
        confirmLabel={excluindo ? 'Excluindo...' : 'Excluir'}
        onConfirm={handleExcluirAlerta}
        onCancel={() => setConfirmandoExclusao(false)}
      />
    </Screen>
  )
}
