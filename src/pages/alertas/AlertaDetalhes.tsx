import { useParams } from 'react-router-dom'
import { Screen, Stack } from '../../components/layout/Screen'
import { Button } from '../../components/ui/Button'
import { BodyText, InfoCard } from '../../components/ui/InfoCard'
import { SectionTitle } from '../../components/ui/SectionTitle'
import { findAlerta } from '../../data/mock'
import { NotFound } from '../NotFound'
import { DetailHeading } from '../shared/DetailHeading'

/** Tela de Detalhes do Alerta */
export function AlertaDetalhes() {
  const { id } = useParams()
  const alerta = findAlerta(id)
  if (!alerta) return <NotFound />

  return (
    <Screen title="Detalhes do Alerta" avatar={false}>
      <Stack gap={30}>
        <DetailHeading title={alerta.tituloDetalhe} date={alerta.data} status={alerta.status} badgeBelow />
        <Stack gap={18}>
          <SectionTitle>Motivo do alerta</SectionTitle>
          <InfoCard minHeight={137}>
            <BodyText>{alerta.motivo}</BodyText>
          </InfoCard>
        </Stack>
        <Stack gap={18}>
          <SectionTitle>Afetado(s)</SectionTitle>
          <InfoCard minHeight={100}>
            {alerta.afetados.map((a) => (
              <BodyText key={a}>{a}</BodyText>
            ))}
          </InfoCard>
        </Stack>
      </Stack>
      {alerta.colmeiaId && (
        <div style={{ marginTop: 34, padding: '0 12px' }}>
          <Button to={`/colmeias/${alerta.colmeiaId}`}>Ver Colmeia</Button>
        </div>
      )}
    </Screen>
  )
}
