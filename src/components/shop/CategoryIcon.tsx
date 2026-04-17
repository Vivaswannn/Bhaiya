import { getCategoryDef } from '@/lib/categories'

interface CategoryIconProps {
  slug: string
  size?: number
  withBg?: boolean
}

export function CategoryIcon({ slug, size = 20, withBg = false }: CategoryIconProps) {
  const def = getCategoryDef(slug)
  if (!def) return null
  const icon = (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={def.color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={def.iconPath} />
    </svg>
  )
  if (!withBg) return icon
  return (
    <span
      className="flex items-center justify-center rounded-xl"
      style={{
        width: size + 16,
        height: size + 16,
        background: `${def.color}1a`,
      }}
    >
      {icon}
    </span>
  )
}
