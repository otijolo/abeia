
import { useEffect, useMemo, useState } from 'react'
import { Screen, Stack } from '../../components/layout/Screen'
import { Button } from '../../components/ui/Button'
import { AlertBanner } from '../../components/ui/AlertBanner'
import { ChipGroup } from '../../components/ui/ChipGroup'
import { ListCard, ListStack } from '../../components/ui/ListCard'
import { SearchBar } from '../../components/ui/SearchBar'
import { TextLink } from '../../components/ui/TextLink'
import { EmptyState } from '../../components/ui/EmptyState'
import { listarApiarios } from '../../services/apiarioService'
import type { Apiario } from '../../data/types'
import { statusFilterOptions, type StatusFilter } from '../../data/filters'
import styles from '../shared/ListPage.module.css'

/** 6 - Tela de Apiários */
export function Apiarios() {
  const [busca, setBusca] = useState('')
  const [filtro, setFiltro] = useState<StatusFilter>('todos')
  const [apiarios, setApiarios] = useState<Apiario[]>([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')

  useEffect(() => {
    let ativo = true

    async function carregarApiarios() {
      try {
        setCarregando(true)
        setErro('')

        const dados = await listarApiarios()

        if (ativo) {
          setApiarios(dados)
        }
      } catch (error) {
        console.error('Erro ao carregar apiários:', error)

        if (ativo) {
          setErro(
            error instanceof Error
              ? error.message
              : 'Não foi possível carregar os apiários.'
          )
        }
      } finally {
        if (ativo) {
          setCarregando(false)
        }
      }
    }

    void carregarApiarios()

    return () => {
      ativo = false
    }
  }, [])

  const lista = useMemo(
    () =>
      apiarios.filter(
        (apiario) =>
          (filtro === 'todos' || apiario.status === filtro) &&
          `${apiario.nome} ${apiario.cidade}`
            .toLowerCase()
            .includes(busca.trim().toLowerCase())
      ),
    [apiarios, busca, filtro]
  )

  return (
    <Screen title="Apiários" nav="apiarios">
      <div className={styles.topBar}>
        <div className={styles.filters}>
          <SearchBar
            placeholder="Buscar apiários..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />

          <ChipGroup
            label="Filtrar por status"
            options={statusFilterOptions}
            value={filtro}
            onChange={setFiltro}
          />
        </div>

        <div className={styles.topActions}>
          <Button to="/apiarios/novo" className={styles.topActionBtn}>
            + Novo Apiário
          </Button>
        </div>
      </div>

      <Stack gap={37} className={styles.results}>
        <ListStack gap={15}>
          {carregando && (
            <p style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: '24px 0' }}>
              Carregando apiários...
            </p>
          )}

          {!carregando && erro && (
            <div>
              <AlertBanner variant="error" title="Erro ao carregar apiários">
                {erro}
              </AlertBanner>
              <div style={{ marginTop: 12 }}>
                <Button onClick={() => window.location.reload()}>Tentar novamente</Button>
              </div>
            </div>
          )}

          {!carregando && !erro && lista.map((apiario) => (
            <ListCard
              key={apiario.id}
              to={`/apiarios/${apiario.id}`}
              title={apiario.nome}
              subtitle={`${apiario.cidade} • ${apiario.totalColmeias} colmeias`}
              status={apiario.status}
            />
          ))}

          {!carregando && !erro && lista.length === 0 && (
            <EmptyState
              title={busca || filtro !== 'todos' ? 'Nenhum apiário encontrado' : 'Nenhum apiário cadastrado'}
              description={
                busca || filtro !== 'todos'
                  ? 'Não encontramos nenhum apiário correspondente aos filtros selecionados.'
                  : 'Cadastre seu primeiro apiário para começar a gerenciar suas colmeias e produções.'
              }
              action={
                busca || filtro !== 'todos'
                  ? { label: 'Limpar filtros', onClick: () => { setBusca(''); setFiltro('todos') } }
                  : { label: '+ Novo Apiário', to: '/apiarios/novo' }
              }
            />
          )}
        </ListStack>

        <div className={styles.cta}>
          <Button to="/apiarios/novo">
            + Novo Apiário
          </Button>
          <div className={styles.mapLink}>
            <TextLink to="/mapa">Ver apiários no mapa</TextLink>
          </div>
        </div>
      </Stack>
    </Screen>
  )
}
