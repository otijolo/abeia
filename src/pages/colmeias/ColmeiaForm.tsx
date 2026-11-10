import { useState, type FormEvent } from 'react'
import { Columns, Stack } from '../../components/layout/Screen'
import { Button } from '../../components/ui/Button'
import { AlertBanner } from '../../components/ui/AlertBanner'
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

function obterDataHojeBR() {
  const agora = new Date()
  const dia = String(agora.getDate()).padStart(2, '0')
  const mes = String(agora.getMonth() + 1).padStart(2, '0')
  const ano = agora.getFullYear()
  return `${dia}/${mes}/${ano}`
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
  const [apiarioId, setApiarioId] = useState(colmeia?.apiarioId ?? apiarioInicialId)
  const [tipo, setTipo] = useState(colmeia?.tipo ?? 'Langstroth')
  const [posicao, setPosicao] = useState(colmeia?.posicao ?? '')
  const [instaladaEm, setInstaladaEm] = useState(colmeia?.instaladaEm ?? '')
  const [observacoes, setObservacoes] = useState(colmeia?.observacoes ?? '')
  const [erro, setErro] = useState('')

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setErro('')

    if (!nome.trim()) {
      setErro('Informe a identificação da colmeia.')
      return
    }

    const apiarioSelecionado = apiarios.find((apiario) => apiario.id === apiarioId)

    if (!apiarioSelecionado) {
      setErro('Selecione um apiário válido para a colmeia.')
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
        instaladaEm: instaladaEm.trim() || obterDataHojeBR(),
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

  const opcoesApiario = apiarios.map((a) => ({
    value: a.id,
    label: `${a.nome} (${a.cidade} - ${a.uf})`
  }))

  return (
    <form onSubmit={handleSubmit}>
      <Stack gap={20}>
        {erro && <AlertBanner variant="error">{erro}</AlertBanner>}

        <TextField
          label="Identificação da colmeia"
          placeholder="Ex: Colmeia P03"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
          disabled={desabilitado}
        />

        <SelectField
          label="Apiário"
          options={opcoesApiario}
          value={apiarioId}
          onChange={(e) => setApiarioId(e.target.value)}
          placeholder="Selecione o apiário..."
          required
          disabled={desabilitado}
        />

        <SelectField
          label="Tipo de colmeia"
          options={
            tipo && !opcoes.tipoColmeia.includes(tipo)
              ? [tipo, ...opcoes.tipoColmeia]
              : opcoes.tipoColmeia
          }
          value={tipo}
          onChange={(e) => setTipo(e.target.value)}
          required
          disabled={desabilitado}
        />

        <Columns gap={12}>
          <TextField
            label="Posição"
            placeholder="Ex: 07"
            value={posicao}
            onChange={(e) => setPosicao(e.target.value)}
            inputMode="numeric"
            disabled={desabilitado}
            optional
          />

          <TextField
            label="Data de instalação"
            placeholder="DD/MM/AAAA"
            value={instaladaEm}
            onChange={(e) => setInstaladaEm(e.target.value)}
            disabled={desabilitado}
            optional
            endAdornment={
              <button
                type="button"
                onClick={() => setInstaladaEm(obterDataHojeBR())}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--color-link)',
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                  padding: '2px 4px'
                }}
              >
                Hoje
              </button>
            }
          />
        </Columns>

        <TextArea
          label="Observações"
          placeholder="Ex: Próxima à linha de árvores, rainha jovem introduzida"
          value={observacoes}
          onChange={(e) => setObservacoes(e.target.value)}
          disabled={desabilitado}
          optional
        />

        <div style={{ marginTop: 12 }}>
          <Button type="submit" disabled={desabilitado}>
            {submitLabel}
          </Button>
        </div>
      </Stack>
    </form>
  )
}
