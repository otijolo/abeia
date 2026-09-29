import { useState, type FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Columns, Screen, Stack } from '../../components/layout/Screen'
import { Button } from '../../components/ui/Button'
import { Checkbox } from '../../components/ui/Checkbox'
import { ChipGroup } from '../../components/ui/ChipGroup'
import { Field, SelectField, TextArea, TextField } from '../../components/ui/Field'
import { Stepper } from '../../components/ui/Stepper'
import { opcoes } from '../../data/mock'

type Forca = 'fraca' | 'media' | 'forte'
type Postura = 'ruim' | 'padrao' | 'boa'
type Nivel = 'baixo' | 'medio' | 'alto'

const forcaOptions: { value: Forca; label: string }[] = [
  { value: 'fraca', label: 'Fraca' },
  { value: 'media', label: 'Média' },
  { value: 'forte', label: 'Forte' },
]
const posturaOptions: { value: Postura; label: string }[] = [
  { value: 'ruim', label: 'Ruim' },
  { value: 'padrao', label: 'Padrão' },
  { value: 'boa', label: 'Boa' },
]
const nivelOptions: { value: Nivel; label: string }[] = [
  { value: 'baixo', label: 'Baixo' },
  { value: 'medio', label: 'Médio' },
  { value: 'alto', label: 'Alto' },
]

/** Tela de Nova Inspeção */
export function NovaInspecao() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [forca, setForca] = useState<Forca>('fraca')
  const [postura, setPostura] = useState<Postura>('ruim')
  const [nivel, setNivel] = useState<Nivel>('baixo')
  const [abelhas, setAbelhas] = useState(6)
  const [cria, setCria] = useState(4)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    navigate(`/colmeias/${id}/inspecoes`, { replace: true })
  }

  return (
    <Screen title="Nova Inspeção" padding="form">
      <form onSubmit={handleSubmit}>
        <Stack gap={20}>
          <TextField label="Data da inspeção" placeholder="Ex: 03/05/1967" />
          <Field label="Força da colônia">
            {() => <ChipGroup label="Força da colônia" options={forcaOptions} value={forca} onChange={setForca} gap={12} />}
          </Field>
          <Field label="Qualidade da postura">
            {() => (
              <ChipGroup label="Qualidade da postura" options={posturaOptions} value={postura} onChange={setPostura} gap={12} />
            )}
          </Field>
          <SelectField label="Sintomas notados" options={opcoes.sintomas} defaultValue="" />
          <Columns gap={30}>
            <Stepper label="Quadros com abelhas" value={abelhas} onChange={setAbelhas} />
            <Stepper label="Quadros com cria" value={cria} onChange={setCria} />
          </Columns>
          <Field label="Nível do problema">
            {() => <ChipGroup label="Nível do problema" options={nivelOptions} value={nivel} onChange={setNivel} gap={12} />}
          </Field>
          <Checkbox label="Rainha observada" />
          <TextArea label="Observações" placeholder="Ex: Colônia ativa e comportamento normal." />
          <div style={{ marginTop: 8 }}>
            <Button type="submit">Finalizar inspeção</Button>
          </div>
        </Stack>
      </form>
    </Screen>
  )
}
