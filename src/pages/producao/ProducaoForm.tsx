import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Screen, Stack } from '../../components/layout/Screen'
import { Button } from '../../components/ui/Button'
import { SelectField, TextArea, TextField } from '../../components/ui/Field'
import { opcoes } from '../../data/mock'
import { listarColmeias } from '../../services/colmeiaService'
import { atualizarProducao, buscarProducao, criarProducao } from '../../services/producaoService'
import type { Colmeia, Producao } from '../../data/types'
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
  const navigate = useNavigate()
  const [colmeias, setColmeias] = useState<Colmeia[]>([])
  const [data, setData] = useState(obterDataFormatada())
  const [colmeiaId, setColmeiaId] = useState('')
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
        const [dados, encontrada] = await Promise.all([
          listarColmeias(), id ? buscarProducao(id) : Promise.resolve(null),
        ])
        if (!ativo) return
        setColmeias(dados)
        setProducao(encontrada)
        setData(formatarData(encontrada?.data ?? obterDataFormatada()))
        setColmeiaId(encontrada?.colmeiaId ?? '')
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
  }, [id])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (salvando) return
    setErro('')

    if (!colmeiaId) {
      setErro('Selecione uma colmeia.')
      return
    }

    if (!dataDaProducao(data.trim())) {
      setErro('Informe uma data válida no formato dia/mês/ano.')
      return
    }
    const valorQuantidade = Number(quantidade.trim().replace(',', '.'))
    if (!Number.isFinite(valorQuantidade) || valorQuantidade <= 0) {
      setErro('Informe uma quantidade válida.')
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

  const tituloTela = id ? 'Editar Produção' : 'Registrar Produção'
  if (carregando) return <Screen title={tituloTela} avatar={false}><p>Carregando dados...</p></Screen>
  if (erro && (id ? !producao : colmeias.length === 0)) {
    return <Screen title={tituloTela} avatar={false}><p role="alert">{erro}</p>
      <Button onClick={() => window.location.reload()}>Tentar novamente</Button></Screen>
  }
  if (id && !producao) return <NotFound />

  return (
    <Screen title={tituloTela} avatar={false} padding="form" backTo="/producao">
      <form onSubmit={handleSubmit}>
        <Stack gap={20}>
          {erro && (
            <p role="alert" style={{ color: '#d32f2f', fontSize: '14px', margin: 0 }}>
              {erro}
            </p>
          )}

          <fieldset disabled={salvando || colmeias.length === 0} className={styles.fields}>
            {colmeias.length === 0 && <p>Cadastre uma colmeia antes de registrar uma produção.</p>}
            <TextField
              label="Data"
              placeholder="Ex: 26/08/1980"
              value={data}
              onChange={(e) => setData(e.target.value)}
              required
            />

            <SelectField
              label="Colmeia"
              options={colmeias.map((c) => ({ value: c.id, label: c.nome }))}
              value={colmeiaId}
              onChange={(e) => setColmeiaId(e.target.value)}
              placeholder="Selecione a colmeia..."
              required
            />

            <div className={styles.row}>
              <TextField
                label="Quantidade produzida"
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
              label="Observações"
              placeholder="Ex: Mel claro, colheita sem intercorrências."
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
            />
          </fieldset>

          <div style={{ marginTop: 16 }}>
            <Button type="submit" disabled={salvando || colmeias.length === 0}>
              {salvando ? 'Salvando...' : id ? 'Salvar alterações' : 'Registrar'}
            </Button>
          </div>
        </Stack>
      </form>
    </Screen>
  )
}
