import { Link } from 'react-router-dom'
import mapUrl from '../../assets/figma/mapa.png'
import styles from './MapPreview.module.css'

export function MapPreview({ label = 'Prévia do mapa do Ceará', to }: { label?: string; to?: string }) {
  const preview = (
    <div className={styles.map}>
      <img src={mapUrl} alt={label} />
    </div>
  )
  return to ? <Link to={to} aria-label="Abrir mapa dos apiários">{preview}</Link> : preview
}
