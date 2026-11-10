import { useEffect, useMemo, useState } from 'react'
import { Screen } from '../../components/layout/Screen'
import { Button } from '../../components/ui/Button'
import { AlertBanner } from '../../components/ui/AlertBanner'
import { ChipGroup } from '../../components/ui/ChipGroup'
import { EmptyState } from '../../components/ui/EmptyState'
import { ListCard, ListStack } from '../../components/ui/ListCard'
import { AlertCircleIcon } from '../../components/icons'
import { listarAlertas } from '../../services/alertaService'
import type { Alerta, AlertaEstado } from '../../data/types'
import styles from '../shared/ListPage.module.css'

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
      <div className={styles.topBar}>
        <div style={{ maxWidth: 440 }}>
          <ChipGroup label="Situação dos alertas" options={abas} value={aba} onChange={setAba} gap={12} size="lg" />
        </div>

        <div className={styles.topActions}>
          <Button to="/alertas/novo" className={styles.topActionBtn}>
            + Novo Alerta
          </Button>
        </div>
      </div>

      <div style={{ marginTop: 26 }}>
        <ListStack gap={15}>
          {carregando && (
            <p style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: '24px 0' }}>
              Carregando alertas...
            </p>
          )}

          {!carregando && erro && (
            <div>
              <AlertBanner variant="error" title="Erro ao carregar alertas">
                {erro}
              </AlertBanner>
              <div style={{ marginTop: 12 }}>
                <Button onClick={() => window.location.reload()}>Tentar novamente</Button>
              </div>
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
              {lista.length === 0 && (
                <EmptyState
                  icon={<AlertCircleIcon size={24} />}
                  title={
                    aba === 'ativo'
                      ? 'Nenhum alerta ativo'
                      : aba === 'resolvido'
                        ? 'Nenhum alerta resolvido'
                        : 'Nenhum alerta ignorado'
                  }
                  description={
                    aba === 'ativo'
                      ? 'Tudo calmo no apiário! Não há ocorrências ou alertas pendentes no momento.'
                      : `Não há alertas classificados como ${aba}s no histórico.`
                  }
                  action={
                    aba === 'ativo'
                      ? { label: '+ Novo Alerta', to: '/alertas/novo' }
                      : undefined
                  }
                />
              )}
            </>
          )}
        </ListStack>

        <div className={styles.cta}>
          <Button to="/alertas/novo">+ Novo Alerta</Button>
        </div>
      </div>
    </Screen>
  )
}
