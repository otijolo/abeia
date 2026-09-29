import type { InputHTMLAttributes } from 'react'
import { CheckIcon } from '../icons'
import styles from './Checkbox.module.css'

type Props = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & { label: string }

export function Checkbox({ label, className, ...input }: Props) {
  return (
    <label className={[styles.checkbox, className].filter(Boolean).join(' ')}>
      <input type="checkbox" className={styles.input} {...input} />
      <span className={styles.box}>
        <CheckIcon size={14} className={styles.tick} />
      </span>
      {label}
    </label>
  )
}
