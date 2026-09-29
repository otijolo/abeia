import { useState } from 'react'
import { TrophyIcon } from '../../components/icons'
import { Columns, Screen, Stack } from '../../components/layout/Screen'
import { BarChart } from '../../components/ui/BarChart'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { FilterDropdown } from '../../components/ui/FilterDropdown'
import { IconBubble } from '../../components/ui/IconBubble'
import { ListCard, ListStack } from '../../components/ui/ListCard'
import { SectionTitle } from '../../components/ui/SectionTitle'
import { StatusBadge } from '../../components/ui/StatusBadge'
import { apiarios, colmeias, findColmeia, producaoMensal, producaoResumo } from '../../data/mock'
import { Actions } from '../shared/Actions'
import styles from './Producao.module.css'

const podio = ['honey', 'silver', 'bronze'] as const
const periodos = ['Últimos 30 dias', 'Últimos 6 meses', 'Este ano']

/** Tela de Produção */
export function Producao() {
  const [periodo, setPeriodo] = useState('')
  const [apiario, setApiario] = useState('')
  const [colmeia, setColmeia] = useState('')
  const ranking = producaoResumo.ranking.map((id) => findColmeia(id)!)

  return (
    <Screen title="Produção" nav="producao">
      <div className={styles.filters}>
        <Columns gap={12} count={3}>
          <FilterDropdown label="Período" options={periodos} value={periodo} onChange={setPeriodo} />
          <FilterDropdown label="Apiário" options={apiarios.map((a) => a.nome)} value={apiario} onChange={setApiario} />
          <FilterDropdown label="Colmeia" options={colmeias.map((c) => c.nome)} value={colmeia} onChange={setColmeia} />
        </Columns>
      </div>

      <Stack gap={30}>
        <Card className={styles.total}>
          <div>
            <span className={styles.totalLabel}>Produção total</span>
            <strong className={styles.totalValue}>{producaoResumo.totalKg} kg</strong>
          </div>
          <StatusBadge status={producaoResumo.status} />
        </Card>

        <Stack gap={18}>
          <SectionTitle>Evolução da produção</SectionTitle>
          <BarChart data={producaoMensal} label="Produção mensal em kg" />
        </Stack>

        <Stack gap={18}>
          <SectionTitle>Ranking das colmeias</SectionTitle>
          <ListStack gap={12}>
            {ranking.map((c, i) => (
              <ListCard
                key={c.id}
                to={`/colmeias/${c.id}`}
                title={c.nome}
                subtitle={`${c.producaoPeriodoKg}kg no período`}
                status="normal"
                icon={
                  <IconBubble tone={podio[i]}>
                    <TrophyIcon size={18} />
                  </IconBubble>
                }
              />
            ))}
          </ListStack>
        </Stack>
      </Stack>

      <Actions>
        <Button to="/producao/registrar">+ Registrar produção</Button>
        <Button variant="secondary" to="/relatorios">
          Relatórios
        </Button>
      </Actions>
    </Screen>
  )
}
