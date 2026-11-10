import type { SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement> & { size?: number }

function Svg({ size = 24, children, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  )
}

export const ChevronLeftIcon = (p: IconProps) => (
  <Svg strokeWidth={3} {...p}>
    <path d="m15 5-7 7 7 7" />
  </Svg>
)

export const ChevronRightIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="m9 5 7 7-7 7" />
  </Svg>
)

export const ChevronDownIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="m6 9 6 6 6-6" />
  </Svg>
)

export const SearchIcon = (p: IconProps) => (
  <Svg strokeWidth={2.6} {...p}>
    <circle cx="10" cy="10" r="6" />
    <path d="m15 15 5.5 5.5" />
  </Svg>
)

export const HomeIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z" />
  </Svg>
)

/** Três hexágonos — ícone de apiários */
export const HexagonsIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="m12 2.8 3.6 2.1v4.2L12 11.2 8.4 9.1V4.9z" />
    <path d="m7.4 10.8 3.6 2.1v4.2l-3.6 2.1-3.6-2.1v-4.2z" />
    <path d="m16.6 10.8 3.6 2.1v4.2l-3.6 2.1-3.6-2.1v-4.2z" />
  </Svg>
)

/** Caixa de colmeia empilhada */
export const HiveIcon = (p: IconProps) => (
  <Svg {...p}>
    <rect x="6.5" y="3" width="11" height="5" rx="2.5" />
    <rect x="4.5" y="8" width="15" height="5.5" rx="2.5" />
    <rect x="3.5" y="13.5" width="17" height="7" rx="2.5" />
    <path d="M10.5 20.5v-2.5a1.5 1.5 0 0 1 3 0v2.5" fill="currentColor" />
  </Svg>
)

export const MegaphoneIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M3 10v4a1 1 0 0 0 1 1h3l9 5V4L7 9H4a1 1 0 0 0-1 1z" />
    <path d="M7.5 15.5 9 20" />
    <path d="M19.5 9.5a3.5 3.5 0 0 1 0 5" />
  </Svg>
)

export const FileTextIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M14 2.5H6.5a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V8z" />
    <path d="M14 2.5V8h5.5" />
    <path d="M8.5 13h7M8.5 17h7" />
  </Svg>
)

export const CheckIcon = (p: IconProps) => (
  <Svg strokeWidth={3} {...p}>
    <path d="m5 12.5 4.5 4.5L19 7.5" />
  </Svg>
)

export const ExclamationIcon = (p: IconProps) => (
  <Svg strokeWidth={3} {...p}>
    <path d="M12 4.5v10" />
    <path d="M12 19.5h.01" />
  </Svg>
)

/** Caveira com ossos cruzados — status crítico */
export const SkullIcon = (p: IconProps) => (
  <Svg strokeWidth={2.2} {...p}>
    <path d="m5 13.5 14 7M19 13.5l-14 7" />
    <path
      d="M12 2.8a6 6 0 0 0-6 6c0 2 1 3.4 2.4 4.3v1.7h7.2v-1.7C17 12.2 18 10.8 18 8.8a6 6 0 0 0-6-6z"
      fill="currentColor"
      stroke="none"
    />
    <circle cx="9.6" cy="8.9" r="1.4" fill="var(--icon-hole, #fbe180)" stroke="none" />
    <circle cx="14.4" cy="8.9" r="1.4" fill="var(--icon-hole, #fbe180)" stroke="none" />
  </Svg>
)

export const TrophyIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M7 4h10v5a5 5 0 0 1-10 0z" />
    <path d="M7 6H4.5v1.5A3 3 0 0 0 7.5 10.5M17 6h2.5v1.5a3 3 0 0 1-3 3" />
    <path d="M12 14v3.5M8.5 20.5h7M10 17.5h4v3h-4z" />
  </Svg>
)

export const PlusIcon = (p: IconProps) => (
  <Svg strokeWidth={2.8} {...p}>
    <path d="M12 5v14M5 12h14" />
  </Svg>
)

export const MinusIcon = (p: IconProps) => (
  <Svg strokeWidth={2.8} {...p}>
    <path d="M5 12h14" />
  </Svg>
)

export const MapPinIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </Svg>
)

export const LocateIcon = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="7" />
    <line x1="12" y1="2" x2="12" y2="5" />
    <line x1="12" y1="19" x2="12" y2="22" />
    <line x1="2" y1="12" x2="5" y2="12" />
    <line x1="19" y1="12" x2="22" y2="12" />
  </Svg>
)

export const AlertCircleIcon = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </Svg>
)

export const CheckCircleIcon = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="10" />
    <path d="m9 12 2 2 4-4" />
  </Svg>
)

export const InfoIcon = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="16" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12.01" y2="8" />
  </Svg>
)

export const CalendarIcon = (p: IconProps) => (
  <Svg {...p}>
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </Svg>
)

export const EyeIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </Svg>
)

export const EyeOffIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
    <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
    <line x1="2" y1="2" x2="22" y2="22" />
  </Svg>
)

export const CloseIcon = (p: IconProps) => (
  <Svg {...p}>
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </Svg>
)
