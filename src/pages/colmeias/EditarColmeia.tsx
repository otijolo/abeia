import { useNavigate, useParams } from 'react-router-dom'
import { Screen } from '../../components/layout/Screen'
import { findColmeia } from '../../data/mock'
import { NotFound } from '../NotFound'
import { ColmeiaForm } from './ColmeiaForm'

/** Tela de Edição de Colmeia */
export function EditarColmeia() {
  const { id } = useParams()
  const navigate = useNavigate()
  const colmeia = findColmeia(id)
  if (!colmeia) return <NotFound />

  return (
    <Screen title="Editar Colmeia" padding="form">
      <ColmeiaForm colmeia={colmeia} submitLabel="Salvar" onSubmit={() => navigate(`/colmeias/${colmeia.id}`)} />
    </Screen>
  )
}
