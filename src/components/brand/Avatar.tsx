import { Link } from 'react-router-dom'
import { auth } from '../../services/firebase'
import styles from './Avatar.module.css'

interface Props {
  size?: 'sm' | 'lg'
  /** Quando informado, o avatar vira um link (ex.: para o perfil) */
  to?: string
  iniciais?: string
}

export function Avatar({ size = 'sm', to, iniciais }: Props) {
  const obterIniciaisDinamicas = () => {
    if (iniciais) return iniciais

    const usuarioAtual = auth.currentUser
    if (usuarioAtual?.displayName) {
      return usuarioAtual.displayName
        .split(' ')
        .map((p) => p[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    }

    const salvas = localStorage.getItem('abeia_iniciais')
    if (salvas) return salvas

    if (usuarioAtual?.email) {
      return usuarioAtual.email.slice(0, 2).toUpperCase()
    }

    return 'U'
  }

  const textoIniciais = obterIniciaisDinamicas()

  const content = (
    <span className={`${styles.avatar} ${styles[size]}`}>
      {textoIniciais}
    </span>
  )
  return to ? (
    <Link to={to} aria-label="Abrir perfil" className={styles.link}>
      {content}
    </Link>
  ) : (
    content
  )
}
