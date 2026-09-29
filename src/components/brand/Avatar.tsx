import { Link } from 'react-router-dom'
import { usuario } from '../../data/mock'
import styles from './Avatar.module.css'

interface Props {
  size?: 'sm' | 'lg'
  /** Quando informado, o avatar vira um link (ex.: para o perfil) */
  to?: string
}

export function Avatar({ size = 'sm', to }: Props) {
  const content = <span className={`${styles.avatar} ${styles[size]}`}>{usuario.iniciais}</span>
  return to ? (
    <Link to={to} aria-label="Abrir perfil" className={styles.link}>
      {content}
    </Link>
  ) : (
    content
  )
}
