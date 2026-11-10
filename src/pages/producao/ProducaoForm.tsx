import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { Screen, Stack } from '../../components/layout/Screen'
import { Button } from '../../components/ui/Button'
import { AlertBanner } from '../../components/ui/AlertBanner'
import { SelectField, TextArea, TextField } from '../../components/ui/Field'
import { CalendarIcon } from '../../components/icons'
import { opcoes } from '../../data/mock'
import { listarColmeias } from '../../services/colmeiaService'
import { listarApiarios } from '../../services/apiarioService'
import { atualizarProducao, buscarProducao, criarProducao } from '../../services/producaoService'
import type { Apiario, Colmeia, Producao } from '../../data/types'
import { dataDaProducao } from '../../data/producao'
import { formatarData } from '../../data/datas'
import { NotFound } from '../NotFound'
import styles from './RegistrarProducao.module.css'

function obterDataFormatada(): string {
  const agora = new Date()
  const dia = String(agora.getDate()).padStart(2, '0')
  const mes = String(agora.getMonth() + 1).padStart(2, '0')
  const ano = agora.getFullYear()
  return `${dia}/${mes}/${ano}`
}

/** Formulário compartilhado pelo registro e edição de colheitas. */
export function ProducaoForm() {
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const colmeiaParam = searchParams.get('colmeiaId') ?? ''

  const [colmeias, setColmeias] = useState<Colmeia[]>([])
  const [apiarios, setApiarios] = useState<Apiario[]>([])
  const [data, setData] = useState(obterDataFormatada())
  const [colmeiaId, setColmeiaId] = useState(colmeiaParam)
  const [quantidade, setQuantidade] = useState('')
  const [unidade, setUnidade] = useState('kg')
  const [observacoes, setObservacoes] = useState('')
  const [producao, setProducao] = useState<Producao | null>(null)
  const [carregando, setCarregando] = useState(true)
  const [salvando, setSalvando] = useState(false)
  const [erro, setErro] = useState('')

  useEffect(() => {
    let ativo = true
    setCarregando(true)
    setErro('')
    async function carregarDados() {
      try {
        const [dadosColmeias, dadosApiarios, encontrada] = await Promise.all([
          listarColmeias(),
          listarApiarios().catch(() => []),
          id ? buscarProducao(id) : Promise.resolve(null),
        ])
        if (!ativo) return
        setColmeias(dadosColmeias)
        setApiarios(dadosApiarios)
        setProducao(encontrada)
        setData(formatarData(encontrada?.data ?? obterDataFormatada()))
        setColmeiaId(encontrada?.colmeiaId ?? colmeiaParam)
        setQuantidade(encontrada ? String(encontrada.quantidade).replace('.', ',') : '')
        setUnidade(encontrada?.unidade ?? 'kg')
        setObservacoes(encontrada?.observacoes ?? '')
      } catch (error) {
        if (ativo) setErro(error instanceof Error ? error.message : 'Não foi possível carregar os dados.')
      } finally {
        if (ativo) setCarregando(false)
      }
    }
    void carregarDados()
    return () => { ativo = false }
  }, [id, colmeiaParam])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (salvando) return
    setErro('')

    if (!colmeiaId) {
      setErro('Selecione uma colmeia para registrar a produção.')
      return
    }

    if (!dataDaProducao(data.trim())) {
      setErro('Informe uma data válida no formato dia/mês/ano (DD/MM/AAAA).')
      return
    }

    const valorQuantidade = Number(quantidade.trim().replace(',', '.'))
    if (!Number.isFinite(valorQuantidade) || valorQuantidade <= 0) {
      setErro('Informe uma quantidade produzida válida (maior que zero).')
      return
    }

    try {
      setSalvando(true)
      const dados = {
        data: formatarData(data.trim()),
        colmeiaId,
        quantidade: valorQuantidade,
        unidade: unidade || 'kg',
        observacoes: observacoes.trim()
      }
      if (id) await atualizarProducao(id, dados)
      else await criarProducao(dados)
      navigate('/producao')
    } catch (err) {
      console.error('Erro ao registrar produção:', err)
      setErro(err instanceof Error ? err.message : 'Erro ao registrar produção.')
    } finally {
      setSalvando(false)
    }
  }

  const apiarioPorId = new Map(apiarios.map((a) => [a.id, a.nome]))

  const opcoesColmeia = colmeias.map((c) => {
    const nomeApiario = apiarioPorId.get(c.apiarioId)
    return {
      value: c.id,
      label: nomeApiario ? `${c.nome} • ${nomeApiario}` : c.nome
    }
  })

  const tituloTela = id ? 'Editar Produção' : 'Registrar Produção'

  if (carregando) {
    return (
      <Screen title={tituloTela} avatar={false}>
        <p style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: '32px 0' }}>
          Carregando dados...
        </p>
      </Screen>
    )
  }

  if (erro && (id ? !producao : colmeias.length === 0)) {
    return (
      <Screen title={tituloTela} avatar={false}>
        <AlertBanner variant="error">{erro}</AlertBanner>
        <div style={{ marginTop: 16 }}>
          <Button onClick={() => window.location.reload()}>Tentar novamente</Button>
        </div>
      </Screen>
    )
  }

  if (id && !producao) return <NotFound />

  return (
    <Screen title={tituloTela} avatar={false} padding="form" backTo="/producao">
      <form onSubmit={handleSubmit}>
        <Stack gap={20}>
          {erro && <AlertBanner variant="error">{erro}</AlertBanner>}

          <fieldset disabled={salvando || colmeias.length === 0} className={styles.fields}>
            {colmeias.length === 0 && (
              <AlertBanner variant="warning">
                Cadastre pelo menos uma colmeia antes de registrar colheitas de mel.
              </AlertBanner>
            )}

            <TextField
              label="Data da colheita"
              placeholder="DD/MM/AAAA"
              value={data}
              onChange={(e) => setData(e.target.value)}
              required
              startAdornment={<CalendarIcon size={16} />}
              endAdornment={
                <button
                  type="button"
                  onClick={() => setData(obterDataFormatada())}
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

            <SelectField
              label="Colmeia de origem"
              options={opcoesColmeia}
              value={colmeiaId}
              onChange={(e) => setColmeiaId(e.target.value)}
              placeholder="Selecione a colmeia..."
              required
            />

            <div className={styles.row}>
              <TextField
                label="Quantidade colhida"
                placeholder="Ex: 12,5"
                inputMode="decimal"
                value={quantidade}
                onChange={(e) => setQuantidade(e.target.value)}
                required
              />
              <SelectField
                label="Unidade"
                options={opcoes.unidades}
                value={unidade}
                onChange={(e) => setUnidade(e.target.value)}
              />
            </div>

            <TextArea
              label="Observações da colheita"
              placeholder="Ex: Mel claro, excelente viscosidade, favos operculados."
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              optional
            />
          </fieldset>

          <div style={{ marginTop: 16 }}>
            <Button type="submit" disabled={salvando || colmeias.length === 0}>
              {salvando ? 'Salvando...' : id ? 'Salvar alterações' : 'Registrar colheita'}
            </Button>
          </div>
        </Stack>
      </form>
    </Screen>
  )
}
