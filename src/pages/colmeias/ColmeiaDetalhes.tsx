import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Columns, Screen, Stack } from '../../components/layout/Screen'
import { Button } from '../../components/ui/Button'
import { ConfirmDialog } from '../../components/ui/ConfirmDialog'
import { Divider } from '../../components/ui/Divider'
import { InfoCard, PositiveNote } from '../../components/ui/InfoCard'
import { SectionTitle } from '../../components/ui/SectionTitle'
import { StatusBadge } from '../../components/ui/StatusBadge'
import { findApiario, findColmeia } from '../../data/mock'
import { NotFound } from '../NotFound'
import { Actions } from '../shared/Actions'
import { DetailHeading } from '../shared/DetailHeading'
import styles from './ColmeiaDetalhes.module.css'

/** Tela de Detalhes da Colmeia */
export function ColmeiaDetalhes() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [confirmando, setConfirmando] = useState(false)
  const colmeia = findColmeia(id)
  if (!colmeia) return <NotFound />

  const apiario = findApiario(colmeia.apiarioId)
  const inspecao = colmeia.ultimaInspecao

  return (
    <Screen title="Detalhes da Colmeia">
      <Stack gap={22}>
        <DetailHeading title={colmeia.nome} status={colmeia.status} />
        <InfoCard
          title={apiario?.nome}
          lines={[`Tipo: ${colmeia.tipo}`, `Posição: ${colmeia.posicao}`, `Instalada em ${colmeia.instaladaEm}`]}
        />

        {inspecao && (
          <Stack gap={18}>
            <SectionTitle>Última inspeção</SectionTitle>
            <InfoCard title={inspecao.resumo} lines={inspecao.detalhes}>
              <StatusBadge status={colmeia.status} label={inspecao.saude} block className={styles.health} />
            </InfoCard>
          </Stack>
        )}

        <Stack gap={18}>
          <SectionTitle>Principais problemas</SectionTitle>
          <InfoCard minHeight={100}>
            {colmeia.problemas.length === 0 ? (
              <PositiveNote>Nenhum problema sanitário identificado.</PositiveNote>
            ) : (
              colmeia.problemas.map((p) => (
                <p key={p} className={`${styles.problem} ${styles[colmeia.status]}`}>
                  {p}
                </p>
              ))
            )}
          </InfoCard>
        </Stack>
      </Stack>

      <Actions>
        <Button to={`/colmeias/${colmeia.id}/inspecoes/nova`}>+ Nova Inspeção</Button>
        <Columns gap={14}>
          <Button variant="secondary" to={`/colmeias/${colmeia.id}/inspecoes`}>
            Histórico
          </Button>
          <Button variant="secondary" to="/producao/registrar">
            Produção
          </Button>
        </Columns>
        <Button variant="secondary" to={`/colmeias/${colmeia.id}/editar`}>
          Editar
        </Button>
        <Divider />
        <Button variant="danger" onClick={() => setConfirmando(true)}>
          Excluir Colmeia
        </Button>
      </Actions>

      <ConfirmDialog
        open={confirmando}
        title={`Excluir ${colmeia.nome}?`}
        description="Essa ação removerá a colmeia do apiário e não poderá ser desfeita. Confirme explicitamente para continuar."
        onConfirm={() => navigate('/colmeias', { replace: true })}
        onCancel={() => setConfirmando(false)}
      />
    </Screen>
  )
}
