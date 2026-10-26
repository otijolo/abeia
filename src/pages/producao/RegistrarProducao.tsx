import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Screen, Stack } from '../../components/layout/Screen'
import { Button } from '../../components/ui/Button'
import { SelectField, TextArea, TextField } from '../../components/ui/Field'
import { opcoes } from '../../data/mock'
import { listarColmeias } from '../../services/colmeiaService'
import { criarProducao } from '../../services/producaoService'
import type { Colmeia } from '../../data/types'
import styles from './RegistrarProducao.module.css'

function obterDataFormatada(): string {
  const agora = new Date()
  const dia = String(agora.getDate()).padStart(2, '0')
  const mes = String(agora.getMonth() + 1).padStart(2, '0')
  const ano = agora.getFullYear()
  return `${dia}/${mes}/${ano}`
}

/** Tela de Registrar Produção */
export function RegistrarProducao() {
  const navigate = useNavigate()
  const [colmeias, setColmeias] = useState<Colmeia[]>([])
  const [data, setData] = useState(obterDataFormatada())
  const [colmeiaId, setColmeiaId] = useState('')
  const [quantidade, setQuantidade] = useState('')
  const [unidade, setUnidade] = useState('kg')
  const [observacoes, setObservacoes] = useState('')
  const [salvando, setSalvando] = useState(false)
  const [erro, setErro] = useState('')

  useEffect(() => {
    async function carregarColmeias() {
      try {
        const dados = await listarColmeias()
        setColmeias(dados)
      } catch {
        setColmeias([])
      }
    }
    void carregarColmeias()
  }, [])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setErro('')

    if (!colmeiaId) {
      setErro('Selecione uma colmeia.')
      return
    }

    const valorQuantidade = parseFloat(quantidade.replace(',', '.'))
    if (isNaN(valorQuantidade) || valorQuantidade <= 0) {
      setErro('Informe uma quantidade válida.')
      return
    }

    try {
      setSalvando(true)
      await criarProducao({
        data,
        colmeiaId,
        quantidade: valorQuantidade,
        unidade: unidade || 'kg',
        observacoes
      })
      navigate('/producao')
    } catch (err) {
      console.error('Erro ao registrar produção:', err)
      setErro(err instanceof Error ? err.message : 'Erro ao registrar produção.')
    } finally {
      setSalvando(false)
    }
  }

  // Mapeamento das opções de colmeias para o select
  const colmeiaSelecionada = colmeias.find((c) => c.id === colmeiaId)

  return (
    <Screen title="Registrar Produção" avatar={false} padding="form">
      <form onSubmit={handleSubmit}>
        <Stack gap={20}>
          {erro && (
            <p style={{ color: '#d32f2f', fontSize: '14px', margin: 0 }}>
              {erro}
            </p>
          )}

          <TextField
            label="Data"
            placeholder="Ex: 26/08/1980"
            value={data}
            onChange={(e) => setData(e.target.value)}
            required
          />

          <SelectField
            label="Colmeia"
            options={colmeias.map((c) => c.nome)}
            value={colmeiaSelecionada?.nome || ''}
            onChange={(e) => {
              const achada = colmeias.find((c) => c.nome === e.target.value)
              setColmeiaId(achada?.id || '')
            }}
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

          <div style={{ marginTop: 16 }}>
            <Button type="submit" disabled={salvando}>
              {salvando ? 'Registrando...' : 'Registrar'}
            </Button>
          </div>
        </Stack>
      </form>
    </Screen>
  )
}
