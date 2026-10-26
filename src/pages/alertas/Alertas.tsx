import { useEffect, useMemo, useState } from 'react'
import { Screen } from '../../components/layout/Screen'
import { Button } from '../../components/ui/Button'
import { ChipGroup } from '../../components/ui/ChipGroup'
import { EmptyState } from '../../components/ui/EmptyState'
import { ListCard, ListStack } from '../../components/ui/ListCard'
import { listarAlertas } from '../../services/alertaService'
import type { Alerta, AlertaEstado } from '../../data/types'

const abas: { value: AlertaEstado; label: string }[] = [
  { value: 'ativo', label: 'Ativos' },
  { value: 'resolvido', label: 'Resolvidos' },
  { value: 'ignorado', label: 'Ignorados' },
]

/** Tela de Alertas */
export function Alertas() {
  const [aba, setAba] = useState<AlertaEstado>('ativo')
  const [alertas, setAlertas] = useState<Alerta[]>([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')

  useEffect(() => {
    let ativo = true

    async function carregarAlertas() {
      try {
        setCarregando(true)
        setErro('')

        const dados = await listarAlertas()

        if (ativo) {
          setAlertas(dados)
        }
      } catch (error) {
        console.error('Erro ao carregar alertas:', error)

        if (ativo) {
          setErro(
            error instanceof Error
              ? error.message
              : 'Não foi possível carregar os alertas.'
          )
        }
      } finally {
        if (ativo) {
          setCarregando(false)
        }
      }
    }

    void carregarAlertas()

    return () => {
      ativo = false
    }
  }, [])

  const lista = useMemo(() => {
    return alertas.filter((a) => a.estado === aba)
  }, [alertas, aba])

  return (
    <Screen title="Alertas" nav="alertas">
      <div style={{ margin: '-8px -5px 0' }}>
        <ChipGroup label="Situação dos alertas" options={abas} value={aba} onChange={setAba} gap={12} size="lg" />
      </div>
      <div style={{ marginTop: 26 }}>
        <ListStack gap={15}>
          {carregando && <p>Carregando alertas...</p>}

          {!carregando && erro && (
            <div role="alert">
              <p>Não foi possível carregar os alertas.</p>
              <p>{erro}</p>
              <Button onClick={() => window.location.reload()}>Tentar novamente</Button>
            </div>
          )}

          {!carregando && !erro && (
            <>
              {lista.map((a) => (
                <ListCard
                  key={a.id}
                  to={`/alertas/${a.id}`}
                  title={a.titulo}
                  subtitle={`${a.origem} • ${a.quando || a.data}`}
                  status={a.status}
                />
              ))}
              {lista.length === 0 && <EmptyState>Nenhum alerta nesta categoria.</EmptyState>}
            </>
          )}
        </ListStack>

        <div style={{ marginTop: 24, paddingBottom: 16 }}>
          <Button to="/alertas/novo">+ Novo Alerta</Button>
        </div>
      </div>
    </Screen>
  )
}
