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
