import { useState, type FormEvent, type ChangeEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { ref, set } from 'firebase/database'
import { auth, db } from '../../services/firebase'
import { atualizarPerfil } from '../../services/perfilService'
import { AuthLayout } from '../../components/layout/AuthLayout'
import { Button } from '../../components/ui/Button'
import { TextField } from '../../components/ui/Field'
import { TextLink } from '../../components/ui/TextLink'

export function Cadastro() {
  const navigate = useNavigate()
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [confirmaSenha, setConfirmaSenha] = useState('')
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)

  const handleCadastro = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setErro('')

    if (!nome.trim()) {
      setErro('Por favor, informe seu nome.')
      return
    }

    if (senha !== confirmaSenha) {
      setErro('As senhas não coincidem.')
      return
    }

    try {
      setCarregando(true)

      // 1. Cria o usuário no Firebase Authentication
      const credencial = await createUserWithEmailAndPassword(
        auth,
        email,
        senha
      )

      const usuario = credencial.user

      // 2. Atualiza o perfil no Firebase Auth com o nome
      await updateProfile(usuario, { displayName: nome.trim() })

      // 3. Calcula iniciais
      const iniciais = nome
        .trim()
        .split(/\s+/)
        .map((p) => p[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()

      // 4. Salva no localStorage para acesso rápido na UI
      localStorage.setItem('abeia_nome', nome.trim())
      localStorage.setItem('abeia_iniciais', iniciais)

      // 5. Salva os dados do usuário no Realtime Database
      await set(ref(db, `usuarios/${usuario.uid}`), {
        nome: nome.trim(),
        email: usuario.email,
        iniciais,
        criadoEm: new Date().toISOString()
      })

      // 6. Cadastra o perfil no backend Java
      try {
        await atualizarPerfil({
          id: usuario.uid,
          nome: nome.trim(),
          email: usuario.email || email,
          iniciais,
          telefone: ''
        })
      } catch (err) {
        console.warn('Backend Java não sincronizado no cadastro:', err)
      }

      // 7. Redireciona para o início já autenticado
      navigate('/inicio')
    } catch (err: unknown) {
      console.error(err)

      if (err instanceof Error) {
        setErro(`Erro ao cadastrar: ${err.message}`)
      } else {
        setErro('Ocorreu um erro ao cadastrar.')
      }
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
          {erro && (
            <p
              style={{
                color: 'red',
                fontSize: '14px',
                marginBottom: '10px'
              }}
            >
              {erro}
            </p>
          )}

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
        label="Nome completo"
        type="text"
        placeholder="Ex.: João da Silva"
        autoComplete="name"
        value={nome}
        onChange={(e: ChangeEvent<HTMLInputElement>) => setNome(e.target.value)}
        required
      />

      <TextField
        label="E-mail"
        type="email"
        placeholder="Digite seu e-mail..."
        autoComplete="email"
        value={email}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          setEmail(e.target.value)
        }
        required
      />

      <TextField
        label="Senha"
        type="password"
        placeholder="••••••••"
        autoComplete="new-password"
        value={senha}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          setSenha(e.target.value)
        }
        required
      />

      <TextField
        label="Confirmação de senha"
        type="password"
        placeholder="••••••••"
        autoComplete="new-password"
        value={confirmaSenha}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          setConfirmaSenha(e.target.value)
        }
        required
      />
    </AuthLayout>
  )
}
