import { useId } from 'react'
import { ChevronDownIcon } from '../icons'
import styles from './FilterDropdown.module.css'

interface Props {
  label: string
  options: string[]
  value: string
  onChange: (value: string) => void
  className?: string
}

/** Botão cinza com seta que abre um seletor nativo (Período, Apiário, Colmeia...) */
export function FilterDropdown({ label, options, value, onChange, className }: Props) {
  const id = useId()
  return (
    <div className={[styles.wrap, className].filter(Boolean).join(' ')}>
      <label htmlFor={id} className={styles.face}>
        <span className={styles.text}>{value || label}</span>
        <ChevronDownIcon size={14} strokeWidth={2.4} />
      </label>
      <select id={id} className={styles.select} value={value} onChange={(e) => onChange(e.target.value)} aria-label={label}>
        <option value="">{label}</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  )
}
