import { useState } from 'react'
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
import { colmeiasDoApiario, findApiario } from '../../data/mock'
import { NotFound } from '../NotFound'
import { Actions } from '../shared/Actions'
import { DetailHeading } from '../shared/DetailHeading'

/** 7 - Tela de Detalhes do Apiário */
export function ApiarioDetalhes() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [confirmando, setConfirmando] = useState(false)
  const apiario = findApiario(id)
  if (!apiario) return <NotFound />

  const lista = colmeiasDoApiario(apiario.id)

  return (
    <Screen title="Detalhes do Apiário">
      <Stack gap={22}>
        <DetailHeading title={apiario.nome} status={apiario.status} />
        <InfoCard
          title={`${apiario.cidade} - ${apiario.uf}`}
          lines={[
            `Vegetação: ${apiario.vegetacao}`,
            `Fonte de água: ${apiario.fonteAgua ? 'Sim' : 'Não'}`,
            `${apiario.totalColmeias} colmeias cadastradas`,
          ]}
        />
        <div style={{ padding: '0 7px' }}>
          <MapPreview label={`Mapa do ${apiario.nome}`} />
        </div>
        <Stack gap={18}>
          <SectionTitle>Colmeias</SectionTitle>
          <ListStack gap={10}>
            {lista.map((c) => (
              <ListCard key={c.id} to={`/colmeias/${c.id}`} title={c.nome} subtitle={c.resumoInspecao} status={c.status} />
            ))}
            {lista.length === 0 && <EmptyState>Nenhuma colmeia cadastrada.</EmptyState>}
          </ListStack>
        </Stack>
      </Stack>

      <Actions>
        <Button to="/colmeias/nova">+ Adicionar Colmeia</Button>
        <Button variant="secondary" to={`/apiarios/${apiario.id}/editar`}>
          Editar Apiário
        </Button>
        <Divider />
        <Button variant="danger" onClick={() => setConfirmando(true)}>
          Excluir Apiário
        </Button>
      </Actions>

      <ConfirmDialog
        open={confirmando}
        title={`Excluir ${apiario.nome}?`}
        description="Essa ação removerá o apiário e não poderá ser desfeita. Confirme explicitamente para continuar."
        onConfirm={() => navigate('/apiarios', { replace: true })}
        onCancel={() => setConfirmando(false)}
      />
    </Screen>
  )
}
