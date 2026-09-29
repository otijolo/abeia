import { Screen } from '../components/layout/Screen'
import { Button } from '../components/ui/Button'
import { EmptyState } from '../components/ui/EmptyState'

export function NotFound() {
  return (
    <Screen title="Não encontrado" avatar={false} backTo="/inicio">
      <EmptyState>Não encontramos o que você procurava.</EmptyState>
      <Button to="/inicio">Voltar ao início</Button>
    </Screen>
  )
}
