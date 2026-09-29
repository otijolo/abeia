import { NavLink } from 'react-router-dom'
import { FileTextIcon, HexagonsIcon, HiveIcon, HomeIcon, MegaphoneIcon } from '../icons'
import styles from './BottomNav.module.css'

export type NavSection = 'inicio' | 'apiarios' | 'colmeias' | 'alertas' | 'producao'

const items: { key: NavSection; label: string; to: string; Icon: typeof HomeIcon }[] = [
  { key: 'inicio', label: 'Início', to: '/inicio', Icon: HomeIcon },
  { key: 'apiarios', label: 'Apiários', to: '/apiarios', Icon: HexagonsIcon },
  { key: 'colmeias', label: 'Colmeias', to: '/colmeias', Icon: HiveIcon },
  { key: 'alertas', label: 'Alertas', to: '/alertas', Icon: MegaphoneIcon },
  { key: 'producao', label: 'Produção', to: '/producao', Icon: FileTextIcon },
]

/** Barra de navegação inferior. `active` define a aba destacada (ex.: Histórico → Colmeias). */
export function BottomNav({ active }: { active: NavSection }) {
  return (
    <nav className={styles.nav} aria-label="Navegação principal">
      {items.map(({ key, label, to, Icon }) => (
        <NavLink
          key={key}
          to={to}
          className={`${styles.item} ${key === active ? styles.active : ''}`}
          aria-current={key === active ? 'page' : undefined}
        >
          <Icon size={27} />
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
