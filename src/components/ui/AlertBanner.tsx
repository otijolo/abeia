import type { ReactNode } from 'react'
import { AlertCircleIcon, CheckCircleIcon, CloseIcon, ExclamationIcon, InfoIcon } from '../icons'
import styles from './AlertBanner.module.css'

export type AlertBannerVariant = 'error' | 'success' | 'warning' | 'info'

interface Props {
  variant?: AlertBannerVariant
  title?: string
  children: ReactNode
  onClose?: () => void
  action?: {
    label: string
    onClick: () => void
  }
  className?: string
}

const icons = {
  error: AlertCircleIcon,
  warning: ExclamationIcon,
  success: CheckCircleIcon,
  info: InfoIcon,
}

export function AlertBanner({
  variant = 'error',
  title,
  children,
  onClose,
  action,
  className,
}: Props) {
  const Icon = icons[variant]

  return (
    <div
      role={variant === 'error' ? 'alert' : 'status'}
      className={[styles.banner, styles[variant], className].filter(Boolean).join(' ')}
    >
      <span className={styles.iconWrapper} aria-hidden="true">
        <Icon size={18} />
      </span>
      <div className={styles.content}>
        {title && <strong className={styles.title}>{title}</strong>}
        <div className={styles.message}>{children}</div>
      </div>
      {action && (
        <button type="button" onClick={action.onClick} className={styles.actionBtn}>
          {action.label}
        </button>
      )}
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className={styles.closeBtn}
          aria-label="Fechar aviso"
        >
          <CloseIcon size={16} />
        </button>
      )}
    </div>
  )
}
