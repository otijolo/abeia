import { useId, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from 'react'
import { ChevronDownIcon } from '../icons'
import styles from './Field.module.css'

interface FieldProps {
  label: string
  children: (id: string) => ReactNode
  className?: string
}

/** Label + controle. Usado por todos os campos de formulário. */
export function Field({ label, children, className }: FieldProps) {
  const id = useId()
  return (
    <div className={[styles.field, className].filter(Boolean).join(' ')}>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>
      {children(id)}
    </div>
  )
}

type TextFieldProps = InputHTMLAttributes<HTMLInputElement> & { label: string }

export function TextField({ label, className, ...input }: TextFieldProps) {
  return (
    <Field label={label} className={className}>
      {(id) => <input id={id} className={styles.control} {...input} />}
    </Field>
  )
}

type TextAreaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string }

export function TextArea({ label, className, ...textarea }: TextAreaProps) {
  return (
    <Field label={label} className={className}>
      {(id) => <textarea id={id} className={`${styles.control} ${styles.textarea}`} {...textarea} />}
    </Field>
  )
}

type SelectFieldProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label: string
  options: string[]
  placeholder?: string
}

export function SelectField({ label, options, placeholder = 'Selecione...', className, ...select }: SelectFieldProps) {
  return (
    <Field label={label} className={className}>
      {(id) => (
        <div className={styles.selectWrap}>
          <select id={id} className={`${styles.control} ${styles.select}`} {...select}>
            {placeholder && <option value="">{placeholder}</option>}
            {options.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
          <ChevronDownIcon size={16} className={styles.selectIcon} />
        </div>
      )}
    </Field>
  )
}
