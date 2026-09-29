import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Avatar } from '../../components/brand/Avatar'
import { Screen, Stack } from '../../components/layout/Screen'
import { Button } from '../../components/ui/Button'
import { Divider } from '../../components/ui/Divider'
import { TextField } from '../../components/ui/Field'
import { usuario } from '../../data/mock'
import styles from './Perfil.module.css'

/** Tela de Perfil */
export function Perfil() {
  const navigate = useNavigate()
  const handleSubmit = (e: FormEvent) => e.preventDefault()

  return (
    <Screen title="Perfil" avatar={false} padding="form">
      <div className={styles.identity}>
        <Avatar size="lg" />
        <h2>{usuario.nome}</h2>
      </div>
      <form onSubmit={handleSubmit}>
        <Stack gap={18}>
          <TextField label="Nome" defaultValue={usuario.nome} autoComplete="name" />
          <TextField label="E-mail" type="email" defaultValue={usuario.email} autoComplete="email" />
        </Stack>
        <Stack gap={12} className={styles.actions}>
          <Button type="submit">Salvar alterações</Button>
          <Button variant="secondary" to="/perfil/senha">
            Alterar senha
          </Button>
          <Divider />
          <Button variant="danger" onClick={() => navigate('/', { replace: true })}>
            Sair
          </Button>
        </Stack>
      </form>
    </Screen>
  )
}
