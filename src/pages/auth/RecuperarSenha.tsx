import { useNavigate } from 'react-router-dom'
import { AuthLayout } from '../../components/layout/AuthLayout'
import { Button } from '../../components/ui/Button'
import { TextField } from '../../components/ui/Field'
import { TextLink } from '../../components/ui/TextLink'

/** 3 - Tela de Recuperação (Alterar senha) */
export function RecuperarSenha() {
  const navigate = useNavigate()
  return (
    <AuthLayout
      title="Alterar senha"
      subtitle="Atualize sua senha de acesso com segurança."
      onSubmit={(e) => {
        e.preventDefault()
        navigate('/login')
      }}
      actions={
        <>
          <Button type="submit">Confirmar</Button>
          <div style={{ marginTop: 20 }}>
            <TextLink to="/login">Voltar para o login</TextLink>
          </div>
        </>
      }
    >
      <TextField label="Senha atual" type="password" placeholder="••••••••" autoComplete="current-password" />
      <TextField label="Nova senha" type="password" placeholder="••••••••" autoComplete="new-password" />
      <TextField label="Confirmação da nova senha" type="password" placeholder="••••••••" autoComplete="new-password" />
    </AuthLayout>
  )
}
