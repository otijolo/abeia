
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import { Screen, Stack } from '../../components/layout/Screen'
import { Button } from '../../components/ui/Button'
import { EmptyState } from '../../components/ui/EmptyState'
import { ListCard, ListStack } from '../../components/ui/ListCard'

import { buscarColmeia } from '../../services/colmeiaService'
import { listarInspecoesDaColmeia } from '../../services/inspecaoService'

import type { Colmeia, Inspecao } from '../../data/types'

import { NotFound } from '../NotFound'
import styles from './HistoricoInspecoes.module.css'

/** Tela de Histórico de Inspeções */
export function HistoricoInspecoes() {
  const { id } = useParams()

  const [colmeia, setColmeia] = useState<Colmeia | null>(null)
  const [lista, setLista] = useState<Inspecao[]>([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')

  useEffect(() => {
    let ativo = true

    async function carregarDados() {
      if (!id) {
        setColmeia(null)
        setCarregando(false)
        return
      }

      try {
        setCarregando(true)
        setErro('')

        const colmeiaEncontrada = await buscarColmeia(id)

        if (!ativo) return

        if (!colmeiaEncontrada) {
          setColmeia(null)
          setLista([])
          return
        }

        setColmeia(colmeiaEncontrada)

        const inspecoes = await listarInspecoesDaColmeia(
          colmeiaEncontrada.id
        )

        if (!ativo) return

        setLista(inspecoes)
      } catch (error) {
        if (!ativo) return

        setErro(
          error instanceof Error
            ? error.message
            : 'Não foi possível carregar o histórico de inspeções.'
        )
      } finally {
        if (ativo) {
          setCarregando(false)
        }
      }
    }

    carregarDados()

    return () => {
      ativo = false
    }
  }, [id])

  if (carregando) {
    return (
      <Screen title="Histórico de Inspeções" nav="colmeias">
        <p>Carregando histórico de inspeções...</p>
      </Screen>
    )
  }

  if (!colmeia && !erro) {
    return <NotFound />
  }

  return (
    <Screen title="Histórico de Inspeções" nav="colmeias">
      {erro && (
        <p role="alert">
          {erro}
        </p>
      )}

      {colmeia && (
        <>
          <p className={styles.intro}>
            Histórico cronológico da {colmeia.nome}.
          </p>

          <Stack gap={37}>
            <ListStack gap={15}>
              {lista.map(inspecao => (
                <ListCard
                  key={inspecao.id}
                  to={`/inspecoes/${inspecao.id}`}
                  title={inspecao.data}
                  subtitle={inspecao.resumo}
                  status={inspecao.status}
                />
              ))}

              {lista.length === 0 && !erro && (
                <EmptyState>
                  Nenhuma inspeção registrada.
                </EmptyState>
              )}
            </ListStack>

            <div style={{ padding: '0 10px' }}>
              <Button to={`/colmeias/${colmeia.id}/inspecoes/nova`}>
                + Nova Inspeção
              </Button>
            </div>
          </Stack>
        </>
      )}
    </Screen>
  )
}
