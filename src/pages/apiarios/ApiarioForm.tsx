import { useState, type FormEvent } from 'react'
import { Columns, Stack } from '../../components/layout/Screen'
import { Button } from '../../components/ui/Button'
import { Checkbox } from '../../components/ui/Checkbox'
import { AlertBanner } from '../../components/ui/AlertBanner'
import { Field, SelectField, TextField } from '../../components/ui/Field'
import { MapPreview } from '../../components/ui/MapPreview'
import { LocateIcon, MapPinIcon } from '../../components/icons'
import { opcoes } from '../../data/mock'
import { opcoesEstados, cidadesSugeridasCE } from '../../data/estados'
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
  const [uf, setUf] = useState(apiario?.uf ?? (apiario ? '' : 'CE'))
  const [descricao, setDescricao] = useState(apiario?.descricao ?? '')
  const [vegetacao, setVegetacao] = useState(apiario?.vegetacao ?? '')
  const [fonteAgua, setFonteAgua] = useState(apiario?.fonteAgua ?? false)
  const [latitude, setLatitude] = useState(apiario?.latitude ?? '')
  const [longitude, setLongitude] = useState(apiario?.longitude ?? '')
  const [observacoes, setObservacoes] = useState(apiario?.observacoes ?? '')
  const [erro, setErro] = useState('')
  const [obtendoGps, setObtendoGps] = useState(false)
  const [feedbackGps, setFeedbackGps] = useState<{ tipo: 'success' | 'warning'; texto: string } | null>(null)

  function handleObterLocalizacao() {
    if (!navigator.geolocation) {
      setFeedbackGps({ tipo: 'warning', texto: 'Geolocalização não suportada neste dispositivo.' })
      return
    }

    setObtendoGps(true)
    setFeedbackGps(null)

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLatitude(pos.coords.latitude.toFixed(5))
        setLongitude(pos.coords.longitude.toFixed(5))
        setObtendoGps(false)
        setFeedbackGps({ tipo: 'success', texto: 'Coordenadas obtidas com sucesso via GPS!' })
      },
      (err) => {
        setObtendoGps(false)
        console.warn('Erro ao obter GPS:', err)
        setFeedbackGps({
          tipo: 'warning',
          texto: 'Permissão de localização negada ou GPS indisponível no momento.'
        })
      },
      { timeout: 10000, enableHighAccuracy: true }
    )
  }

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
        {erro && <AlertBanner variant="error">{erro}</AlertBanner>}

        <TextField
          label="Nome do apiário"
          placeholder="Ex: Apiário de Aquiraz"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
          disabled={desabilitado}
        />

        <Columns gap={12}>
          <div>
            <TextField
              label="Cidade"
              placeholder="Ex: Aquiraz"
              value={cidade}
              onChange={(e) => setCidade(e.target.value)}
              list="cidades-sugeridas"
              required
              disabled={desabilitado}
            />
            <datalist id="cidades-sugeridas">
              {cidadesSugeridasCE.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
          </div>

          <SelectField
            label="Estado (UF)"
            options={opcoesEstados}
            value={uf}
            onChange={(e) => setUf(e.target.value)}
            placeholder="Selecione o estado..."
            required
            disabled={desabilitado}
          />
        </Columns>

        <TextField
          label="Descrição"
          placeholder="Ex: Área principal de produção"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          disabled={desabilitado}
          optional
        />

        <Field label="Localização no mapa" optional>
          {() => <MapPreview />}
        </Field>

        <div>
          <Columns gap={12}>
            <TextField
              label="Latitude"
              placeholder="Ex: -3.8907"
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
              inputMode="decimal"
              disabled={desabilitado}
              startAdornment={<MapPinIcon size={16} />}
              optional
            />

            <TextField
              label="Longitude"
              placeholder="Ex: -38.3905"
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
              inputMode="decimal"
              disabled={desabilitado}
              startAdornment={<MapPinIcon size={16} />}
              optional
            />
          </Columns>

          <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={handleObterLocalizacao}
              disabled={desabilitado || obtendoGps}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                background: 'none',
                border: 'none',
                color: 'var(--color-link)',
                fontSize: 13,
                fontWeight: 600,
                padding: '4px 6px',
                cursor: 'pointer'
              }}
            >
              <LocateIcon size={14} />
              {obtendoGps ? 'Obtendo GPS...' : 'Usar minha localização atual (GPS)'}
            </button>
          </div>

          {feedbackGps && (
            <div style={{ marginTop: 8 }}>
              <AlertBanner
                variant={feedbackGps.tipo === 'success' ? 'success' : 'warning'}
                onClose={() => setFeedbackGps(null)}
              >
                {feedbackGps.texto}
              </AlertBanner>
            </div>
          )}
        </div>

        <SelectField
          label="Tipo de vegetação"
          options={opcoes.vegetacao}
          value={vegetacao}
          onChange={(e) => setVegetacao(e.target.value)}
          placeholder="Selecione o bioma/vegetação..."
          disabled={desabilitado}
          optional
        />

        <Checkbox
          label="Fonte de água próxima"
          checked={fonteAgua}
          onChange={(e) => setFonteAgua(e.target.checked)}
          disabled={desabilitado}
        />

        <TextField
          label="Observações"
          placeholder="Ex: Acesso pela estrada lateral km 14"
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
