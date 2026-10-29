import { useState, type FormEvent, type ChangeEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../../services/firebase'
import { buscarPerfil } from '../../services/perfilService'
import { AuthLayout } from '../../components/layout/AuthLayout'
import { Button } from '../../components/ui/Button'
import { TextField } from '../../components/ui/Field'
import { TextLink } from '../../components/ui/TextLink'
import styles from './Login.module.css'

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
      const cred = await signInWithEmailAndPassword(auth, email, senha)
      const usuario = cred.user

      let nomeUsuario = usuario.displayName || ''
      if (!nomeUsuario) {
        try {
          const perfil = await buscarPerfil()
          if (perfil?.nome) {
            nomeUsuario = perfil.nome
          }
        } catch {
          // ignore
        }
      }

      if (!nomeUsuario && usuario.email) {
        nomeUsuario = usuario.email.split('@')[0]
      }

      const iniciais = nomeUsuario
        ? nomeUsuario
            .split(/\s+/)
            .map((p) => p[0])
            .slice(0, 2)
            .join('')
            .toUpperCase()
        : 'U'

      localStorage.setItem('abeia_nome', nomeUsuario)
      localStorage.setItem('abeia_iniciais', iniciais)

      // Redireciona para a tela inicial após logar com sucesso
      navigate('/inicio')
    } catch (err: unknown) {
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
          {erro && (
            <p style={{ color: 'red', fontSize: '14px', marginBottom: '10px' }}>
              {erro}
            </p>
          )}
          <Button type="submit" disabled={carregando}>
            {carregando ? 'Entrando...' : 'Entrar'}
          </Button>
          <div className={styles.recovery}>
            <TextLink to="/recuperar-senha">Esqueci minha senha</TextLink>
          </div>
          <div className={styles.separator}>ou</div>
          <Button variant="secondary" to="/cadastro">
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
