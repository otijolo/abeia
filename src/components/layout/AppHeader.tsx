import { useNavigate } from 'react-router-dom'
import { Avatar } from '../brand/Avatar'
import { Wordmark } from '../brand/Brand'
import { ChevronLeftIcon } from '../icons'
import styles from './AppHeader.module.css'

interface Props {
  /** Título da tela; sem título o cabeçalho mostra a marca Abeia */
  title?: string
  /** Mostra o avatar do usuário à direita (padrão: true) */
  avatar?: boolean
  /** Rota de retorno; por padrão volta no histórico */
  backTo?: string
}

export function AppHeader({ title, avatar = true, backTo }: Props) {
  const navigate = useNavigate()
  const goBack = () => {
    if (backTo) navigate(backTo)
    else if (window.history.state?.idx > 0) navigate(-1)
    else navigate('/inicio')
  }

  return (
    <header className={styles.header}>
      {title ? (
        <div className={styles.titleRow}>
          <button type="button" className={styles.back} onClick={goBack} aria-label="Voltar">
            <ChevronLeftIcon size={20} />
          </button>
          <h1 className={styles.title}>{title}</h1>
        </div>
      ) : (
        <div className={styles.brand}>
          <Wordmark width={79} />
        </div>
      )}
      {avatar && (
        <div className={styles.avatar}>
          <Avatar to="/perfil" />
        </div>
      )}
    </header>
  )
}
