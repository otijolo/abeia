import { useState } from 'react'
import { Screen } from '../../components/layout/Screen'
import { ChipGroup } from '../../components/ui/ChipGroup'
import { EmptyState } from '../../components/ui/EmptyState'
import { ListCard, ListStack } from '../../components/ui/ListCard'
import { alertas } from '../../data/mock'
import type { AlertaEstado } from '../../data/types'

const abas: { value: AlertaEstado; label: string }[] = [
  { value: 'ativo', label: 'Ativos' },
  { value: 'resolvido', label: 'Resolvidos' },
  { value: 'ignorado', label: 'Ignorados' },
]

/** Tela de Alertas */
export function Alertas() {
  const [aba, setAba] = useState<AlertaEstado>('ativo')
  const lista = alertas.filter((a) => a.estado === aba)

  return (
    <Screen title="Alertas" nav="alertas">
      <div style={{ margin: '-8px -5px 0' }}>
        <ChipGroup label="Situação dos alertas" options={abas} value={aba} onChange={setAba} gap={12} size="lg" />
      </div>
      <div style={{ marginTop: 26 }}>
        <ListStack gap={15}>
          {lista.map((a) => (
            <ListCard key={a.id} to={`/alertas/${a.id}`} title={a.titulo} subtitle={`${a.origem} • ${a.quando}`} status={a.status} />
          ))}
          {lista.length === 0 && <EmptyState>Nenhum alerta nesta categoria.</EmptyState>}
        </ListStack>
      </div>
    </Screen>
  )
}
