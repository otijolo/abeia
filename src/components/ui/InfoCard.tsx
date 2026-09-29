import type { ReactNode } from 'react'
import { Card } from './Card'
import styles from './InfoCard.module.css'

interface Props {
  title?: string
  lines?: string[]
  children?: ReactNode
  /** Altura mínima, para cards de texto livre */
  minHeight?: number
}

/** Card com título em destaque e linhas de texto secundário */
export function InfoCard({ title, lines = [], children, minHeight }: Props) {
  return (
    <Card className={styles.card} style={{ minHeight }}>
      {title && <strong className={styles.title}>{title}</strong>}
      {lines.map((l) => (
        <span key={l} className={styles.line}>
          {l}
        </span>
      ))}
      {children}
    </Card>
  )
}

/** Texto de destaque positivo (ex.: "Nenhum problema identificado.") */
export function PositiveNote({ children }: { children: ReactNode }) {
  return <p className={styles.positive}>{children}</p>
}

/** Texto corrido dentro de um card */
export function BodyText({ children }: { children: ReactNode }) {
  return <p className={styles.body}>{children}</p>
}
