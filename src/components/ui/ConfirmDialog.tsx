import { useEffect, useId, useRef } from 'react'
import { ExclamationIcon } from '../icons'
import { Button } from './Button'
import { IconBubble } from './IconBubble'
import styles from './ConfirmDialog.module.css'

interface Props {
  open: boolean
  title: string
  description: string
  confirmLabel?: string
  cancelLabel?: string
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = 'Confirmar exclusão',
  cancelLabel = 'Cancelar',
  onConfirm,
  onCancel,
}: Props) {
  const titleId = useId()
  const descId = useId()
  const cancelRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    cancelRef.current?.focus()
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onCancel()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onCancel])

  if (!open) return null

  return (
    <div className={styles.backdrop} onClick={onCancel}>
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descId}
        className={styles.dialog}
        onClick={(e) => e.stopPropagation()}
      >
        <IconBubble tone="danger" size={36}>
          <ExclamationIcon size={20} />
        </IconBubble>
        <h2 id={titleId} className={styles.title}>
          {title}
        </h2>
        <p id={descId} className={styles.description}>
          {description}
        </p>
        <div className={styles.actions}>
          <Button onClick={onConfirm}>{confirmLabel}</Button>
          <Button ref={cancelRef} variant="secondary" onClick={onCancel}>
            {cancelLabel}
          </Button>
        </div>
      </div>
    </div>
  )
}
