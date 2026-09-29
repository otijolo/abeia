import type { ReactNode } from 'react'
import { AppHeader } from './AppHeader'
import { BottomNav, type NavSection } from './BottomNav'
import styles from './Screen.module.css'

interface Props {
  children: ReactNode
  /** Título do cabeçalho; omitido = cabeçalho com a marca (tela de início) */
  title?: string
  /** Mostra o avatar no cabeçalho */
  avatar?: boolean
  backTo?: string
  /** Aba ativa na navegação inferior; omitido = sem navegação inferior */
  nav?: NavSection
  /** Espaçamento lateral do conteúdo */
  padding?: 'list' | 'form'
}

/** Estrutura padrão das telas autenticadas: cabeçalho + conteúdo rolável + navegação */
export function Screen({ children, title, avatar = true, backTo, nav, padding = 'list' }: Props) {
  return (
    <div className={styles.screen}>
      <AppHeader title={title} avatar={avatar} backTo={backTo} />
      <main className={`${styles.content} ${styles[padding]}`}>{children}</main>
      {nav && <BottomNav active={nav} />}
    </div>
  )
}

/** Coluna vertical com espaçamento uniforme entre blocos */
export function Stack({ children, gap = 16, className }: { children: ReactNode; gap?: number; className?: string }) {
  return (
    <div className={[styles.stack, className].filter(Boolean).join(' ')} style={{ gap }}>
      {children}
    </div>
  )
}

/** Grade de colunas iguais (campos lado a lado, botões em linha, cards de resumo) */
export function Columns({
  children,
  gap = 16,
  rowGap,
  count = 2,
}: {
  children: ReactNode
  gap?: number
  rowGap?: number
  count?: number
}) {
  return (
    <div
      className={styles.columns}
      style={{ columnGap: gap, rowGap: rowGap ?? gap, gridTemplateColumns: `repeat(${count}, minmax(0, 1fr))` }}
    >
      {children}
    </div>
  )
}
