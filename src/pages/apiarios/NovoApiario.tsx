
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Screen } from '../../components/layout/Screen'
import { ApiarioForm } from './ApiarioForm'
import { criarApiario } from '../../services/apiarioService'

/** 5 - Tela de Cadastro de Apiário */
export function NovoApiario() {
  const navigate = useNavigate()
  const [erro, setErro] = useState('')
  const [salvando, setSalvando] = useState(false)

  async function handleSubmit(dados: Parameters<typeof criarApiario>[0]) {
    try {
      setSalvando(true)
      setErro('')

      await criarApiario(dados)

      navigate('/apiarios')
    } catch (error) {
      console.error('Erro ao cadastrar apiário:', error)

      setErro(
        error instanceof Error
          ? error.message
          : 'Não foi possível cadastrar o apiário.'
      )
    } finally {
      setSalvando(false)
    }
  }

  return (
    <Screen title="Novo Apiário" padding="form">
      {erro && (
        <p role="alert">
          Não foi possível cadastrar o apiário: {erro}
        </p>
      )}

      <ApiarioForm
        submitLabel={salvando ? 'Cadastrando...' : 'Cadastrar'}
        onSubmit={handleSubmit}
        desabilitado={salvando}
      />
    </Screen>
  )
}
