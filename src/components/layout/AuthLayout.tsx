import type { FormEvent, ReactNode } from 'react'
import { StackedLogo } from '../brand/Brand'
import styles from './AuthLayout.module.css'

interface Props {
  title: string
  subtitle: string
  onSubmit: (e: FormEvent<HTMLFormElement>) => void
  /** Campos do formulário */
  children: ReactNode
  /** Botões e links abaixo dos campos */
  actions: ReactNode
}

/** Layout das telas de cadastro, login e recuperação de senha */
export function AuthLayout({ title, subtitle, onSubmit, children, actions }: Props) {
  return (
    <main className={styles.screen}>
      <StackedLogo />
      <form className={styles.form} onSubmit={onSubmit}>
        <hgroup className={styles.heading}>
          <h1>{title}</h1>
          <p>{subtitle}</p>
        </hgroup>
        <div className={styles.fields}>{children}</div>
        <div className={styles.actions}>{actions}</div>
      </form>
    </main>
  )
}
