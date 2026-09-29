import type { ReactNode } from 'react'
import styles from './Actions.module.css'

/** Pilha de botões no rodapé das telas de detalhe */
export function Actions({ children }: { children: ReactNode }) {
  return <div className={styles.actions}>{children}</div>
}
