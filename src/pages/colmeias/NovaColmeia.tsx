
import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Screen } from '../../components/layout/Screen'
import { Button } from '../../components/ui/Button'
import { listarApiarios } from '../../services/apiarioService'
import { criarColmeia } from '../../services/colmeiaService'
import type { Apiario, Colmeia } from '../../data/types'
import { ColmeiaForm } from './ColmeiaForm'

/** Tela de Nova Colmeia */
export function NovaColmeia() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const [apiarios, setApiarios] = useState<Apiario[]>([])
  const [carregando, setCarregando] = useState(true)
  const [salvando, setSalvando] = useState(false)
  const [erro, setErro] = useState('')

  const apiarioInicialId = searchParams.get('apiarioId') ?? ''

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

  async function handleSubmit(
    dados: Omit<Colmeia, 'id'>
  ) {
    try {
      setSalvando(true)
      setErro('')

      await criarColmeia(dados)

      navigate('/colmeias')
    } catch (error) {
      console.error('Erro ao cadastrar colmeia:', error)

      setErro(
        error instanceof Error
          ? error.message
          : 'Não foi possível cadastrar a colmeia.'
      )
    } finally {
      setSalvando(false)
    }
  }

  return (
    <Screen title="Nova Colmeia" padding="form">
      {erro && <p role="alert">{erro}</p>}

      {carregando ? (
        <p>Carregando apiários...</p>
      ) : apiarios.length === 0 ? (
        <div>
          <p>
            Cadastre um apiário antes de adicionar uma colmeia.
          </p>

          <Button to="/apiarios/novo">
            Cadastrar apiário
          </Button>
        </div>
      ) : (
        <ColmeiaForm
          apiarios={apiarios}
          apiarioInicialId={apiarioInicialId}
          submitLabel={salvando ? 'Cadastrando...' : 'Cadastrar'}
          desabilitado={salvando}
          onSubmit={handleSubmit}
        />
      )}
    </Screen>
  )
}
