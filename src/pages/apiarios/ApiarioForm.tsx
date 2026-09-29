import type { FormEvent } from 'react'
import { Columns, Stack } from '../../components/layout/Screen'
import { Button } from '../../components/ui/Button'
import { Checkbox } from '../../components/ui/Checkbox'
import { Field, SelectField, TextField } from '../../components/ui/Field'
import { MapPreview } from '../../components/ui/MapPreview'
import { opcoes } from '../../data/mock'
import type { Apiario } from '../../data/types'

interface Props {
  /** Valores iniciais (edição); vazio = cadastro */
  apiario?: Apiario
  submitLabel: string
  onSubmit: () => void
}

/** Formulário compartilhado entre "Novo Apiário" e "Editar Apiário" */
export function ApiarioForm({ apiario, submitLabel, onSubmit }: Props) {
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    onSubmit()
  }

  return (
    <form onSubmit={handleSubmit}>
      <Stack gap={20}>
        <TextField label="Nome do apiário" placeholder="Ex: Apiário (de) Aquiraz" defaultValue={apiario?.nome} />
        <TextField label="Descrição" placeholder="Ex: Área principal de produção" defaultValue={apiario?.descricao} />
        <Field label="Localização">{() => <MapPreview />}</Field>
        <Columns gap={18}>
          <TextField label="Latitude" placeholder="Ex: -3.8907..." defaultValue={apiario?.latitude} inputMode="decimal" />
          <TextField label="Longitude" placeholder="Ex: -38.3905..." defaultValue={apiario?.longitude} inputMode="decimal" />
        </Columns>
        <SelectField label="Tipo de vegetação" options={opcoes.vegetacao} defaultValue={apiario?.vegetacao ?? ''} />
        <Checkbox label="Fonte de água próxima" defaultChecked={apiario?.fonteAgua} />
        <TextField label="Observações" placeholder="Ex: Acesso pela estrada lateral" defaultValue={apiario?.observacoes} />
        <div style={{ marginTop: 12 }}>
          <Button type="submit">{submitLabel}</Button>
        </div>
      </Stack>
    </form>
  )
}
