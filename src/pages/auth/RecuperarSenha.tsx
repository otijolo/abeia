import { useState, type FormEvent } from 'react'
import { sendPasswordResetEmail } from 'firebase/auth'
import { auth } from '../../services/firebase'
import { AuthLayout } from '../../components/layout/AuthLayout'
import { Button } from '../../components/ui/Button'
import { TextField } from '../../components/ui/Field'
import { TextLink } from '../../components/ui/TextLink'
import { AlertBanner } from '../../components/ui/AlertBanner'

/** Recupera o acesso pelo link enviado ao e-mail da conta pelo Firebase. */
export function RecuperarSenha() {
  const [email, setEmail] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [enviado, setEnviado] = useState(false)
  const [erro, setErro] = useState('')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (enviando || enviado) return
    setErro('')
    setEnviando(true)
    try {
      await sendPasswordResetEmail(auth, email.trim())
      setEnviado(true)
    } catch (error) {
      const codigo = (error as { code?: string }).code
      if (codigo === 'auth/user-not-found') {
        setEnviado(true)
      } else {
        setErro(codigo === 'auth/too-many-requests'
          ? 'Muitas tentativas. Aguarde um pouco antes de tentar novamente.'
          : codigo === 'auth/invalid-email'
            ? 'Informe um e-mail válido.'
            : 'Não foi possível solicitar a recuperação. Confira sua conexão e tente novamente.')
      }
    } finally {
      setEnviando(false)
    }
  }

  return (
    <AuthLayout
      title="Recuperar senha"
      subtitle="Informe o e-mail usado para entrar no Abeia."
      onSubmit={handleSubmit}
      actions={
        <>
          {!enviado && <Button type="submit" disabled={enviando}>
            {enviando ? 'Enviando...' : 'Enviar link de recuperação'}
          </Button>}
          <div style={{ marginTop: 20 }}>
            <TextLink to="/login">Voltar para o login</TextLink>
          </div>
        </>
      }
    >
      {erro && <AlertBanner variant="error">{erro}</AlertBanner>}
      {enviado ? (
        <AlertBanner variant="success">
          Se existir uma conta com esse e-mail, você receberá um link para definir uma nova senha.
          Confira também a pasta de spam.
        </AlertBanner>
      ) : (
        <TextField label="E-mail da conta" type="email" placeholder="Digite seu e-mail..."
          autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)}
          required disabled={enviando} />
      )}
    </AuthLayout>
  )
}
