import {
  useId,
  useState,
  type InputHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes
} from 'react'
import { ChevronDownIcon, EyeIcon, EyeOffIcon } from '../icons'
import styles from './Field.module.css'

export interface FieldProps {
  label: string
  children: (id: string) => ReactNode
  className?: string
  helperText?: ReactNode
  error?: ReactNode
  required?: boolean
  optional?: boolean
}

/** Label + controle + feedbacks. Usado por todos os campos de formulário. */
export function Field({
  label,
  children,
  className,
  helperText,
  error,
  required,
  optional
}: FieldProps) {
  const id = useId()
  const helperId = `${id}-helper`
  const errorId = `${id}-error`

  return (
    <div
      className={[
        styles.field,
        error ? styles.hasError : '',
        className
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className={styles.labelRow}>
        <label htmlFor={id} className={styles.label}>
          {label}
          {required && <span className={styles.requiredStar} aria-hidden="true">*</span>}
        </label>
        {optional && <span className={styles.optionalBadge}>Opcional</span>}
      </div>

      {children(id)}

      {error ? (
        <p id={errorId} role="alert" className={styles.errorMessage}>
          {error}
        </p>
      ) : helperText ? (
        <p id={helperId} className={styles.helperMessage}>
          {helperText}
        </p>
      ) : null}
    </div>
  )
}

export type TextFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string
  helperText?: ReactNode
  error?: ReactNode
  optional?: boolean
  startAdornment?: ReactNode
  endAdornment?: ReactNode
  showPasswordToggle?: boolean
}

export function TextField({
  label,
  className,
  helperText,
  error,
  required,
  optional,
  startAdornment,
  endAdornment,
  type = 'text',
  showPasswordToggle = true,
  ...input
}: TextFieldProps) {
  const [showPassword, setShowPassword] = useState(false)
  const isPassword = type === 'password'
  const resolvedType = isPassword && showPassword ? 'text' : type

  return (
    <Field
      label={label}
      className={className}
      helperText={helperText}
      error={error}
      required={required}
      optional={optional}
    >
      {(id) => (
        <div className={styles.inputWrap}>
          {startAdornment && <div className={styles.startAdornment}>{startAdornment}</div>}
          <input
            id={id}
            type={resolvedType}
            required={required}
            aria-invalid={Boolean(error)}
            className={[
              styles.control,
              startAdornment ? styles.hasStart : '',
              endAdornment || isPassword ? styles.hasEnd : '',
              error ? styles.controlError : ''
            ]
              .filter(Boolean)
              .join(' ')}
            {...input}
          />
          {isPassword && showPasswordToggle ? (
            <button
              type="button"
              className={styles.passwordToggle}
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Ocultar senha' : 'Exibir senha'}
              tabIndex={-1}
            >
              {showPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
            </button>
          ) : endAdornment ? (
            <div className={styles.endAdornment}>{endAdornment}</div>
          ) : null}
        </div>
      )}
    </Field>
  )
}

export type TextAreaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string
  helperText?: ReactNode
  error?: ReactNode
  optional?: boolean
}

export function TextArea({
  label,
  className,
  helperText,
  error,
  required,
  optional,
  ...textarea
}: TextAreaProps) {
  return (
    <Field
      label={label}
      className={className}
      helperText={helperText}
      error={error}
      required={required}
      optional={optional}
    >
      {(id) => (
        <textarea
          id={id}
          required={required}
          aria-invalid={Boolean(error)}
          className={[
            styles.control,
            styles.textarea,
            error ? styles.controlError : ''
          ]
            .filter(Boolean)
            .join(' ')}
          {...textarea}
        />
      )}
    </Field>
  )
}

export type SelectFieldProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label: string
  options: (string | { value: string; label: string })[]
  placeholder?: string
  helperText?: ReactNode
  error?: ReactNode
  optional?: boolean
}

export function SelectField({
  label,
  options,
  placeholder = 'Selecione...',
  className,
  helperText,
  error,
  required,
  optional,
  value,
  ...select
}: SelectFieldProps) {
  const isPlaceholderSelected = value === '' || value === undefined

  return (
    <Field
      label={label}
      className={className}
      helperText={helperText}
      error={error}
      required={required}
      optional={optional}
    >
      {(id) => (
        <div className={styles.selectWrap}>
          <select
            id={id}
            value={value}
            required={required}
            aria-invalid={Boolean(error)}
            className={[
              styles.control,
              styles.select,
              isPlaceholderSelected ? styles.placeholderActive : '',
              error ? styles.controlError : ''
            ]
              .filter(Boolean)
              .join(' ')}
            {...select}
          >
            {placeholder && (
              <option value="" disabled={required}>
                {placeholder}
              </option>
            )}
            {options.map((o) => {
              const val = typeof o === 'string' ? o : o.value
              const text = typeof o === 'string' ? o : o.label
              return (
                <option key={val} value={val}>
                  {text}
                </option>
              )
            })}
          </select>
          <ChevronDownIcon size={16} className={styles.selectIcon} />
        </div>
      )}
    </Field>
  )
}
