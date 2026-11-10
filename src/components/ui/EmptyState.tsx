import type { ReactNode } from 'react'
import { HexagonsIcon } from '../icons'
import { Button } from './Button'
import styles from './EmptyState.module.css'

interface Props {
  title?: string
  description?: string
  children?: ReactNode
  icon?: ReactNode
  action?: {
    label: string
    to?: string
    onClick?: () => void
  }
  className?: string
}

export function EmptyState({
  title,
  description,
  children,
  icon,
  action,
  className
}: Props) {
  // Se passou apenas children simples em string ou jsx, preserva comportamento compacto
  const isSimple = !title && !action && !icon

  if (isSimple) {
    return <p className={[styles.emptySimple, className].filter(Boolean).join(' ')}>{children}</p>
  }

  return (
    <div className={[styles.emptyContainer, className].filter(Boolean).join(' ')}>
      <div className={styles.iconCircle} aria-hidden="true">
        {icon ?? <HexagonsIcon size={26} />}
      </div>

      {title && <h3 className={styles.title}>{title}</h3>}

      {(description || children) && (
        <p className={styles.description}>
          {description ?? children}
        </p>
      )}

      {action && (
        <div className={styles.actionWrap}>
          <Button
            variant="secondary"
            to={action.to}
            onClick={action.onClick}
            className={styles.actionBtn}
          >
            {action.label}
          </Button>
        </div>
      )}
    </div>
  )
}
