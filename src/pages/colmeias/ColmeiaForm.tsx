
import { useState, type FormEvent } from 'react'
import { Stack } from '../../components/layout/Screen'
import { Button } from '../../components/ui/Button'
import { SelectField, TextArea, TextField } from '../../components/ui/Field'
import { opcoes } from '../../data/mock'
import type { Apiario, Colmeia } from '../../data/types'

interface Props {
  colmeia?: Colmeia
  apiarios: Apiario[]
  apiarioInicialId?: string
  submitLabel: string
  desabilitado?: boolean
  onSubmit: (dados: Omit<Colmeia, 'id'>) => void | Promise<void>
}

/** Formulário compartilhado entre "Nova Colmeia" e "Editar Colmeia" */
export function ColmeiaForm({
  colmeia,
  apiarios,
  apiarioInicialId = '',
  submitLabel,
  desabilitado = false,
  onSubmit
}: Props) {
  const [nome, setNome] = useState(colmeia?.nome ?? '')

  const [apiarioId, setApiarioId] = useState(
    colmeia?.apiarioId ?? apiarioInicialId
  )

  const [tipo, setTipo] = useState(colmeia?.tipo ?? '')
  const [posicao, setPosicao] = useState(colmeia?.posicao ?? '')
  const [instaladaEm, setInstaladaEm] = useState(
    colmeia?.instaladaEm ?? ''
  )
  const [observacoes, setObservacoes] = useState(
    colmeia?.observacoes ?? ''
  )
  const [erro, setErro] = useState('')

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setErro('')

    if (!nome.trim()) {
      setErro('Informe a identificação da colmeia.')
      return
    }

    const apiarioSelecionado = apiarios.find(
      (apiario) => apiario.id === apiarioId
    )

    if (!apiarioSelecionado) {
      setErro('Selecione um apiário válido.')
      return
    }

    if (!tipo) {
      setErro('Selecione o tipo de colmeia.')
      return
    }

    try {
      await onSubmit({
        nome: nome.trim(),
        apiarioId: apiarioSelecionado.id,
        tipo,
        posicao: posicao.trim(),
        instaladaEm: instaladaEm.trim(),
        observacoes: observacoes.trim(),
        status: colmeia?.status ?? 'normal',
        prazoInspecao: colmeia?.prazoInspecao ?? 'Não definida',
        resumoInspecao: colmeia?.resumoInspecao ?? 'Sem inspeções',
        producaoPeriodoKg: colmeia?.producaoPeriodoKg ?? 0,
        ultimaInspecao: colmeia?.ultimaInspecao,
        problemas: colmeia?.problemas ?? []
      })
    } catch (error) {
      console.error('Erro ao enviar formulário:', error)
      setErro('Não foi possível salvar a colmeia. Tente novamente.')
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Stack gap={20}>
        <TextField
          label="Identificação"
          placeholder="Ex: Colmeia P03"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
          disabled={desabilitado}
        />

        <SelectField
          label="Apiário"
          options={apiarios.map((apiario) => apiario.nome)}
          value={apiarios.find((apiario) => apiario.id === apiarioId)?.nome ?? ''}
          onChange={(e) => {
            const selecionado = apiarios.find(
              (apiario) => apiario.nome === e.target.value
            )

            setApiarioId(selecionado?.id ?? '')
          }}
          required
          disabled={desabilitado}
        />

        <SelectField
          label="Tipo de colmeia"
          options={tipo && !opcoes.tipoColmeia.includes(tipo)
            ? [tipo, ...opcoes.tipoColmeia] : opcoes.tipoColmeia}
          value={tipo}
          onChange={(e) => setTipo(e.target.value)}
          required
          disabled={desabilitado}
        />

        <TextField
          label="Posição"
          placeholder="Ex: 07"
          value={posicao}
          onChange={(e) => setPosicao(e.target.value)}
          inputMode="numeric"
          disabled={desabilitado}
        />

        <TextField
          label="Data de instalação"
          placeholder="Ex: 03/10/2026"
          value={instaladaEm}
          onChange={(e) => setInstaladaEm(e.target.value)}
          disabled={desabilitado}
        />

        <TextArea
          label="Observações"
          placeholder="Ex: Próxima à linha de árvores"
          value={observacoes}
          onChange={(e) => setObservacoes(e.target.value)}
          disabled={desabilitado}
        />

        {erro && <p role="alert">{erro}</p>}

        <div style={{ marginTop: 12 }}>
          <Button type="submit" disabled={desabilitado}>
            {submitLabel}
          </Button>
        </div>
      </Stack>
    </form>
  )
}
