import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Screen, Stack } from '../../components/layout/Screen'
import { Button } from '../../components/ui/Button'
import { ChipGroup } from '../../components/ui/ChipGroup'
import { Field, SelectField, TextArea, TextField } from '../../components/ui/Field'
import { listarColmeias } from '../../services/colmeiaService'
import { criarAlerta } from '../../services/alertaService'
import type { Colmeia, Status } from '../../data/types'

const statusOptions: { value: Status; label: string }[] = [
  { value: 'normal', label: 'Normal' },
  { value: 'atencao', label: 'Atenção' },
  { value: 'critico', label: 'Crítico' }
]

function obterDataFormatada(): string {
  const agora = new Date()
  const dia = String(agora.getDate()).padStart(2, '0')
  const mes = String(agora.getMonth() + 1).padStart(2, '0')
  const ano = agora.getFullYear()
  return `${dia}/${mes}/${ano}`
}

/** Tela de Cadastro de Novo Alerta */
export function NovoAlerta() {
  const navigate = useNavigate()
  const [titulo, setTitulo] = useState('')
  const [origem, setOrigem] = useState('')
  const [status, setStatus] = useState<Status>('atencao')
  const [motivo, setMotivo] = useState('')
  const [colmeiaId, setColmeiaId] = useState('')
  const [colmeias, setColmeias] = useState<Colmeia[]>([])
  const [salvando, setSalvando] = useState(false)
  const [erro, setErro] = useState('')

  useEffect(() => {
    async function carregarColmeias() {
      try {
        const dados = await listarColmeias()
        setColmeias(dados)
      } catch {
        // Fallback silencioso
      }
    }
    void carregarColmeias()
  }, [])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setErro('')

    if (!titulo.trim()) {
      setErro('Informe o título do alerta.')
      return
    }

    try {
      setSalvando(true)
      const dataHoje = obterDataFormatada()
      const colmeiaSelecionada = colmeias.find((c) => c.id === colmeiaId)
      const origemFinal = origem.trim() || (colmeiaSelecionada ? colmeiaSelecionada.nome : 'Sistema')

      await criarAlerta({
        titulo,
        tituloDetalhe: titulo,
        origem: origemFinal,
        quando: 'Hoje',
        data: dataHoje,
        status,
        estado: 'ativo',
        motivo,
        afetados: [origemFinal],
        colmeiaId: colmeiaId || undefined
      })

      navigate('/alertas')
    } catch (err) {
      console.error('Erro ao cadastrar alerta:', err)
      setErro(err instanceof Error ? err.message : 'Erro ao cadastrar alerta.')
    } finally {
      setSalvando(false)
    }
  }

  const colmeiaSelecionada = colmeias.find((c) => c.id === colmeiaId)

  return (
    <Screen title="Novo Alerta" avatar={false} padding="form">
      <form onSubmit={handleSubmit}>
        <Stack gap={20}>
          {erro && (
            <p style={{ color: '#d32f2f', fontSize: '14px', margin: 0 }}>
              {erro}
            </p>
          )}

          <TextField
            label="Título do alerta"
            placeholder="Ex: Risco de enxameação"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            required
            disabled={salvando}
          />

          <Field label="Status de gravidade">
            {() => (
              <ChipGroup
                label="Status de gravidade"
                options={statusOptions}
                value={status}
                onChange={setStatus}
                gap={12}
              />
            )}
          </Field>

          {colmeias.length > 0 && (
            <SelectField
              label="Colmeia relacionada (opcional)"
              options={colmeias.map((c) => c.nome)}
              value={colmeiaSelecionada?.nome || ''}
              onChange={(e) => {
                const achada = colmeias.find((c) => c.nome === e.target.value)
                setColmeiaId(achada?.id || '')
                if (achada) {
                  setOrigem(achada.nome)
                }
              }}
              placeholder="Nenhuma ou Geral"
            />
          )}

          <TextField
            label="Origem do alerta"
            placeholder="Ex: Apiário Sabiá ou Colmeia D03"
            value={origem}
            onChange={(e) => setOrigem(e.target.value)}
            disabled={salvando}
          />

          <TextArea
            label="Motivo detalhado"
            placeholder="Ex: Identificado acúmulo excessivo de abelhas na entrada..."
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
            required
            disabled={salvando}
          />

          <div style={{ marginTop: 16 }}>
            <Button type="submit" disabled={salvando}>
              {salvando ? 'Criando alerta...' : 'Criar Alerta'}
            </Button>
          </div>
        </Stack>
      </form>
    </Screen>
  )
}
