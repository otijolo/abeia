import { Link, NavLink, useLocation } from 'react-router-dom'
import { AppIcon } from '../brand/Brand'
import { DesignIcon, type DesignIconName } from '../ui/DesignIcon'
import { MapPinIcon } from '../icons'
import type { NavSection } from './BottomNav'
import styles from './Sidebar.module.css'

interface Props {
  active?: NavSection
}

interface NavItem {
  key: NavSection | 'mapa'
  label: string
  to: string
  designIcon?: NavSection
  isCustomIcon?: boolean
}

const navItems: NavItem[] = [
  { key: 'inicio', label: 'Início', to: '/inicio', designIcon: 'inicio' },
  { key: 'apiarios', label: 'Apiários', to: '/apiarios', designIcon: 'apiarios' },
  { key: 'mapa', label: 'Mapa', to: '/mapa', isCustomIcon: true },
  { key: 'colmeias', label: 'Colmeias', to: '/colmeias', designIcon: 'colmeias' },
  { key: 'alertas', label: 'Alertas', to: '/alertas', designIcon: 'alertas' },
  { key: 'producao', label: 'Produção', to: '/producao', designIcon: 'producao' },
]

export function Sidebar({ active }: Props) {
  const location = useLocation()
  const pathname = location.pathname

  // Determina a seção ativa pela rota caso active não seja passado
  const currentSection = active || (() => {
    if (pathname.startsWith('/apiarios')) return 'apiarios'
    if (pathname.startsWith('/mapa')) return 'mapa'
    if (pathname.startsWith('/colmeias') || pathname.startsWith('/inspecoes')) return 'colmeias'
    if (pathname.startsWith('/alertas')) return 'alertas'
    if (pathname.startsWith('/producao') || pathname.startsWith('/relatorios')) return 'producao'
    if (pathname.startsWith('/inicio')) return 'inicio'
    return undefined
  })()

  return (
    <aside className={styles.sidebar} aria-label="Navegação lateral desktop">
      <div className={styles.brandContainer}>
        <Link to="/inicio" className={styles.brandLink} title="Início" aria-label="Início">
          <AppIcon size={38} />
        </Link>
      </div>

      <nav className={styles.nav}>
        {navItems.map((item) => {
          const isActive = currentSection === item.key
          return (
            <NavLink
              key={item.key}
              to={item.to}
              title={item.label}
              aria-label={item.label}
              className={[styles.navItem, isActive ? styles.active : ''].filter(Boolean).join(' ')}
              aria-current={isActive ? 'page' : undefined}
            >
              <span className={styles.iconWrapper} aria-hidden="true">
                {item.isCustomIcon ? (
                  <MapPinIcon size={20} className={styles.customIcon} />
                ) : (
                  <DesignIcon
                    name={(isActive ? `${item.designIcon}-ativo` : item.designIcon) as DesignIconName}
                  />
                )}
              </span>
            </NavLink>
          )
        })}
      </nav>

      <div className={styles.footer}>
        <Link to="/perfil" className={styles.profileCard} aria-label="Abrir perfil" title="Meu perfil">
          <DesignIcon name="perfil" />
        </Link>
      </div>
    </aside>
  )
}
