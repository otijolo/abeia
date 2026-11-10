import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from 'firebase/auth'
import { Screen, Stack } from '../../components/layout/Screen'
import { Button } from '../../components/ui/Button'
import { AlertBanner } from '../../components/ui/AlertBanner'
import { TextField } from '../../components/ui/Field'
import { auth } from '../../services/firebase'

/** Confirma a senha atual antes de alterar a credencial no Firebase. */
export function AlterarSenha() {
  const navigate = useNavigate()
  const [atual, setAtual] = useState('')
  const [nova, setNova] = useState('')
  const [confirmacao, setConfirmacao] = useState('')
  const [salvando, setSalvando] = useState(false)
  const [erro, setErro] = useState('')

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (salvando) return
    setErro('')
    if (nova.length < 6) {
      setErro('A nova senha deve ter pelo menos 6 caracteres.')
      return
    }
    if (nova !== confirmacao) {
      setErro('A confirmação deve ser igual à nova senha.')
      return
    }
    const usuario = auth.currentUser
    if (!usuario?.email) {
      setErro('Entre na sua conta antes de alterar a senha.')
      return
    }
    try {
      setSalvando(true)
      await reauthenticateWithCredential(usuario, EmailAuthProvider.credential(usuario.email, atual))
      await updatePassword(usuario, nova)
      navigate('/perfil')
    } catch (error) {
      const codigo = (error as { code?: string }).code
      setErro(codigo === 'auth/invalid-credential' || codigo === 'auth/wrong-password'
        ? 'A senha atual está incorreta.'
        : 'Não foi possível alterar a senha. Confira sua conexão e tente novamente.')
    } finally {
      setSalvando(false)
    }
  }

  return (
    <Screen title="Alterar senha" avatar={false} padding="form">
      <form onSubmit={handleSubmit} style={{ paddingTop: 11 }}>
        <Stack gap={20}>
          {erro && <AlertBanner variant="error">{erro}</AlertBanner>}
          <TextField label="Senha atual" type="password" placeholder="••••••••" autoComplete="current-password"
            value={atual} onChange={(e) => setAtual(e.target.value)} required disabled={salvando} />
          <TextField label="Nova senha" type="password" placeholder="••••••••" autoComplete="new-password"
            value={nova} onChange={(e) => setNova(e.target.value)} minLength={6} required disabled={salvando} />
          <TextField label="Confirmação da nova senha" type="password" placeholder="••••••••" autoComplete="new-password"
            value={confirmacao} onChange={(e) => setConfirmacao(e.target.value)} required disabled={salvando} />
          <div style={{ marginTop: 14 }}>
            <Button type="submit" disabled={salvando}>{salvando ? 'Salvando...' : 'Confirmar'}</Button>
          </div>
        </Stack>
      </form>
    </Screen>
  )
}
