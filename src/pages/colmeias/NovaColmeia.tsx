
import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Screen } from '../../components/layout/Screen'
import { AlertBanner } from '../../components/ui/AlertBanner'
import { EmptyState } from '../../components/ui/EmptyState'
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
      {erro && (
        <div style={{ marginBottom: 16 }}>
          <AlertBanner variant="error">{erro}</AlertBanner>
        </div>
      )}

      {carregando ? (
        <p style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: '24px 0' }}>
          Carregando apiários...
        </p>
      ) : apiarios.length === 0 ? (
        <EmptyState
          title="Nenhum apiário cadastrado"
          description="Para cadastrar uma colmeia, você precisa ter pelo menos um apiário para vinculá-la."
          action={{
            label: '+ Cadastrar apiário',
            to: '/apiarios/novo'
          }}
        />
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
