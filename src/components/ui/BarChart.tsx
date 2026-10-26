import { useEffect, useRef, useState } from 'react'
import type { ProducaoMensal } from '../../data/types'
import { Card } from './Card'
import styles from './BarChart.module.css'

const BAR_MAX_HEIGHT = 128

/** Gráfico de barras com rolagem horizontal e indicador de rolagem customizado */
export function BarChart({ data, label }: { data: ProducaoMensal[]; label: string }) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [thumb, setThumb] = useState({ width: 20, left: 0 })
  const max = Math.max(1, ...data.map((d) => d.kg))

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    const update = () => {
      const ratio = el.clientWidth / el.scrollWidth
      const scrollable = el.scrollWidth - el.clientWidth
      const width = ratio * 100
      const left = scrollable > 0 ? (el.scrollLeft / scrollable) * (100 - width) : 0
      setThumb({ width, left })
    }
    update()
    el.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      el.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [data])

  return (
    <figure className={styles.figure} aria-label={label}>
      <Card className={styles.card}>
        <div ref={scrollRef} className={styles.scroll}>
          <ul className={styles.bars}>
            {data.map((d) => (
              <li key={d.mes} className={styles.item}>
                <span
                  className={styles.bar}
                  style={{ height: (d.kg / max) * BAR_MAX_HEIGHT }}
                  title={`${d.mes}: ${d.kg} kg`}
                />
                <span className={styles.month}>{d.mes}</span>
              </li>
            ))}
          </ul>
        </div>
      </Card>
      <div className={styles.track} aria-hidden="true">
        <span className={styles.thumb} style={{ width: `${thumb.width}%`, left: `${thumb.left}%` }} />
      </div>
    </figure>
  )
}
