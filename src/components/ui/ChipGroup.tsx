import styles from './ChipGroup.module.css'

interface Props<T extends string> {
  options: { value: T; label: string }[]
  value: T
  onChange: (value: T) => void
  /** Rótulo acessível do grupo */
  label: string
  size?: 'md' | 'lg'
  gap?: number
}

/** Grupo de opções exclusivas (filtros e escolhas de formulário) */
export function ChipGroup<T extends string>({ options, value, onChange, label, size = 'md', gap = 8 }: Props<T>) {
  return (
    <div
      role="radiogroup"
      aria-label={label}
      className={styles.group}
      style={{ gridTemplateColumns: `repeat(${options.length}, 1fr)`, gap }}
    >
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          role="radio"
          aria-checked={o.value === value}
          className={`${styles.chip} ${styles[size]}`}
          onClick={() => onChange(o.value)}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}
