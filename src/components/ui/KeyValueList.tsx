import { Card } from './Card'
import styles from './KeyValueList.module.css'

export function KeyValueList({ items }: { items: [string, string | number][] }) {
  return (
    <Card className={styles.card}>
      <dl className={styles.list}>
        {items.map(([k, v]) => (
          <div key={k} className={styles.row}>
            <dt>{k}</dt>
            <dd>{v}</dd>
          </div>
        ))}
      </dl>
    </Card>
  )
}
