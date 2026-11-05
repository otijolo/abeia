import { useEffect, useState, type FormEvent } from 'react'
import { Screen, Stack } from '../../components/layout/Screen'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { SelectField, TextField } from '../../components/ui/Field'
import { SectionTitle } from '../../components/ui/SectionTitle'
import { opcoes, ultimoRelatorio } from '../../data/mock'
import { listarApiarios } from '../../services/apiarioService'
import { listarColmeias } from '../../services/colmeiaService'
import { listarProducoes } from '../../services/producaoService'
import { listarAlertas } from '../../services/alertaService'
import { quantidadeEmKg } from '../../data/producao'
import type { Apiario, Colmeia, Producao as ProducaoType, Alerta } from '../../data/types'
import styles from './Relatorios.module.css'

/** Tela de Relatórios */
export function Relatorios() {
  const [apiarios, setApiarios] = useState<Apiario[]>([])
  const [colmeias, setColmeias] = useState<Colmeia[]>([])
  const [producoes, setProducoes] = useState<ProducaoType[]>([])
  const [alertas, setAlertas] = useState<Alerta[]>([])

  const [tipo, setTipo] = useState(opcoes.tipoRelatorio[0])
  const [periodo, setPeriodo] = useState('01/09/2026 - 01/10/2026')
  const [apiario, setApiario] = useState('')
  const [relatorio, setRelatorio] = useState(ultimoRelatorio)
  const [mensagemSucesso, setMensagemSucesso] = useState('')

  useEffect(() => {
    async function carregar() {
      try {
        const [dadosApiarios, dadosColmeias, dadosProducoes, dadosAlertas] =
          await Promise.all([
            listarApiarios().catch(() => []),
            listarColmeias().catch(() => []),
            listarProducoes().catch(() => []),
            listarAlertas().catch(() => []),
          ])
        setApiarios(dadosApiarios)
        setColmeias(dadosColmeias)
        setProducoes(dadosProducoes)
        setAlertas(dadosAlertas)
      } catch {
        // Fallback silencioso
      }
    }
    void carregar()
  }, [])

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()

    const apiarioObj = apiarios.find((a) => a.nome === apiario)
    const colmeiasFiltradas = apiarioObj
      ? colmeias.filter((c) => c.apiarioId === apiarioObj.id)
      : colmeias

    const idsColmeias = new Set(colmeiasFiltradas.map((c) => c.id))
    const producoesFiltradas = apiarioObj
      ? producoes.filter((p) => idsColmeias.has(p.colmeiaId))
      : producoes

    const somaKg = producoesFiltradas.reduce(
      (acc, p) => acc + quantidadeEmKg(p),
      0
    )
    const totalAlertas = apiarioObj
      ? alertas.filter((a) =>
          a.origem.includes(apiarioObj.nome) ||
          colmeiasFiltradas.some((c) => a.colmeiaId === c.id)
        ).length
      : alertas.length

    setRelatorio({
      titulo: `Relatório de ${tipo} - ${apiario || 'Geral'}`,
      periodo: periodo || 'Período recente',
      resumo: `${apiario || `${apiarios.length} apiários`} • ${colmeiasFiltradas.length} colmeias monitoradas`,
      linhas: [
        `Produção apurada: ${somaKg.toFixed(1)} kg`,
        `Colheitas registradas: ${producoesFiltradas.length} registros`,
        `Ocorrências e alertas: ${totalAlertas} no escopo`,
      ],
    })

    setMensagemSucesso('Relatório gerado com sucesso com base nos dados do sistema!')
    setTimeout(() => setMensagemSucesso(''), 4000)
  }

  return (
    <Screen title="Relatórios" avatar={false}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <Stack gap={20}>
          <SelectField
            label="Tipo de relatório"
            options={opcoes.tipoRelatorio}
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
          />
          <TextField
            label="Período"
            value={periodo}
            onChange={(e) => setPeriodo(e.target.value)}
          />
          <SelectField
            label="Apiário"
            options={apiarios.map((a) => a.nome)}
            placeholder="Todos os apiários"
            value={apiario}
            onChange={(e) => setApiario(e.target.value)}
          />

          {mensagemSucesso && (
            <p style={{ color: '#10b981', fontSize: '14px', fontWeight: 500, margin: '4px 0' }}>
              {mensagemSucesso}
            </p>
          )}

          <div style={{ marginTop: 10 }}>
            <Button type="submit">Gerar relatório</Button>
          </div>
        </Stack>
      </form>

      <Stack gap={18} className={styles.latest}>
        <SectionTitle>Último relatório</SectionTitle>
        <Card to="/producao" className={styles.report}>
          <div className={styles.reportHead}>
            <strong>{relatorio.titulo}</strong>
            <span>{relatorio.periodo}</span>
          </div>
          <span className={styles.reportSummary}>{relatorio.resumo}</span>
          <div className={styles.reportLines}>
            {relatorio.linhas.map((l) => (
              <span key={l}>{l}</span>
            ))}
          </div>
        </Card>
      </Stack>
    </Screen>
  )
}
