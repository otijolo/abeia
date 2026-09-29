import { useNavigate } from 'react-router-dom'
import { Screen } from '../../components/layout/Screen'
import { ColmeiaForm } from './ColmeiaForm'

/** Tela de Nova Colmeia */
export function NovaColmeia() {
  const navigate = useNavigate()
  return (
    <Screen title="Nova Colmeia" padding="form">
      <ColmeiaForm submitLabel="Cadastrar" onSubmit={() => navigate('/colmeias')} />
    </Screen>
  )
}
