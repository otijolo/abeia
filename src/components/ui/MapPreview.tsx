import mapUrl from '../../assets/map.jpg'
import styles from './MapPreview.module.css'

export function MapPreview({ label = 'Mapa da localização' }: { label?: string }) {
  return (
    <div className={styles.map}>
      <img src={mapUrl} alt={label} />
    </div>
  )
}
