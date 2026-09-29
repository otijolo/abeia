import type { ButtonHTMLAttributes, ReactNode, Ref } from 'react'
import { Link } from 'react-router-dom'
import styles from './Button.module.css'

type Variant = 'primary' | 'secondary' | 'muted' | 'danger'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  /** Quando informado, renderiza um link de navegação */
  to?: string
  ref?: Ref<HTMLButtonElement>
  children: ReactNode
}

export function Button({ variant = 'primary', to, className, children, type = 'button', ...rest }: Props) {
  const cls = [styles.button, styles[variant], className].filter(Boolean).join(' ')
  if (to) {
    return (
      <Link to={to} className={cls}>
        {children}
      </Link>
    )
  }
  return (
    <button type={type} className={cls} {...rest}>
      {children}
    </button>
  )
}
