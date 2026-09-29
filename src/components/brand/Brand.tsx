import beeUrl from '../../assets/bee.png'
import wordmarkUrl from '../../assets/wordmark.png'
import styles from './Brand.module.css'

/** Ícone do app: abelha dentro de um quadrado branco arredondado */
export function AppIcon({ size = 90 }: { size?: number }) {
  return (
    <span className={styles.icon} style={{ width: size, height: size, borderRadius: size * 0.26 }}>
      <img src={beeUrl} alt="" style={{ height: size * 0.69 }} />
    </span>
  )
}

export function Wordmark({ width = 159 }: { width?: number }) {
  return <img src={wordmarkUrl} alt="Abeia" className={styles.wordmark} style={{ width }} />
}

/** Logo empilhado (ícone + nome), usado nas telas de autenticação */
export function StackedLogo() {
  return (
    <div className={styles.stacked}>
      <AppIcon />
      <Wordmark />
    </div>
  )
}
