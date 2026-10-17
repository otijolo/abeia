import { useState, FormEvent, ChangeEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../../services/firebase'
import { AuthLayout } from '../../components/layout/AuthLayout'
import { Button } from '../../components/ui/Button'
import { TextField } from '../../components/ui/Field'
import { TextLink } from '../../components/ui/TextLink'

/** 2 - Tela de Login */
export function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setErro('')

    try {
      setCarregando(true)
      // Autentica o usuário com o Firebase
      await signInWithEmailAndPassword(auth, email, senha)
      // Redireciona para a tela inicial após logar com sucesso
      navigate('/inicio')
    } catch (err: any) {
      console.error(err)
      setErro('E-mail ou senha inválidos. Verifique seus dados.')
    } finally {
      setCarregando(false)
    }
  }

  return (
    <AuthLayout
      title="Bem-vindo de volta"
      subtitle="Entre para acompanhar suas colmeias."
      onSubmit={handleLogin}
      actions={
        <>
          {erro && <p style={{ color: 'red', fontSize: '14px', marginBottom: '10px' }}>{erro}</p>}
          <Button type="submit" disabled={carregando}>
            {carregando ? 'Entrando...' : 'Entrar'}
          </Button>
          <div style={{ margin: '20px 0 30px' }}>
            <TextLink to="/recuperar-senha">Esqueci minha senha</TextLink>
          </div>
          <Button variant="muted" to="/cadastro">
            Criar conta
          </Button>
        </>
      }
    >
      <TextField 
        label="E-mail" 
        type="email" 
        placeholder="Digite seu e-mail..." 
        autoComplete="email" 
        value={email}
        onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
      />
      <TextField 
        label="Senha" 
        type="password" 
        placeholder="••••••••" 
        autoComplete="current-password" 
        value={senha}
        onChange={(e: ChangeEvent<HTMLInputElement>) => setSenha(e.target.value)}
      />
    </AuthLayout>
  )
}