import { useMemo, useState } from 'react'
import { Screen, Stack } from '../../components/layout/Screen'
import { Button } from '../../components/ui/Button'
import { ChipGroup } from '../../components/ui/ChipGroup'
import { EmptyState } from '../../components/ui/EmptyState'
import { FilterDropdown } from '../../components/ui/FilterDropdown'
import { ListCard, ListStack } from '../../components/ui/ListCard'
import { SearchBar } from '../../components/ui/SearchBar'
import { statusFilterOptions, type StatusFilter } from '../../data/filters'
import { apiarios, findApiario, findColmeia, ordemColmeias } from '../../data/mock'
import styles from '../shared/ListPage.module.css'

/** Tela de Colmeias */
export function Colmeias() {
  const [busca, setBusca] = useState('')
  const [filtro, setFiltro] = useState<StatusFilter>('todos')
  const [apiario, setApiario] = useState('')

  const lista = useMemo(
    () =>
      ordemColmeias
        .map((id) => findColmeia(id)!)
        .filter((c) => {
          const nomeApiario = findApiario(c.apiarioId)?.nome ?? ''
          return (
            (filtro === 'todos' || c.status === filtro) &&
            (!apiario || nomeApiario === apiario) &&
            `${c.nome} ${nomeApiario}`.toLowerCase().includes(busca.trim().toLowerCase())
          )
        }),
    [busca, filtro, apiario],
  )

  return (
    <Screen title="Colmeias" nav="colmeias">
      <div className={styles.filters}>
        <SearchBar placeholder="Buscar colmeias..." value={busca} onChange={(e) => setBusca(e.target.value)} />
        <ChipGroup label="Filtrar por status" options={statusFilterOptions} value={filtro} onChange={setFiltro} />
      </div>
      <div style={{ padding: '12px 6px 0' }}>
        <FilterDropdown label="Apiários" options={apiarios.map((a) => a.nome)} value={apiario} onChange={setApiario} />
      </div>

      <Stack gap={37} className={styles.results}>
        <ListStack gap={15}>
          {lista.map((c) => (
            <ListCard
              key={c.id}
              to={`/colmeias/${c.id}`}
              title={c.nome}
              subtitle={`${findApiario(c.apiarioId)?.nome} • ${c.prazoInspecao}`}
              status={c.status}
            />
          ))}
          {lista.length === 0 && <EmptyState>Nenhuma colmeia encontrada.</EmptyState>}
        </ListStack>
        <div className={styles.cta}>
          <Button to="/colmeias/nova">+ Nova Colmeia</Button>
        </div>
      </Stack>
    </Screen>
  )
}
