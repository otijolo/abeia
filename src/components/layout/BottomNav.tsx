import { NavLink } from 'react-router-dom'
import { DesignIcon, type DesignIconName } from '../ui/DesignIcon'
import styles from './BottomNav.module.css'

export type NavSection = 'inicio' | 'apiarios' | 'colmeias' | 'alertas' | 'producao'

const items: { key: NavSection; label: string; to: string }[] = [
  { key: 'inicio', label: 'Início', to: '/inicio' },
  { key: 'apiarios', label: 'Apiários', to: '/apiarios' },
  { key: 'colmeias', label: 'Colmeias', to: '/colmeias' },
  { key: 'alertas', label: 'Alertas', to: '/alertas' },
  { key: 'producao', label: 'Produção', to: '/producao' },
]

/** Barra de navegação inferior. `active` define a aba destacada (ex.: Histórico → Colmeias). */
export function BottomNav({ active }: { active: NavSection }) {
  return (
    <nav className={styles.nav} aria-label="Navegação principal">
      {items.map(({ key, label, to }) => (
        <NavLink
          key={key}
          to={to}
          className={`${styles.item} ${key === active ? styles.active : ''}`}
          aria-current={key === active ? 'page' : undefined}
        >
          <span className={styles.icon}>
            <DesignIcon name={(key === active ? `${key}-ativo` : key) as DesignIconName} />
          </span>
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
