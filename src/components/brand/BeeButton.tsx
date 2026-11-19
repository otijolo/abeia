import { useState } from 'react'
import beeUrl from '../../assets/abeia-logo.png'
import styles from './BeeButton.module.css'

/** Bate as asas somente quando acionada, sem mudar de tela. */
export function BeeButton({ size = 34 }: { size?: number }) {
  const [batendoAsas, setBatendoAsas] = useState(false)
  return (
    <button type="button" className={styles.beeButton}
      style={{ width: size + 14, height: size + 14 }}
      aria-label="Bater as asas da abelha" onClick={() => setBatendoAsas(true)}
      onAnimationEnd={() => setBatendoAsas(false)}>
      <span className={[styles.bee, batendoAsas ? styles.flapping : ''].filter(Boolean).join(' ')}
        style={{ width: size * 27 / 34, height: size }} aria-hidden="true">
        <img src={beeUrl} alt="" className={styles.beeBody} />
        <img src={beeUrl} alt="" className={styles.upperWing} />
        <img src={beeUrl} alt="" className={styles.lowerWing} />
      </span>
    </button>
  )
}
