import { useCallback, useState, type ReactNode } from 'react'
import { Splash } from '../../pages/auth/Splash'
import { useLocation } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import styles from './AppFrame.module.css'

/** Estrutura comum mantém a navegação montada durante a troca de telas. */
export function AppFrame({ children }: { children: ReactNode }) {
  const { pathname } = useLocation()
  // A PWA pode reabrir diretamente na última rota, sem passar por '/'.
  const [abertura, setAbertura] = useState(() => pathname !== '/' && window.matchMedia('(max-width: 839px)').matches)
  const concluirAbertura = useCallback(() => setAbertura(false), [])
  const autenticacao = ['/', '/login', '/cadastro', '/recuperar-senha'].includes(pathname)
  if (abertura) return <Splash onComplete={concluirAbertura} />
  return (
    <div className={styles.frame}>
      {!autenticacao && <Sidebar />}
      {children}
    </div>
  )
}
