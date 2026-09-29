import { useNavigate } from 'react-router-dom'
import { Screen } from '../../components/layout/Screen'
import { ApiarioForm } from './ApiarioForm'

/** 5 - Tela de Cadastro de Apiário */
export function NovoApiario() {
  const navigate = useNavigate()
  return (
    <Screen title="Novo Apiário" padding="form">
      <ApiarioForm submitLabel="Cadastrar" onSubmit={() => navigate('/apiarios')} />
    </Screen>
  )
}
