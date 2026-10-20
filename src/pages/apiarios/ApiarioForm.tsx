
import { useState, type FormEvent } from 'react'
import { Columns, Stack } from '../../components/layout/Screen'
import { Button } from '../../components/ui/Button'
import { Checkbox } from '../../components/ui/Checkbox'
import { Field, SelectField, TextField } from '../../components/ui/Field'
import { MapPreview } from '../../components/ui/MapPreview'
import { opcoes } from '../../data/mock'
import type { Apiario } from '../../data/types'

interface Props {
  /** Valores iniciais para edição; vazio para cadastro */
  apiario?: Apiario
  submitLabel: string
  onSubmit: (
    dados: Omit<Apiario, 'id' | 'totalColmeias' | 'status'>
  ) => void | Promise<void>
  desabilitado?: boolean
}

/** Formulário compartilhado entre "Novo Apiário" e "Editar Apiário" */
export function ApiarioForm({
  apiario,
  submitLabel,
  onSubmit,
  desabilitado = false
}: Props) {
  const [nome, setNome] = useState(apiario?.nome ?? '')
  const [cidade, setCidade] = useState(apiario?.cidade ?? '')
  const [uf, setUf] = useState(apiario?.uf ?? '')
  const [descricao, setDescricao] = useState(apiario?.descricao ?? '')
  const [vegetacao, setVegetacao] = useState(apiario?.vegetacao ?? '')
  const [fonteAgua, setFonteAgua] = useState(apiario?.fonteAgua ?? false)
  const [latitude, setLatitude] = useState(apiario?.latitude ?? '')
  const [longitude, setLongitude] = useState(apiario?.longitude ?? '')
  const [observacoes, setObservacoes] = useState(apiario?.observacoes ?? '')
  const [erro, setErro] = useState('')

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setErro('')

    if (!nome.trim()) {
      setErro('Informe o nome do apiário.')
      return
    }

    if (!cidade.trim() || !uf.trim()) {
      setErro('Informe a cidade e o estado do apiário.')
      return
    }

    try {
      await onSubmit({
        nome: nome.trim(),
        cidade: cidade.trim(),
        uf: uf.trim().toUpperCase(),
        descricao: descricao.trim(),
        vegetacao,
        fonteAgua,
        latitude: latitude.trim(),
        longitude: longitude.trim(),
        observacoes: observacoes.trim()
      })
    } catch (error) {
      console.error('Erro ao enviar o formulário:', error)
      setErro('Não foi possível enviar os dados. Tente novamente.')
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Stack gap={20}>
        <TextField
          label="Nome do apiário"
          placeholder="Ex: Apiário de Aquiraz"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
          disabled={desabilitado}
        />

        <TextField
          label="Cidade"
          placeholder="Ex: Aquiraz"
          value={cidade}
          onChange={(e) => setCidade(e.target.value)}
          required
          disabled={desabilitado}
        />

        <TextField
          label="Estado (UF)"
          placeholder="Ex: CE"
          value={uf}
          onChange={(e) => setUf(e.target.value)}
          maxLength={2}
          required
          disabled={desabilitado}
        />

        <TextField
          label="Descrição"
          placeholder="Ex: Área principal de produção"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          disabled={desabilitado}
        />

        <Field label="Localização">
          {() => <MapPreview />}
        </Field>

        <Columns gap={18}>
          <TextField
            label="Latitude"
            placeholder="Ex: -3.8907"
            value={latitude}
            onChange={(e) => setLatitude(e.target.value)}
            inputMode="decimal"
            disabled={desabilitado}
          />

          <TextField
            label="Longitude"
            placeholder="Ex: -38.3905"
            value={longitude}
            onChange={(e) => setLongitude(e.target.value)}
            inputMode="decimal"
            disabled={desabilitado}
          />
        </Columns>

        <SelectField
          label="Tipo de vegetação"
          options={opcoes.vegetacao}
          value={vegetacao}
          onChange={(e) => setVegetacao(e.target.value)}
          disabled={desabilitado}
        />

        <Checkbox
          label="Fonte de água próxima"
          checked={fonteAgua}
          onChange={(e) => setFonteAgua(e.target.checked)}
          disabled={desabilitado}
        />

        <TextField
          label="Observações"
          placeholder="Ex: Acesso pela estrada lateral"
          value={observacoes}
          onChange={(e) => setObservacoes(e.target.value)}
          disabled={desabilitado}
        />

        {erro && (
          <p role="alert">
            {erro}
          </p>
        )}

        <div style={{ marginTop: 12 }}>
          <Button type="submit" disabled={desabilitado}>
            {submitLabel}
          </Button>
        </div>
      </Stack>
    </form>
  )
}
