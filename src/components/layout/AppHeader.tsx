import { Link, useNavigate } from 'react-router-dom'
import { DesignIcon } from '../ui/DesignIcon'
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
      <div className={styles.headerInner}>
        {title ? (
          <div className={styles.titleRow}>
            <button type="button" className={styles.back} onClick={goBack} aria-label="Voltar">
              <ChevronLeftIcon size={20} />
            </button>
            <h1 className={styles.title}>{title}</h1>
          </div>
        ) : (
          <div className={styles.brandWrapper}>
            <div className={styles.brandMobile}>
              <Wordmark width={79} />
            </div>
            <div className={styles.contextDesktop}>
              <span className={styles.crumb}>Abeia</span>
              <span className={styles.crumbSep}>/</span>
              <span className={styles.crumbCurrent}>Painel de Controle</span>
            </div>
          </div>
        )}
        {avatar && (
          <div className={styles.avatar}>
            <Link to="/perfil" aria-label="Abrir perfil" className={styles.avatarLink}>
              <DesignIcon name="perfil" />
            </Link>
          </div>
        )}
      </div>
    </header>
  )
}
