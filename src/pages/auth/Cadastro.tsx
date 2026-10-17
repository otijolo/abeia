import { useState, FormEvent, ChangeEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../../services/firebase'
import { AuthLayout } from '../../components/layout/AuthLayout'
import { Button } from '../../components/ui/Button'
import { TextField } from '../../components/ui/Field'
import { TextLink } from '../../components/ui/TextLink'

export function Cadastro() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [confirmaSenha, setConfirmaSenha] = useState('')
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)

  const handleCadastro = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()  
    setErro('')

    if (senha !== confirmaSenha) {
      setErro('As senhas não coincidem.')
      return
    }

    try {
      setCarregando(true)
      // Cria o usuário no Firebase Authentication sem exibir alerta
      await createUserWithEmailAndPassword(auth, email, senha)
      navigate('/login')
    } catch (err: any) {
      console.error(err)
      setErro(`Erro ao cadastrar: ${err.message}`)
    } finally {
      setCarregando(false)
    }
  }

  return (
    <AuthLayout
      title="Crie sua conta"
      subtitle="Organize seus apiários em um só lugar."
      onSubmit={handleCadastro}
      actions={
        <>
          {erro && <p style={{ color: 'red', fontSize: '14px', marginBottom: '10px' }}>{erro}</p>}
          <Button type="submit" disabled={carregando}>
            {carregando ? 'Cadastrando...' : 'Confirmar'}
          </Button>
          <div style={{ marginTop: 20 }}>
            <TextLink to="/login">Já possui uma conta?</TextLink>
          </div>
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
        autoComplete="new-password" 
        value={senha}
        onChange={(e: ChangeEvent<HTMLInputElement>) => setSenha(e.target.value)}
      />
      <TextField 
        label="Confirmação de senha" 
        type="password" 
        placeholder="••••••••" 
        autoComplete="new-password" 
        value={confirmaSenha}
        onChange={(e: ChangeEvent<HTMLInputElement>) => setConfirmaSenha(e.target.value)}
      />
    </AuthLayout>
  )
}