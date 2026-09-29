import { useMemo, useState } from 'react'
import { Screen, Stack } from '../../components/layout/Screen'
import { Button } from '../../components/ui/Button'
import { ChipGroup } from '../../components/ui/ChipGroup'
import { ListCard, ListStack } from '../../components/ui/ListCard'
import { SearchBar } from '../../components/ui/SearchBar'
import { EmptyState } from '../../components/ui/EmptyState'
import { apiarios } from '../../data/mock'
import { statusFilterOptions, type StatusFilter } from '../../data/filters'
import styles from '../shared/ListPage.module.css'

/** 6 - Tela de Apiários */
export function Apiarios() {
  const [busca, setBusca] = useState('')
  const [filtro, setFiltro] = useState<StatusFilter>('todos')

  const lista = useMemo(
    () =>
      apiarios.filter(
        (a) =>
          (filtro === 'todos' || a.status === filtro) &&
          `${a.nome} ${a.cidade}`.toLowerCase().includes(busca.trim().toLowerCase()),
      ),
    [busca, filtro],
  )

  return (
    <Screen title="Apiários" nav="apiarios">
      <div className={styles.filters}>
        <SearchBar placeholder="Buscar apiários..." value={busca} onChange={(e) => setBusca(e.target.value)} />
        <ChipGroup label="Filtrar por status" options={statusFilterOptions} value={filtro} onChange={setFiltro} />
      </div>

      <Stack gap={37} className={styles.results}>
        <ListStack gap={15}>
          {lista.map((a) => (
            <ListCard
              key={a.id}
              to={`/apiarios/${a.id}`}
              title={a.nome}
              subtitle={`${a.cidade} • ${a.totalColmeias} colmeias`}
              status={a.status}
            />
          ))}
          {lista.length === 0 && <EmptyState>Nenhum apiário encontrado.</EmptyState>}
        </ListStack>
        <div className={styles.cta}>
          <Button to="/apiarios/novo">+ Novo Apiário</Button>
        </div>
      </Stack>
    </Screen>
  )
}
