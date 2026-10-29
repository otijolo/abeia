import { useEffect, useRef, useState } from 'react'
import type { ProducaoMensal } from '../../data/types'
import { Card } from './Card'
import styles from './BarChart.module.css'

const BAR_MAX_HEIGHT = 128
const mesesCompletos: Record<string, string> = {
  Jan: 'Janeiro', Fev: 'Fevereiro', Mar: 'Março', Abr: 'Abril',
  Mai: 'Maio', Jun: 'Junho', Jul: 'Julho', Ago: 'Agosto',
  Set: 'Setembro', Out: 'Outubro', Nov: 'Novembro', Dez: 'Dezembro',
}

/** Gráfico de barras com rolagem horizontal e indicador de rolagem customizado */
export function BarChart({ data, label }: { data: ProducaoMensal[]; label: string }) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [thumb, setThumb] = useState({ width: 20, left: 0 })
  const [posicao, setPosicao] = useState(0)
  const [intervalo, setIntervalo] = useState('')
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
      setPosicao(scrollable > 0 ? (el.scrollLeft / scrollable) * 100 : 0)
      const area = el.getBoundingClientRect()
      const visiveis = Array.from(el.querySelectorAll('li')).map((item, index) => ({
        rect: item.getBoundingClientRect(), mes: data[index]?.mes,
      })).filter(({ rect, mes }) => mes &&
        rect.left + rect.width / 2 >= area.left && rect.left + rect.width / 2 <= area.right)
      const primeiro = visiveis[0]?.mes
      const ultimo = visiveis[visiveis.length - 1]?.mes
      setIntervalo(primeiro && ultimo
        ? `${mesesCompletos[primeiro] || primeiro} - ${mesesCompletos[ultimo] || ultimo}` : '')
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
        <span className={styles.period} aria-hidden="true">{intervalo}</span>
        <div ref={scrollRef} className={styles.scroll}>
          <ul className={styles.bars}>
            {data.map((d) => (
              <li key={d.mes} className={styles.item}>
                <button
                  type="button"
                  className={styles.bar}
                  style={{ height: (d.kg / max) * BAR_MAX_HEIGHT }}
                  aria-label={`${d.mes}: ${d.kg.toLocaleString('pt-BR')} kg`}
                >
                  <span className={styles.quantity} aria-hidden="true">{d.kg.toLocaleString('pt-BR')} kg</span>
                </button>
                <span className={styles.month}>{d.mes}</span>
              </li>
            ))}
          </ul>
        </div>
      </Card>
      <div className={styles.track}>
        <span className={styles.thumb} aria-hidden="true" style={{ width: `${thumb.width}%`, left: `${thumb.left}%` }} />
        <input type="range" min={0} max={100} step="any" value={posicao}
          aria-label="Rolar meses do gráfico" className={styles.range}
          onChange={(e) => {
            const el = scrollRef.current
            if (el) el.scrollLeft = (Number(e.target.value) / 100) * (el.scrollWidth - el.clientWidth)
          }} />
      </div>
    </figure>
  )
}
