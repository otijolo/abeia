import type { ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import styles from './AppFrame.module.css'

/** Estrutura comum mantém a navegação montada durante a troca de telas. */
export function AppFrame({ children }: { children: ReactNode }) {
  const { pathname } = useLocation()
  const autenticacao = ['/', '/login', '/cadastro', '/recuperar-senha'].includes(pathname)
  return (
    <div className={styles.frame}>
      {!autenticacao && <Sidebar />}
      {children}
    </div>
  )
}
