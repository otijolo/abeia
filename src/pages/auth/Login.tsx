import { useNavigate } from 'react-router-dom'
import { AuthLayout } from '../../components/layout/AuthLayout'
import { Button } from '../../components/ui/Button'
import { TextField } from '../../components/ui/Field'
import { TextLink } from '../../components/ui/TextLink'

/** 2 - Tela de Login */
export function Login() {
  const navigate = useNavigate()
  return (
    <AuthLayout
      title="Bem-vindo de volta"
      subtitle="Entre para acompanhar suas colmeias."
      onSubmit={(e) => {
        e.preventDefault()
        navigate('/inicio')
      }}
      actions={
        <>
          <Button type="submit">Entrar</Button>
          <div style={{ margin: '20px 0 30px' }}>
            <TextLink to="/recuperar-senha">Esqueci minha senha</TextLink>
          </div>
          <Button variant="muted" to="/cadastro">
            Criar conta
          </Button>
        </>
      }
    >
      <TextField label="E-mail" type="email" placeholder="Digite seu e-mail..." autoComplete="email" />
      <TextField label="Senha" type="password" placeholder="••••••••" autoComplete="current-password" />
    </AuthLayout>
  )
}
