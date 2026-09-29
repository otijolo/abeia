import type { InputHTMLAttributes } from 'react'
import { SearchIcon } from '../icons'
import styles from './SearchBar.module.css'

export function SearchBar(props: Omit<InputHTMLAttributes<HTMLInputElement>, 'type'>) {
  return (
    <label className={styles.search}>
      <SearchIcon size={16} className={styles.icon} />
      <input type="search" className={styles.input} aria-label={props.placeholder} {...props} />
    </label>
  )
}
