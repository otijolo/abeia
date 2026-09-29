import type { FormEvent } from 'react'
import { Stack } from '../../components/layout/Screen'
import { Button } from '../../components/ui/Button'
import { SelectField, TextArea, TextField } from '../../components/ui/Field'
import { apiarios, findApiario, opcoes } from '../../data/mock'
import type { Colmeia } from '../../data/types'

interface Props {
  colmeia?: Colmeia
  submitLabel: string
  onSubmit: () => void
}

/** Formulário compartilhado entre "Nova Colmeia" e "Editar Colmeia" */
export function ColmeiaForm({ colmeia, submitLabel, onSubmit }: Props) {
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    onSubmit()
  }

  return (
    <form onSubmit={handleSubmit}>
      <Stack gap={20}>
        <TextField label="Identificação" placeholder="Ex: Colmeia P03" defaultValue={colmeia?.nome} />
        <SelectField
          label="Apiário"
          options={apiarios.map((a) => a.nome)}
          defaultValue={findApiario(colmeia?.apiarioId)?.nome ?? ''}
        />
        <SelectField label="Tipo de colmeia" options={opcoes.tipoColmeia} defaultValue={colmeia?.tipo ?? ''} />
        <TextField label="Posição" placeholder="Ex: 07" defaultValue={colmeia?.posicao} inputMode="numeric" />
        <TextField label="Data de instalação" placeholder="Ex: 03/10/1911" defaultValue={colmeia?.instaladaEm} />
        <TextArea label="Observações" placeholder="Ex: Próxima a linha de árvores" defaultValue={colmeia?.observacoes} />
        <div style={{ marginTop: 12 }}>
          <Button type="submit">{submitLabel}</Button>
        </div>
      </Stack>
    </form>
  )
}
