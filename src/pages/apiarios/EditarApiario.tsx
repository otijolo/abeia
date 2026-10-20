
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Screen } from '../../components/layout/Screen'
import { Button } from '../../components/ui/Button'
import { buscarApiario, atualizarApiario } from '../../services/apiarioService'
import type { Apiario } from '../../data/types'
import { NotFound } from '../NotFound'
import { ApiarioForm } from './ApiarioForm'

/** 8 - Tela de Edição de Apiário */
export function EditarApiario() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [apiario, setApiario] = useState<Apiario | null>(null)
  const [carregando, setCarregando] = useState(true)
  const [salvando, setSalvando] = useState(false)
  const [erro, setErro] = useState('')

  useEffect(() => {
    let ativo = true

    async function carregarApiario() {
      if (!id) {
        setCarregando(false)
        setErro('O identificador do apiário não foi informado.')
        return
      }

      try {
        setCarregando(true)
        setErro('')

        const resultado = await buscarApiario(id)

        if (ativo) {
          setApiario(resultado)
        }
      } catch (error) {
        console.error('Erro ao carregar apiário:', error)

        if (ativo) {
          setErro(
            error instanceof Error
              ? error.message
              : 'Não foi possível carregar o apiário.'
          )
        }
      } finally {
        if (ativo) {
          setCarregando(false)
        }
      }
    }

    void carregarApiario()

    return () => {
      ativo = false
    }
  }, [id])

  async function handleSubmit(
    dados: Omit<Apiario, 'id' | 'totalColmeias' | 'status'>
  ) {
    if (!id || !apiario) {
      setErro('Não foi possível identificar o apiário para atualizar.')
      return
    }

    try {
      setSalvando(true)
      setErro('')

      await atualizarApiario(id, dados)

      navigate(`/apiarios/${id}`)
    } catch (error) {
      console.error('Erro ao atualizar apiário:', error)

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
      <Screen title="Editar Apiário" padding="form">
        <p>Carregando dados do apiário...</p>
      </Screen>
    )
  }

  if (erro && !apiario) {
    return (
      <Screen title="Editar Apiário" padding="form">
        <p role="alert">{erro}</p>
        <Button onClick={() => navigate('/apiarios')}>
          Voltar para apiários
        </Button>
      </Screen>
    )
  }

  if (!apiario) {
    return <NotFound />
  }

  return (
    <Screen title="Editar Apiário" padding="form">
      {erro && <p role="alert">{erro}</p>}

      <ApiarioForm
        key={apiario.id}
        apiario={apiario}
        submitLabel={salvando ? 'Salvando...' : 'Salvar alterações'}
        onSubmit={handleSubmit}
        desabilitado={salvando}
      />
    </Screen>
  )
}
