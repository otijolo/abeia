import { useId } from 'react'
import styles from './Stepper.module.css'

interface Props {
  label: string
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
}

export function Stepper({ label, value, onChange, min = 0, max = 99 }: Props) {
  const id = useId()
  return (
    <div className={styles.field}>
      <span id={id} className={styles.label}>
        {label}
      </span>
      <div className={styles.stepper} role="group" aria-labelledby={id}>
        <button type="button" aria-label="Diminuir" onClick={() => onChange(Math.max(min, value - 1))}>
          -
        </button>
        <output aria-live="polite">{value}</output>
        <button type="button" aria-label="Aumentar" onClick={() => onChange(Math.min(max, value + 1))}>
          +
        </button>
      </div>
    </div>
  )
}
