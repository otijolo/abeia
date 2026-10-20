
import { useEffect, useMemo, useState } from 'react'
import { Screen, Stack } from '../../components/layout/Screen'
import { Button } from '../../components/ui/Button'
import { ChipGroup } from '../../components/ui/ChipGroup'
import { EmptyState } from '../../components/ui/EmptyState'
import { FilterDropdown } from '../../components/ui/FilterDropdown'
import { ListCard, ListStack } from '../../components/ui/ListCard'
import { SearchBar } from '../../components/ui/SearchBar'
import { statusFilterOptions, type StatusFilter } from '../../data/filters'
import type { Apiario, Colmeia } from '../../data/types'
import { listarApiarios } from '../../services/apiarioService'
import { listarColmeias } from '../../services/colmeiaService'
import styles from '../shared/ListPage.module.css'

/** Tela de Colmeias */
export function Colmeias() {
  const [busca, setBusca] = useState('')
  const [filtro, setFiltro] = useState<StatusFilter>('todos')
  const [apiarioSelecionado, setApiarioSelecionado] = useState('')

  const [colmeias, setColmeias] = useState<Colmeia[]>([])
  const [apiarios, setApiarios] = useState<Apiario[]>([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')

  useEffect(() => {
    let ativo = true

    async function carregarDados() {
      try {
        setCarregando(true)
        setErro('')

        const [dadosColmeias, dadosApiarios] = await Promise.all([
          listarColmeias(),
          listarApiarios()
        ])

        if (ativo) {
          setColmeias(dadosColmeias)
          setApiarios(dadosApiarios)
        }
      } catch (error) {
        console.error('Erro ao carregar colmeias:', error)

        if (ativo) {
          setErro(
            error instanceof Error
              ? error.message
              : 'Não foi possível carregar as colmeias.'
          )
        }
      } finally {
        if (ativo) {
          setCarregando(false)
        }
      }
    }

    void carregarDados()

    return () => {
      ativo = false
    }
  }, [])

  const nomePorApiarioId = useMemo(
    () =>
      new Map(
        apiarios.map((apiario) => [apiario.id, apiario.nome])
      ),
    [apiarios]
  )

  const opcoesApiarios = useMemo(
    () => apiarios.map((apiario) => apiario.nome),
    [apiarios]
  )

  const lista = useMemo(
    () =>
      colmeias.filter((colmeia) => {
        const nomeApiario =
          nomePorApiarioId.get(colmeia.apiarioId) ?? ''

        const correspondeAoFiltro =
          filtro === 'todos' || colmeia.status === filtro

        const correspondeAoApiario =
          !apiarioSelecionado ||
          nomeApiario === apiarioSelecionado

        const correspondeABusca =
          `${colmeia.nome} ${nomeApiario}`
            .toLowerCase()
            .includes(busca.trim().toLowerCase())

        return (
          correspondeAoFiltro &&
          correspondeAoApiario &&
          correspondeABusca
        )
      }),
    [
      colmeias,
      nomePorApiarioId,
      filtro,
      apiarioSelecionado,
      busca
    ]
  )

  return (
    <Screen title="Colmeias" nav="colmeias">
      <div className={styles.filters}>
        <SearchBar
          placeholder="Buscar colmeias..."
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

      <div style={{ padding: '12px 6px 0' }}>
        <FilterDropdown
          label="Apiários"
          options={opcoesApiarios}
          value={apiarioSelecionado}
          onChange={setApiarioSelecionado}
        />
      </div>

      <Stack gap={37} className={styles.results}>
        <ListStack gap={15}>
          {carregando && <p>Carregando colmeias...</p>}

          {!carregando && erro && (
            <div role="alert">
              <p>Não foi possível carregar as colmeias.</p>
              <p>{erro}</p>
              <Button
                onClick={() => window.location.reload()}
              >
                Tentar novamente
              </Button>
            </div>
          )}

          {!carregando && !erro && lista.map((colmeia) => {
            const nomeApiario =
              nomePorApiarioId.get(colmeia.apiarioId) ??
              'Apiário não encontrado'

            return (
              <ListCard
                key={colmeia.id}
                to={`/colmeias/${colmeia.id}`}
                title={colmeia.nome}
                subtitle={`${nomeApiario} • ${colmeia.prazoInspecao}`}
                status={colmeia.status}
              />
            )
          })}

          {!carregando && !erro && lista.length === 0 && (
            <EmptyState>
              Nenhuma colmeia encontrada.
            </EmptyState>
          )}
        </ListStack>

        <div className={styles.cta}>
          <Button to="/colmeias/nova">
            + Nova Colmeia
          </Button>
        </div>
      </Stack>
    </Screen>
  )
}
