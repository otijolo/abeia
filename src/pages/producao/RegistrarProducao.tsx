import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Screen, Stack } from '../../components/layout/Screen'
import { Button } from '../../components/ui/Button'
import { SelectField, TextArea, TextField } from '../../components/ui/Field'
import { colmeias, opcoes } from '../../data/mock'
import styles from './RegistrarProducao.module.css'

/** Tela de Registrar Produção */
export function RegistrarProducao() {
  const navigate = useNavigate()
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    navigate('/producao')
  }

  return (
    <Screen title="Registrar Produção" avatar={false} padding="form">
      <form onSubmit={handleSubmit}>
        <Stack gap={20}>
          <TextField label="Data" placeholder="Ex: 26/08/1980" />
          <SelectField label="Colmeia" options={colmeias.map((c) => c.nome)} defaultValue="" />
          <div className={styles.row}>
            <TextField label="Quantidade produzida" placeholder="Ex: 12,5" inputMode="decimal" />
            <SelectField label="Unidade" options={opcoes.unidades} defaultValue="" />
          </div>
          <TextArea label="Observações" placeholder="Ex: Mel claro, colheita sem intercorrências." />
          <div style={{ marginTop: 16 }}>
            <Button type="submit">Registrar</Button>
          </div>
        </Stack>
      </form>
    </Screen>
  )
}
