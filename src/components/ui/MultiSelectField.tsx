import { useEffect, useId, useRef, useState } from 'react'
import { ChevronDownIcon } from '../icons'
import { Checkbox } from './Checkbox'
import { Field } from './Field'
import styles from './MultiSelectField.module.css'

interface Props {
  label: string
  options: string[]
  value: string[]
  onChange: (value: string[]) => void
  disabled?: boolean
}

/** Lista de seleção com checkboxes, usada nos sintomas da inspeção. */
export function MultiSelectField({ label, options, value, onChange, disabled }: Props) {
  const [aberto, setAberto] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const listId = useId()

  useEffect(() => {
    if (!aberto) return
    function fecharFora(event: PointerEvent) {
      if (!containerRef.current?.contains(event.target as Node)) setAberto(false)
    }
    document.addEventListener('pointerdown', fecharFora)
    const fechar = () => setAberto(false)
    window.addEventListener('blur', fechar)
    return () => {
      document.removeEventListener('pointerdown', fecharFora)
      window.removeEventListener('blur', fechar)
    }
  }, [aberto])

  return (
    <Field label={label}>
      {(id) => (
        <div ref={containerRef} className={styles.wrap}
          onBlur={(event) => {
            if (event.relatedTarget && !event.currentTarget.contains(event.relatedTarget)) setAberto(false)
          }}
          onKeyDown={(event) => {
            if (event.key === 'Escape') {
              setAberto(false)
              buttonRef.current?.focus()
            }
          }}>
          <button ref={buttonRef} id={id} type="button" className={styles.control}
            disabled={disabled} aria-expanded={aberto && !disabled} aria-controls={listId}
            onClick={() => setAberto(!aberto)}>
            <span className={styles.value}>{value.length ? value.join(', ') : 'Selecione...'}</span>
            <ChevronDownIcon size={16} className={aberto ? styles.open : undefined} />
          </button>
          {aberto && !disabled && (
            <div id={listId} className={styles.options} role="group" aria-label={label}>
              {options.map((option) => (
                <Checkbox key={option} label={option} checked={value.includes(option)}
                  className={styles.option}
                  onChange={(event) => onChange(event.target.checked
                    ? [...value, option] : value.filter((item) => item !== option))} />
              ))}
            </div>
          )}
        </div>
      )}
    </Field>
  )
}
