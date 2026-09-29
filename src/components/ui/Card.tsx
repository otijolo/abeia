import type { HTMLAttributes, ReactNode } from 'react'
import { Link } from 'react-router-dom'
import styles from './Card.module.css'

interface Props extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  /** Torna o card inteiro navegável, com estado de hover/pressionado */
  to?: string
}

export function Card({ children, to, className, ...rest }: Props) {
  const cls = [styles.card, to && styles.interactive, className].filter(Boolean).join(' ')
  if (to) {
    return (
      <Link to={to} className={cls}>
        {children}
      </Link>
    )
  }
  return (
    <div className={cls} {...rest}>
      {children}
    </div>
  )
}
