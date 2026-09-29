import { useNavigate } from 'react-router-dom'
import { AuthLayout } from '../../components/layout/AuthLayout'
import { Button } from '../../components/ui/Button'
import { TextField } from '../../components/ui/Field'
import { TextLink } from '../../components/ui/TextLink'

/** 1 - Tela de Cadastro */
export function Cadastro() {
  const navigate = useNavigate()
  return (
    <AuthLayout
      title="Crie sua conta"
      subtitle="Organize seus apiários em um só lugar."
      onSubmit={(e) => {
        e.preventDefault()
        navigate('/inicio')
      }}
      actions={
        <>
          <Button type="submit">Confirmar</Button>
          <div style={{ marginTop: 20 }}>
            <TextLink to="/login">Já possui uma conta?</TextLink>
          </div>
        </>
      }
    >
      <TextField label="E-mail" type="email" placeholder="Digite seu e-mail..." autoComplete="email" />
      <TextField label="Senha" type="password" placeholder="••••••••" autoComplete="new-password" />
      <TextField label="Confirmação de senha" type="password" placeholder="••••••••" autoComplete="new-password" />
    </AuthLayout>
  )
}
