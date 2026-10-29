
import { useState, type FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { Columns, Screen, Stack } from '../../components/layout/Screen'
import { Button } from '../../components/ui/Button'
import { Checkbox } from '../../components/ui/Checkbox'
import { ChipGroup } from '../../components/ui/ChipGroup'
import { Field, TextArea, TextField } from '../../components/ui/Field'
import { MultiSelectField } from '../../components/ui/MultiSelectField'
import { Stepper } from '../../components/ui/Stepper'

import { opcoes } from '../../data/mock'
import { criarInspecao } from '../../services/inspecaoService'

type Forca = 'fraca' | 'media' | 'forte'
type Postura = 'ruim' | 'padrao' | 'boa'
type Nivel = 'baixo' | 'medio' | 'alto'

const forcaOptions: { value: Forca; label: string }[] = [
  { value: 'fraca', label: 'Fraca' },
  { value: 'media', label: 'Média' },
  { value: 'forte', label: 'Forte'
  }
]

const posturaOptions: { value: Postura; label: string }[] = [
  { value: 'ruim', label: 'Ruim' },
  { value: 'padrao', label: 'Padrão' },
  { value: 'boa', label: 'Boa' }
]

const nivelOptions: { value: Nivel; label: string }[] = [
  { value: 'baixo', label: 'Baixo' },
  { value: 'medio', label: 'Médio' },
  { value: 'alto', label: 'Alto' }
]

function obterDataAtual(): string {
  const agora = new Date()
  const ano = agora.getFullYear()
  const mes = String(agora.getMonth() + 1).padStart(2, '0')
  const dia = String(agora.getDate()).padStart(2, '0')

  return `${ano}-${mes}-${dia}`
}

/** Tela de Nova Inspeção */
export function NovaInspecao() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [data, setData] = useState(obterDataAtual())
  const [forca, setForca] = useState<Forca>('fraca')
  const [postura, setPostura] = useState<Postura>('ruim')
  const [nivel, setNivel] = useState<Nivel>('baixo')
  const [sintomas, setSintomas] = useState<string[]>([])
  const [abelhas, setAbelhas] = useState(6)
  const [cria, setCria] = useState(4)
  const [rainhaObservada, setRainhaObservada] = useState(false)
  const [observacoes, setObservacoes] = useState('')
  const [salvando, setSalvando] = useState(false)
  const [erro, setErro] = useState('')

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setErro('')

    if (!id) {
      setErro('Não foi possível identificar a colmeia desta inspeção.')
      return
    }

    try {
      setSalvando(true)

      const status =
        nivel === 'baixo'
          ? 'normal'
          : nivel === 'medio'
            ? 'atencao'
            : 'critico'

      const resumo =
        nivel === 'baixo'
          ? 'Inspeção sem problemas graves'
          : nivel === 'medio'
            ? 'Inspeção com pontos de atenção'
            : 'Inspeção com problemas críticos'

      await criarInspecao({
        colmeiaId: id,
        data,
        resumo,
        status,
        forcaColonia: forca,
        rainhaObservada,
        quadrosAbelhas: abelhas,
        quadrosCria: cria,
        postura,
        pragas: sintomas,
        observacoes
      })

      navigate(`/colmeias/${id}/inspecoes`, { replace: true })
    } catch (error) {
      console.error('Erro ao registrar inspeção:', error)

      setErro(
        error instanceof Error
          ? error.message
          : 'Não foi possível registrar a inspeção.'
      )
    } finally {
      setSalvando(false)
    }
  }

  return (
    <Screen title="Nova Inspeção" padding="form">
      <form onSubmit={handleSubmit}>
        <Stack gap={20}>
          <TextField
            label="Data da inspeção"
            type="date"
            value={data}
            onChange={(e) => setData(e.target.value)}
            required
            disabled={salvando}
          />

          <Field label="Força da colônia">
            {() => (
              <ChipGroup
                label="Força da colônia"
                options={forcaOptions}
                value={forca}
                onChange={setForca}
                gap={12}
              />
            )}
          </Field>

          <Field label="Qualidade da postura">
            {() => (
              <ChipGroup
                label="Qualidade da postura"
                options={posturaOptions}
                value={postura}
                onChange={setPostura}
                gap={12}
              />
            )}
          </Field>

          <MultiSelectField
            label="Sintomas notados"
            options={opcoes.sintomas}
            value={sintomas}
            onChange={setSintomas}
            disabled={salvando}
          />

          <Columns gap={30}>
            <Stepper
              label="Quadros com abelhas"
              value={abelhas}
              onChange={setAbelhas}
            />

            <Stepper
              label="Quadros com cria"
              value={cria}
              onChange={setCria}
            />
          </Columns>

          <Field label="Nível do problema">
            {() => (
              <ChipGroup
                label="Nível do problema"
                options={nivelOptions}
                value={nivel}
                onChange={setNivel}
                gap={12}
              />
            )}
          </Field>

          <Checkbox
            label="Rainha observada"
            checked={rainhaObservada}
            onChange={(e) => setRainhaObservada(e.target.checked)}
            disabled={salvando}
          />

          <TextArea
            label="Observações"
            placeholder="Ex: Colônia ativa e comportamento normal."
            value={observacoes}
            onChange={(e) => setObservacoes(e.target.value)}
            disabled={salvando}
          />

          {erro && <p role="alert">{erro}</p>}

          <div style={{ marginTop: 8 }}>
            <Button type="submit" disabled={salvando}>
              {salvando ? 'Salvando inspeção...' : 'Finalizar inspeção'}
            </Button>
          </div>
        </Stack>
      </form>
    </Screen>
  )
}
