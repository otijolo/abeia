import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Screen, Stack } from '../../components/layout/Screen'
import { Button } from '../../components/ui/Button'
import { TextField } from '../../components/ui/Field'

/** Tela de Alterar Senha (a partir do perfil) */
export function AlterarSenha() {
  const navigate = useNavigate()
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    navigate('/perfil')
  }

  return (
    <Screen title="Alterar senha" avatar={false} padding="form">
      <form onSubmit={handleSubmit} style={{ paddingTop: 11 }}>
        <Stack gap={20}>
          <TextField label="Senha atual" type="password" placeholder="••••••••" autoComplete="current-password" />
          <TextField label="Nova senha" type="password" placeholder="••••••••" autoComplete="new-password" />
          <TextField label="Confirmação da nova senha" type="password" placeholder="••••••••" autoComplete="new-password" />
          <div style={{ marginTop: 14 }}>
            <Button type="submit">Confirmar</Button>
          </div>
        </Stack>
      </form>
    </Screen>
  )
}
