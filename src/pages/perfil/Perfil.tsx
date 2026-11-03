import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { signOut } from 'firebase/auth'
import { Avatar } from '../../components/brand/Avatar'
import { Wordmark } from '../../components/brand/Brand'
import beeUrl from '../../assets/figma/abelha.png'
import { Screen, Stack } from '../../components/layout/Screen'
import { Button } from '../../components/ui/Button'
import { ConfirmDialog } from '../../components/ui/ConfirmDialog'
import { Divider } from '../../components/ui/Divider'
import { TextField } from '../../components/ui/Field'
import { auth } from '../../services/firebase'
import { buscarPerfil, criarPerfil, atualizarPerfil, excluirPerfil } from '../../services/perfilService'
import styles from './Perfil.module.css'

function iniciaisDoNome(nome: string) {
  return nome.trim().split(/\s+/).slice(0, 2).map((parte) => parte[0] || '').join('').toUpperCase()
}

/** Cadastro, consulta, edição e exclusão dos dados do perfil. */
export function Perfil() {
  const navigate = useNavigate()
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [telefone, setTelefone] = useState('')
  const [iniciais, setIniciais] = useState('')
  const [cadastrado, setCadastrado] = useState(false)
  const [carregando, setCarregando] = useState(true)
  const [falhaCarga, setFalhaCarga] = useState(false)
  const [tentativa, setTentativa] = useState(0)
  const [salvando, setSalvando] = useState(false)
  const [excluindo, setExcluindo] = useState(false)
  const [confirmandoExclusao, setConfirmandoExclusao] = useState(false)
  const [sucesso, setSucesso] = useState('')
  const [erro, setErro] = useState('')

  useEffect(() => {
    let ativo = true
    setCarregando(true)
    setFalhaCarga(false)
    setErro('')
    async function carregar() {
      try {
        const perfil = await buscarPerfil()
        if (!ativo) return
        const nomeInicial = perfil?.nome ?? auth.currentUser?.displayName ?? ''
        setCadastrado(!!perfil)
        setNome(nomeInicial)
        setEmail(perfil?.email ?? auth.currentUser?.email ?? '')
        setTelefone(perfil?.telefone ?? '')
        setIniciais(perfil?.iniciais || iniciaisDoNome(nomeInicial))
        if (perfil) {
          localStorage.setItem('abeia_nome', perfil.nome)
          localStorage.setItem('abeia_iniciais', perfil.iniciais || iniciaisDoNome(perfil.nome))
        }
      } catch (error) {
        if (ativo) {
          setFalhaCarga(true)
          setErro(error instanceof Error ? error.message : 'Não foi possível carregar o perfil.')
        }
      } finally {
        if (ativo) setCarregando(false)
      }
    }
    void carregar()
    return () => { ativo = false }
  }, [tentativa])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (salvando || excluindo || falhaCarga) return
    setErro('')
    setSucesso('')
    if (!nome.trim()) {
      setErro('Informe seu nome.')
      return
    }
    const dados = { nome: nome.trim(), email: email.trim(), telefone: telefone.trim(), iniciais: iniciaisDoNome(nome) }
    try {
      setSalvando(true)
      if (cadastrado) await atualizarPerfil(dados)
      else await criarPerfil(dados)
      setCadastrado(true)
      setNome(dados.nome)
      setIniciais(dados.iniciais)
      localStorage.setItem('abeia_nome', dados.nome)
      localStorage.setItem('abeia_iniciais', dados.iniciais)
      setSucesso('Perfil salvo com sucesso!')
    } catch (error) {
      setErro(error instanceof Error ? error.message : 'Não foi possível salvar o perfil.')
    } finally {
      setSalvando(false)
    }
  }

  async function handleExcluir() {
    if (excluindo || salvando) return
    setErro('')
    setSucesso('')
    try {
      setExcluindo(true)
      await excluirPerfil()
      setCadastrado(false)
      setNome('')
      setEmail('')
      setTelefone('')
      setIniciais('')
      localStorage.removeItem('abeia_nome')
      localStorage.removeItem('abeia_iniciais')
      setSucesso('Dados do perfil excluídos. Sua conta de acesso continua ativa.')
    } catch (error) {
      setErro(error instanceof Error ? error.message : 'Não foi possível excluir o perfil.')
    } finally {
      setExcluindo(false)
      setConfirmandoExclusao(false)
    }
  }

  async function handleSair() {
    try {
      await signOut(auth)
      localStorage.removeItem('abeia_nome')
      localStorage.removeItem('abeia_iniciais')
      navigate('/login', { replace: true })
    } catch {
      setErro('Não foi possível sair. Tente novamente.')
    }
  }

  const ocupado = carregando || salvando || excluindo
  return (
    <Screen title="Perfil" avatar={false} padding="form">
      <div className={styles.identity}>
        <div className={styles.portrait}>
          <Avatar size="lg" iniciais={iniciais || 'U'} />
          <img src={beeUrl} alt="" className={styles.bee} />
        </div>
        <h2>{carregando ? 'Carregando...' : nome || 'Meu perfil'}</h2>
      </div>
      {erro && <p role="alert" className={styles.error}>{erro}</p>}
      {sucesso && <p role="status" className={styles.success}>{sucesso}</p>}
      {falhaCarga && <Button onClick={() => setTentativa((valor) => valor + 1)}>Tentar novamente</Button>}
      <form onSubmit={handleSubmit}>
        <fieldset disabled={ocupado || falhaCarga} className={styles.fields}>
          <TextField label="Nome" value={nome} onChange={(e) => setNome(e.target.value)}
            autoComplete="name" required />
          <TextField label="E-mail" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
            autoComplete="email" required />
          <p className={styles.note}>O e-mail de contato não altera seu e-mail de acesso.</p>
          <TextField label="Telefone (opcional)" type="tel" value={telefone}
            onChange={(e) => setTelefone(e.target.value)} autoComplete="tel" />
        </fieldset>
        <Stack gap={12} className={styles.actions}>
          <Button type="submit" disabled={ocupado || falhaCarga}>
            {salvando ? 'Salvando...' : cadastrado ? 'Salvar alterações' : 'Criar perfil'}
          </Button>
          <Button variant="secondary" to="/perfil/senha">Alterar senha</Button>
          {cadastrado && <Button variant="danger" type="button" disabled={ocupado || falhaCarga}
            onClick={() => setConfirmandoExclusao(true)}>Excluir dados do perfil</Button>}
          <Divider />
          <Button variant="danger" type="button" onClick={() => void handleSair()} disabled={ocupado}>Sair</Button>
        </Stack>
      </form>
      <ConfirmDialog open={confirmandoExclusao} title="Excluir dados do perfil?"
        description="Remove seu nome, e-mail de contato e telefone cadastrados. Sua conta de acesso e os registros de apiários e colmeias serão mantidos."
        confirmLabel={excluindo ? 'Excluindo...' : 'Excluir dados'}
        onConfirm={() => void handleExcluir()}
        onCancel={() => { if (!excluindo) setConfirmandoExclusao(false) }} />
      <div className={styles.wordmark}><Wordmark width={78} /></div>
    </Screen>
  )
}
