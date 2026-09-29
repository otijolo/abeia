import { useParams } from 'react-router-dom'
import { Screen, Stack } from '../../components/layout/Screen'
import { Button } from '../../components/ui/Button'
import { EmptyState } from '../../components/ui/EmptyState'
import { ListCard, ListStack } from '../../components/ui/ListCard'
import { findColmeia, inspecoesDaColmeia } from '../../data/mock'
import { NotFound } from '../NotFound'
import styles from './HistoricoInspecoes.module.css'

/** Tela de Histórico de Inspeções */
export function HistoricoInspecoes() {
  const { id } = useParams()
  const colmeia = findColmeia(id)
  if (!colmeia) return <NotFound />

  const lista = inspecoesDaColmeia(colmeia.id)

  return (
    <Screen title="Histórico de Inspeções" nav="colmeias">
      <p className={styles.intro}>Histórico cronológico da {colmeia.nome}.</p>
      <Stack gap={37}>
        <ListStack gap={15}>
          {lista.map((i) => (
            <ListCard key={i.id} to={`/inspecoes/${i.id}`} title={i.data} subtitle={i.resumo} status={i.status} />
          ))}
          {lista.length === 0 && <EmptyState>Nenhuma inspeção registrada.</EmptyState>}
        </ListStack>
        <div style={{ padding: '0 10px' }}>
          <Button to={`/colmeias/${colmeia.id}/inspecoes/nova`}>+ Nova Inspeção</Button>
        </div>
      </Stack>
    </Screen>
  )
}
