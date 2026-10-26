import { useEffect, useState, type FormEvent } from 'react'
import { Screen, Stack } from '../../components/layout/Screen'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { SelectField, TextField } from '../../components/ui/Field'
import { SectionTitle } from '../../components/ui/SectionTitle'
import { opcoes, ultimoRelatorio } from '../../data/mock'
import { listarApiarios } from '../../services/apiarioService'
import type { Apiario } from '../../data/types'
import styles from './Relatorios.module.css'

/** Tela de Relatórios */
export function Relatorios() {
  const [apiarios, setApiarios] = useState<Apiario[]>([])
  const handleSubmit = (e: FormEvent) => e.preventDefault()

  useEffect(() => {
    async function carregar() {
      try {
        const dados = await listarApiarios()
        setApiarios(dados)
      } catch {
        setApiarios([])
      }
    }
    void carregar()
  }, [])

  return (
    <Screen title="Relatórios" avatar={false}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <Stack gap={20}>
          <SelectField label="Tipo de relatório" options={opcoes.tipoRelatorio} defaultValue="" />
          <TextField label="Período" defaultValue="01/09/2026 - 01/10/2026" />
          <SelectField
            label="Apiário"
            options={apiarios.map((a) => a.nome)}
            placeholder="Todos os apiários"
            defaultValue=""
          />
          <div style={{ marginTop: 10 }}>
            <Button type="submit">Gerar relatório</Button>
          </div>
        </Stack>
      </form>

      <Stack gap={18} className={styles.latest}>
        <SectionTitle>Último relatório</SectionTitle>
        <Card to="/producao" className={styles.report}>
          <div className={styles.reportHead}>
            <strong>{ultimoRelatorio.titulo}</strong>
            <span>{ultimoRelatorio.periodo}</span>
          </div>
          <span className={styles.reportSummary}>{ultimoRelatorio.resumo}</span>
          <div className={styles.reportLines}>
            {ultimoRelatorio.linhas.map((l) => (
              <span key={l}>{l}</span>
            ))}
          </div>
        </Card>
      </Stack>
    </Screen>
  )
}
