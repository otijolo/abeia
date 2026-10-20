
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { Screen } from '../../components/layout/Screen'
import { Button } from '../../components/ui/Button'

import {listarApiarios } from '../../services/apiarioService'
import {
  atualizarColmeia,
  buscarColmeia
} from '../../services/colmeiaService'

import type { Apiario, Colmeia } from '../../data/types'

import { NotFound } from '../NotFound'
import { ColmeiaForm } from './ColmeiaForm'

/** Tela de Edição de Colmeia */
export function EditarColmeia() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [colmeia, setColmeia] = useState<Colmeia | null>(null)
  const [apiarios, setApiarios] = useState<Apiario[]>([])
  const [carregando, setCarregando] = useState(true)
  const [salvando, setSalvando] = useState(false)
  const [erro, setErro] = useState('')

  useEffect(() => {
    let ativo = true

    async function carregarDados() {
      if (!id) {
        setErro('O identificador da colmeia não foi informado.')
        setCarregando(false)
        return
      }

      try {
        setCarregando(true)
        setErro('')

        const [colmeiaEncontrada, apiariosEncontrados] =
          await Promise.all([
            buscarColmeia(id),
            listarApiarios()
          ])

        if (!ativo) return

        setColmeia(colmeiaEncontrada)
        setApiarios(apiariosEncontrados)
      } catch (error) {
        console.error('Erro ao carregar dados da edição:', error)

        if (ativo) {
          setErro(
            error instanceof Error
              ? error.message
              : 'Não foi possível carregar os dados.'
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
  }, [id])

  async function handleSubmit(dados: Omit<Colmeia, 'id'>) {
    if (!id || !colmeia) {
      setErro('Não foi possível identificar a colmeia.')
      return
    }

    try {
      setSalvando(true)
      setErro('')

      await atualizarColmeia(id, dados)

      navigate(`/colmeias/${id}`)
    } catch (error) {
      console.error('Erro ao atualizar colmeia:', error)

      setErro(
        error instanceof Error
          ? error.message
          : 'Não foi possível salvar as alterações.'
      )
    } finally {
      setSalvando(false)
    }
  }

  if (carregando) {
    return (
      <Screen title="Editar Colmeia" padding="form">
        <p>Carregando dados da colmeia...</p>
      </Screen>
    )
  }

  if (erro && !colmeia) {
    return (
      <Screen title="Editar Colmeia" padding="form">
        <p role="alert">{erro}</p>
        <Button onClick={() => navigate('/colmeias')}>
          Voltar para colmeias
        </Button>
      </Screen>
    )
  }

  if (!colmeia) {
    return <NotFound />
  }

  if (apiarios.length === 0) {
    return (
      <Screen title="Editar Colmeia" padding="form">
        <p role="alert">
          Não foi possível encontrar apiários para associar à colmeia.
        </p>
        <Button to="/apiarios/novo">Cadastrar apiário</Button>
      </Screen>
    )
  }

  return (
    <Screen title="Editar Colmeia" padding="form">
      {erro && <p role="alert">{erro}</p>}

      <ColmeiaForm
        key={colmeia.id}
        colmeia={colmeia}
        apiarios={apiarios}
        apiarioInicialId={colmeia.apiarioId}
        submitLabel={salvando ? 'Salvando...' : 'Salvar'}
        desabilitado={salvando}
        onSubmit={handleSubmit}
      />
    </Screen>
  )
}
