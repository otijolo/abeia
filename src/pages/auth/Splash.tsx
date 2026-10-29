import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppIcon, Wordmark } from '../../components/brand/Brand'
import styles from './Splash.module.css'

import { auth } from '../../services/firebase'

const SPLASH_DURATION_MS = 2400

function Hexagon({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 60 66" className={`${styles.hex} ${className}`} aria-hidden="true">
      <path d="M32.6 5.5 52.4 17Q55 18.5 55 21.5V44.5Q55 47.5 52.4 49L32.6 60.5Q30 62 27.4 60.5L7.6 49Q5 47.5 5 44.5V21.5Q5 18.5 7.6 17L27.4 5.5Q30 4 32.6 5.5Z" />
    </svg>
  )
}

/** 0 - Tela de Título: logo + loader de hexágonos, depois segue para o cadastro ou início */
export function Splash() {
  const navigate = useNavigate()

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined
    const unsubscribe = auth.onAuthStateChanged((user) => {
      const destino = user ? '/inicio' : '/login'
      clearTimeout(timer)
      timer = setTimeout(() => navigate(destino, { replace: true, viewTransition: !user }), SPLASH_DURATION_MS)
    })
    return () => {
      unsubscribe()
      clearTimeout(timer)
    }
  }, [navigate])

  return (
    <main className={styles.splash} onClick={() => navigate(auth.currentUser ? '/inicio' : '/login', { replace: true, viewTransition: !auth.currentUser })}>
      <div className={styles.brandIcon}>
        <AppIcon size={178} />
      </div>
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
