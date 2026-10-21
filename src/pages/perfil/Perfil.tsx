import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { signOut } from 'firebase/auth'
import { Avatar } from '../../components/brand/Avatar'
import { Screen, Stack } from '../../components/layout/Screen'
import { Button } from '../../components/ui/Button'
import { Divider } from '../../components/ui/Divider'
import { TextField } from '../../components/ui/Field'
import { usuario as mockUsuario } from '../../data/mock'
import { auth } from '../../services/firebase'
import { buscarPerfil, atualizarPerfil } from '../../services/perfilService'
import styles from './Perfil.module.css'

/** Tela de Perfil */
export function Perfil() {
  const navigate = useNavigate()
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [iniciais, setIniciais] = useState('')
  const [carregando, setCarregando] = useState(true)
  const [salvando, setSalvando] = useState(false)
  const [sucesso, setSucesso] = useState(false)
  const [erro, setErro] = useState('')

  useEffect(() => {
    let ativo = true

    async function carregarPerfil() {
      try {
        setCarregando(true)
        const perfil = await buscarPerfil()

        if (ativo) {
          const nomeFinal = perfil?.nome || auth.currentUser?.displayName || mockUsuario.nome
          const emailFinal = perfil?.email || auth.currentUser?.email || mockUsuario.email
          const iniciaisCalculadas =
            perfil?.iniciais ||
            nomeFinal
              .split(' ')
              .map((p) => p[0])
              .slice(0, 2)
              .join('')
              .toUpperCase() ||
            mockUsuario.iniciais

          setNome(nomeFinal)
          setEmail(emailFinal)
          setIniciais(iniciaisCalculadas)
        }
      } catch (err) {
        console.error('Erro ao carregar perfil:', err)
        if (ativo) {
          setNome(mockUsuario.nome)
          setEmail(mockUsuario.email)
          setIniciais(mockUsuario.iniciais)
        }
      } finally {
        if (ativo) {
          setCarregando(false)
        }
      }
    }

    void carregarPerfil()

    return () => {
      ativo = false
    }
  }, [])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSucesso(false)
    setErro('')

    const novasIniciais = nome
      .split(' ')
      .map((p) => p[0])
      .slice(0, 2)
      .join('')
      .toUpperCase()

    try {
      setSalvando(true)
      await atualizarPerfil({
        nome,
        email,
        iniciais: novasIniciais
      })
      setIniciais(novasIniciais)
      setSucesso(true)
      setTimeout(() => setSucesso(false), 3000)
    } catch (err) {
      console.error('Erro ao atualizar perfil:', err)
      setErro(err instanceof Error ? err.message : 'Erro ao salvar alterações.')
    } finally {
      setSalvando(false)
    }
  }

  const handleSair = async () => {
    try {
      await signOut(auth)
      navigate('/login', { replace: true })
    } catch (err) {
      console.error('Erro ao deslogar:', err)
      navigate('/login', { replace: true })
    }
  }

  return (
    <Screen title="Perfil" avatar={false} padding="form">
      <div className={styles.identity}>
        <Avatar size="lg" iniciais={iniciais} />
        <h2>{carregando ? 'Carregando...' : nome}</h2>
      </div>

      <form onSubmit={handleSubmit}>
        <Stack gap={18}>
          {sucesso && (
            <p style={{ color: '#2e7d32', fontSize: '14px', margin: 0 }}>
              Perfil atualizado com sucesso!
            </p>
          )}

          {erro && (
            <p style={{ color: '#d32f2f', fontSize: '14px', margin: 0 }}>
              {erro}
            </p>
          )}

          <TextField
            label="Nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            autoComplete="name"
            required
          />

          <TextField
            label="E-mail"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />
        </Stack>

        <Stack gap={12} className={styles.actions}>
          <Button type="submit" disabled={salvando || carregando}>
            {salvando ? 'Salvando...' : 'Salvar alterações'}
          </Button>

          <Button variant="secondary" to="/perfil/senha">
            Alterar senha
          </Button>

          <Divider />

          <Button variant="danger" type="button" onClick={handleSair}>
            Sair
          </Button>
        </Stack>
      </form>
    </Screen>
  )
}
