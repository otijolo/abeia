import type { ReactNode } from 'react'

const drawings: Record<string, ReactNode> = {
  inicio: <path d="m2.5 10 9.5-8 9.5 8M5 8v13h14V8" />,
  apiarios: <>
    <path d="m13 2 5 0 3 5-3 5h-5l-3-5z" />
    <path d="M10 7H5l-3 5 3 5h5l3-5M13 12h5l3 5-3 5h-5l-3-5" />
  </>,
  mapa: <>
    <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </>,
  colmeias: <>
    <rect x="7" y="2" width="10" height="5" rx="2.5" />
    <rect x="5" y="7" width="14" height="5" rx="2.5" />
    <rect x="3" y="12" width="18" height="5" rx="2.5" />
    <rect x="4" y="17" width="16" height="5" rx="2.5" />
    <path d="M10 22v-3a2 2 0 0 1 4 0v3" />
  </>,
  alertas: <>
    <path d="M3 9h5l13-6v18L8 15H3zM8 9v6M6 15l2 6h4l-2-5" />
  </>,
  producao: <>
    <path d="M14 2H5a1 1 0 0 0-1 1v18a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V8zM14 2v6h6M8 13h8M8 17h8" />
  </>,
}

/** Mesmo tamanho e espessura; a seleção muda somente a cor. */
export function NavigationIcon({ name }: { name: string }) {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true">
      {drawings[name]}
    </svg>
  )
}
