import type { ReactNode } from 'react'
import styles from './AppFrame.module.css'

/** Limita o app à largura de um celular (412px) e centraliza em telas maiores */
export function AppFrame({ children }: { children: ReactNode }) {
  return <div className={styles.frame}>{children}</div>
}
