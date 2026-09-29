import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppIcon, Wordmark } from '../../components/brand/Brand'
import styles from './Splash.module.css'

const SPLASH_DURATION_MS = 2400

function Hexagon({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 60 66" className={`${styles.hex} ${className}`} aria-hidden="true">
      <path d="M30 4 55 18.5v29L30 62 5 47.5v-29z" />
    </svg>
  )
}

/** 0 - Tela de Título: logo + loader de hexágonos, depois segue para o cadastro */
export function Splash() {
  const navigate = useNavigate()

  useEffect(() => {
    const t = setTimeout(() => navigate('/cadastro', { replace: true }), SPLASH_DURATION_MS)
    return () => clearTimeout(t)
  }, [navigate])

  return (
    <main className={styles.splash} onClick={() => navigate('/cadastro', { replace: true })}>
      <AppIcon size={178} />
      <div className={styles.wordmark}>
        <Wordmark width={326} />
      </div>
      <div className={styles.loader} role="progressbar" aria-label="Carregando">
        <Hexagon className={styles.top} />
        <Hexagon className={styles.left} />
        <Hexagon className={styles.right} />
      </div>
    </main>
  )
}
