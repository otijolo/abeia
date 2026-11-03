import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Screen, Stack } from '../../components/layout/Screen'
import { Button } from '../../components/ui/Button'
import { ChipGroup } from '../../components/ui/ChipGroup'
import { Field, SelectField, TextArea, TextField } from '../../components/ui/Field'
import { listarColmeias } from '../../services/colmeiaService'
import { atualizarAlerta, buscarAlerta, criarAlerta } from '../../services/alertaService'
import type { Alerta, AlertaEstado, Colmeia, Status } from '../../data/types'
import { NotFound } from '../NotFound'

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

/** Formulário compartilhado pelo cadastro e edição de alertas. */
export function AlertaForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [titulo, setTitulo] = useState('')
  const [origem, setOrigem] = useState('')
  const [status, setStatus] = useState<Status>('atencao')
  const [motivo, setMotivo] = useState('')
  const [afetados, setAfetados] = useState('')
  const [colmeiaId, setColmeiaId] = useState('')
  const [colmeias, setColmeias] = useState<Colmeia[]>([])
  const [alerta, setAlerta] = useState<Alerta | null>(null)
  const [estado, setEstado] = useState<AlertaEstado>('ativo')
  const [carregando, setCarregando] = useState(true)
  const [salvando, setSalvando] = useState(false)
  const [erro, setErro] = useState('')

  useEffect(() => {
    let ativo = true
    setCarregando(true)
    setErro('')
    async function carregarDados() {
      try {
        const [dados, encontrado] = await Promise.all([
          listarColmeias(), id ? buscarAlerta(id) : Promise.resolve(null),
        ])
        if (!ativo) return
        setColmeias(dados)
        setAlerta(encontrado)
        setTitulo(encontrado?.titulo ?? '')
        setOrigem(encontrado?.origem ?? '')
        setStatus(encontrado?.status ?? 'atencao')
        setEstado(encontrado?.estado ?? 'ativo')
        setMotivo(encontrado?.motivo ?? '')
        setAfetados(encontrado?.afetados.join('\n') ?? '')
        setColmeiaId(encontrado?.colmeiaId ?? '')
      } catch (error) {
        if (ativo) setErro(error instanceof Error ? error.message : 'Não foi possível carregar os dados.')
      } finally {
        if (ativo) setCarregando(false)
      }
    }
    void carregarDados()
    return () => { ativo = false }
  }, [id])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (salvando) return
    setErro('')

    if (!titulo.trim()) {
      setErro('Informe o título do alerta.')
      return
    }

    if (!motivo.trim()) {
      setErro('Informe o motivo do alerta.')
      return
    }
    try {
      setSalvando(true)
      const dataHoje = obterDataFormatada()
      const colmeiaSelecionada = colmeias.find((c) => c.id === colmeiaId)
      const origemFinal = origem.trim() || (colmeiaSelecionada ? colmeiaSelecionada.nome : 'Sistema')
      const listaAfetados = afetados.split('\n').map((item) => item.trim()).filter(Boolean)

      const dados = {
        titulo: titulo.trim(),
        tituloDetalhe: titulo.trim(),
        origem: origemFinal,
        quando: alerta?.quando ?? 'Hoje',
        data: alerta?.data ?? dataHoje,
        status,
        estado,
        motivo: motivo.trim(),
        afetados: listaAfetados.length ? listaAfetados : [origemFinal],
        colmeiaId: colmeiaId || ''
      }
      if (id) await atualizarAlerta(id, dados)
      else await criarAlerta(dados)

      navigate(id ? `/alertas/${id}` : '/alertas')
    } catch (err) {
      setErro(err instanceof Error ? err.message : 'Não foi possível salvar o alerta.')
    } finally {
      setSalvando(false)
    }
  }

  const tituloTela = id ? 'Editar Alerta' : 'Novo Alerta'

  if (carregando) return <Screen title={tituloTela} avatar={false}><p>Carregando dados...</p></Screen>
  if (erro && (id ? !alerta : colmeias.length === 0)) {
    return <Screen title={tituloTela} avatar={false}><p role="alert">{erro}</p>
      <Button onClick={() => window.location.reload()}>Tentar novamente</Button></Screen>
  }
  if (id && !alerta) return <NotFound />

  return (
    <Screen title={tituloTela} avatar={false} padding="form" backTo={id ? `/alertas/${id}` : '/alertas'}>
      <form onSubmit={handleSubmit}>
        <Stack gap={20}>
          {erro && (
            <p role="alert" style={{ color: '#d32f2f', fontSize: '14px', margin: 0 }}>
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

          {id && <SelectField label="Situação do alerta" value={estado}
            options={[
              { value: 'ativo', label: 'Ativo' },
              { value: 'resolvido', label: 'Resolvido' },
              { value: 'ignorado', label: 'Ignorado' },
            ]} placeholder="" disabled={salvando}
            onChange={(e) => setEstado(e.target.value as AlertaEstado)} />}

          {colmeias.length > 0 && (
            <SelectField
              label="Colmeia relacionada (opcional)"
              options={colmeias.map((c) => ({ value: c.id, label: c.nome }))}
              value={colmeiaId}
              disabled={salvando}
              onChange={(e) => {
                const achada = colmeias.find((c) => c.id === e.target.value)
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

          <TextArea label="Afetados (um por linha)" value={afetados}
            onChange={(e) => setAfetados(e.target.value)} disabled={salvando}
            placeholder="Se não preencher, será usada a origem do alerta." />

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
              {salvando ? 'Salvando...' : id ? 'Salvar alterações' : 'Criar Alerta'}
            </Button>
          </div>
        </Stack>
      </form>
    </Screen>
  )
}
