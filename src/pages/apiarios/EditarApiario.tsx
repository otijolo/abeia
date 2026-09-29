import { useNavigate, useParams } from 'react-router-dom'
import { Screen } from '../../components/layout/Screen'
import { findApiario } from '../../data/mock'
import { NotFound } from '../NotFound'
import { ApiarioForm } from './ApiarioForm'

/** 8 - Tela de Edição de Apiário */
export function EditarApiario() {
  const { id } = useParams()
  const navigate = useNavigate()
  const apiario = findApiario(id)
  if (!apiario) return <NotFound />

  return (
    <Screen title="Editar Apiário" padding="form">
      <ApiarioForm apiario={apiario} submitLabel="Salvar alterações" onSubmit={() => navigate(`/apiarios/${apiario.id}`)} />
    </Screen>
  )
}
