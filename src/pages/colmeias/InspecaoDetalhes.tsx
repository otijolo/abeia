import { useParams } from 'react-router-dom'
import { Columns, Screen, Stack } from '../../components/layout/Screen'
import { Button } from '../../components/ui/Button'
import { BodyText, InfoCard, PositiveNote } from '../../components/ui/InfoCard'
import { KeyValueList } from '../../components/ui/KeyValueList'
import { SectionTitle } from '../../components/ui/SectionTitle'
import { findColmeia, findInspecao } from '../../data/mock'
import { NotFound } from '../NotFound'
import { DetailHeading } from '../shared/DetailHeading'

/** Tela de Detalhes da Inspeção */
export function InspecaoDetalhes() {
  const { id } = useParams()
  const inspecao = findInspecao(id)
  const colmeia = findColmeia(inspecao?.colmeiaId)
  if (!inspecao || !colmeia) return <NotFound />

  return (
    <Screen title="Detalhes da Inspeção">
      <Stack gap={24}>
        <DetailHeading title={colmeia.nome} date={inspecao.data} status={inspecao.status} />
        <KeyValueList
          items={[
            ['Força da colônia', inspecao.forcaColonia],
            ['Rainha observada', inspecao.rainhaObservada ? 'Sim' : 'Não'],
            ['Quadros com abelhas', inspecao.quadrosAbelhas],
            ['Quadros com cria', inspecao.quadrosCria],
            ['Postura', inspecao.postura],
          ]}
        />
        <Stack gap={18}>
          <SectionTitle>Pragas e doenças</SectionTitle>
          <InfoCard minHeight={100}>
            {inspecao.pragas.length === 0 ? (
              <PositiveNote>Nenhuma ocorrência relevante.</PositiveNote>
            ) : (
              inspecao.pragas.map((p) => <BodyText key={p}>{p}</BodyText>)
            )}
          </InfoCard>
        </Stack>
        <Stack gap={18}>
          <SectionTitle>Observações</SectionTitle>
          <InfoCard minHeight={100}>
            <BodyText>{inspecao.observacoes}</BodyText>
          </InfoCard>
        </Stack>
      </Stack>

      <div style={{ marginTop: 36, padding: '0 12px' }}>
        <Columns gap={14}>
          <Button to={`/colmeias/${colmeia.id}`}>Ver Colmeia</Button>
          <Button variant="secondary" to={`/colmeias/${colmeia.id}/inspecoes`}>
            Histórico
          </Button>
        </Columns>
      </div>
    </Screen>
  )
}
