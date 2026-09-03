import { useId } from 'react'

export default function Sparkline({
  values,
  color,
  width = 72,
  height = 28,
  area = false,
}: {
  values: Array<number>
  color: string
  width?: number
  height?: number
  area?: boolean
}) {
  const gradientId = useId()
  if (values.length < 2) return null
  const max = Math.max(...values, 1)
  const min = Math.min(...values, 0)
  const range = max - min || 1
  const stepX = width / (values.length - 1)

  const coords = values.map((v, i) => ({
    x: i * stepX,
    y: height - ((v - min) / range) * height,
  }))
  const linePoints = coords.map((c) => `${c.x},${c.y}`).join(' ')
  const areaPath = `M ${coords[0].x},${height} L ${coords.map((c) => `${c.x},${c.y}`).join(' L ')} L ${coords[coords.length - 1].x},${height} Z`

  const last = coords[coords.length - 1]

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} aria-hidden="true">
      {area && (
        <>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity="0.25" />
              <stop offset="100%" stopColor={color} stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={areaPath} fill={`url(#${gradientId})`} />
        </>
      )}
      <polyline points={linePoints} fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={last.x} cy={last.y} r="2.25" fill={color} />
    </svg>
  )
}
