import { useId, useState } from 'react'
import type { MonthPoint } from '../../lib/admin/monthly-series'

const INCOME_COLOR = '#0ca30c'
const EXPENSE_COLOR = '#d03b3b'
const INK = '#0b1e2e'
const MUTED = '#6d8296'
const GRIDLINE = 'rgba(11,30,46,0.08)'
const BASELINE = 'rgba(11,30,46,0.18)'

const WIDTH = 640
const HEIGHT = 260
const PAD_LEFT = 56
const PAD_RIGHT = 60
const PAD_TOP = 24
const PAD_BOTTOM = 28

function shortCurrency(n: number) {
  if (n >= 1000) return `R$ ${(n / 1000).toLocaleString('pt-BR', { maximumFractionDigits: 1 })}K`
  return `R$ ${n.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}`
}

function fullCurrency(n: number) {
  return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function niceMax(value: number) {
  if (value <= 0) return 100
  const magnitude = 10 ** Math.floor(Math.log10(value))
  const steps = [1, 2, 2.5, 5, 10]
  for (const step of steps) {
    const candidate = step * magnitude
    if (candidate >= value) return candidate
  }
  return 10 * magnitude
}

export default function MonthlyChart({ points }: { points: Array<MonthPoint> }) {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null)
  const clipId = useId()
  const incomeGradientId = useId()
  const expenseGradientId = useId()

  const plotW = WIDTH - PAD_LEFT - PAD_RIGHT
  const plotH = HEIGHT - PAD_TOP - PAD_BOTTOM

  const rawMax = Math.max(1, ...points.flatMap((p) => [p.income, p.expense]))
  const maxValue = niceMax(rawMax * 1.15)
  const stepX = points.length > 1 ? plotW / (points.length - 1) : 0

  function x(i: number) {
    return PAD_LEFT + i * stepX
  }
  function y(v: number) {
    return PAD_TOP + plotH - (v / maxValue) * plotH
  }

  function pathFor(key: 'income' | 'expense') {
    return points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${x(i)} ${y(p[key])}`).join(' ')
  }

  function areaPathFor(key: 'income' | 'expense') {
    const line = pathFor(key)
    const baseline = PAD_TOP + plotH
    return `${line} L ${x(points.length - 1)} ${baseline} L ${x(0)} ${baseline} Z`
  }

  const yTicks = [0, 0.25, 0.5, 0.75, 1].map((f) => Math.round(maxValue * f))

  function handlePointerMove(e: React.PointerEvent<SVGRectElement>) {
    const rect = e.currentTarget.getBoundingClientRect()
    const relX = ((e.clientX - rect.left) / rect.width) * WIDTH
    let nearest = 0
    let best = Infinity
    points.forEach((_, i) => {
      const d = Math.abs(x(i) - relX)
      if (d < best) {
        best = d
        nearest = i
      }
    })
    setHoverIndex(nearest)
  }

  const hovered = hoverIndex !== null ? points[hoverIndex] : null
  const tooltipLeft = hoverIndex !== null && x(hoverIndex) > WIDTH * 0.6

  return (
    <div>
      <div className="flex items-center gap-5">
        <span className="caption-brand flex items-center gap-1.5 text-steel">
          <svg width="18" height="10" aria-hidden="true">
            <line x1="0" y1="5" x2="18" y2="5" stroke={INCOME_COLOR} strokeWidth="2" strokeLinecap="round" />
            <circle cx="9" cy="5" r="3" fill={INCOME_COLOR} stroke="#f5f7f9" strokeWidth="1.5" />
          </svg>
          Entradas
        </span>
        <span className="caption-brand flex items-center gap-1.5 text-steel">
          <svg width="18" height="10" aria-hidden="true">
            <line
              x1="0"
              y1="5"
              x2="18"
              y2="5"
              stroke={EXPENSE_COLOR}
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="4 3"
            />
            <rect x="6.5" y="2.5" width="5" height="5" fill={EXPENSE_COLOR} stroke="#f5f7f9" strokeWidth="1.5" />
          </svg>
          Saídas
        </span>
      </div>

      <div className="relative mt-3" style={{ width: '100%' }}>
        <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} style={{ width: '100%', height: 'auto', display: 'block' }} role="img" aria-label="Gráfico de entradas e saídas por mês">
          <defs>
            <clipPath id={clipId}>
              <rect x={PAD_LEFT} y={PAD_TOP} width={plotW} height={plotH} />
            </clipPath>
            <linearGradient id={incomeGradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={INCOME_COLOR} stopOpacity="0.18" />
              <stop offset="100%" stopColor={INCOME_COLOR} stopOpacity="0" />
            </linearGradient>
            <linearGradient id={expenseGradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={EXPENSE_COLOR} stopOpacity="0.16" />
              <stop offset="100%" stopColor={EXPENSE_COLOR} stopOpacity="0" />
            </linearGradient>
          </defs>

          {yTicks.map((tick) => (
            <g key={tick}>
              <line x1={PAD_LEFT} x2={WIDTH - PAD_RIGHT} y1={y(tick)} y2={y(tick)} stroke={GRIDLINE} strokeWidth="1" />
              <text x={PAD_LEFT - 8} y={y(tick)} textAnchor="end" dominantBaseline="middle" fontSize="10" fill={MUTED}>
                {shortCurrency(tick)}
              </text>
            </g>
          ))}
          <line x1={PAD_LEFT} x2={WIDTH - PAD_RIGHT} y1={PAD_TOP + plotH} y2={PAD_TOP + plotH} stroke={BASELINE} strokeWidth="1" />

          {points.map((p, i) => (
            <text key={p.key} x={x(i)} y={HEIGHT - 6} textAnchor="middle" fontSize="10" fill={MUTED}>
              {p.label}
            </text>
          ))}

          <g clipPath={`url(#${clipId})`}>
            <path d={areaPathFor('expense')} fill={`url(#${expenseGradientId})`} stroke="none" />
            <path d={areaPathFor('income')} fill={`url(#${incomeGradientId})`} stroke="none" />
            <path d={pathFor('expense')} fill="none" stroke={EXPENSE_COLOR} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="6 4" />
            <path d={pathFor('income')} fill="none" stroke={INCOME_COLOR} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </g>

          {points.map((p, i) => (
            <g key={p.key}>
              <circle cx={x(i)} cy={y(p.income)} r="4" fill={INCOME_COLOR} stroke="#f5f7f9" strokeWidth="2" />
              <rect x={x(i) - 4} y={y(p.expense) - 4} width="8" height="8" fill={EXPENSE_COLOR} stroke="#f5f7f9" strokeWidth="2" />
            </g>
          ))}

          <text x={x(points.length - 1) + 6} y={y(points[points.length - 1]?.income ?? 0) - 6} fontSize="10" fill={INK} fontWeight="600">
            {shortCurrency(points[points.length - 1]?.income ?? 0)}
          </text>
          <text x={x(points.length - 1) + 6} y={y(points[points.length - 1]?.expense ?? 0) + 14} fontSize="10" fill={INK} fontWeight="600">
            {shortCurrency(points[points.length - 1]?.expense ?? 0)}
          </text>

          {hoverIndex !== null && (
            <line x1={x(hoverIndex)} x2={x(hoverIndex)} y1={PAD_TOP} y2={PAD_TOP + plotH} stroke={BASELINE} strokeWidth="1" />
          )}

          <rect
            x={PAD_LEFT}
            y={PAD_TOP}
            width={plotW}
            height={plotH}
            fill="transparent"
            onPointerMove={handlePointerMove}
            onPointerLeave={() => setHoverIndex(null)}
            style={{ cursor: 'crosshair' }}
          />
        </svg>

        {hovered && (
          <div
            className="pointer-events-none absolute rounded border bg-paper px-3 py-2"
            style={{
              top: 4,
              [tooltipLeft ? 'right' : 'left']: `${(x(hoverIndex!) / WIDTH) * 100}%`,
              transform: tooltipLeft ? 'translateX(0)' : 'translateX(-8px)',
              borderColor: 'rgba(11,30,46,0.1)',
              borderRadius: 12,
              boxShadow: '0 8px 24px rgba(11,30,46,0.14)',
            }}
          >
            <p className="caption-brand text-steel" style={{ fontWeight: 700 }}>
              {hovered.label}
            </p>
            <p className="caption-brand mt-1 flex items-center gap-1.5">
              <span style={{ width: 8, height: 2, background: INCOME_COLOR, display: 'inline-block' }} />
              <span className="text-ink" style={{ fontWeight: 700 }}>
                {fullCurrency(hovered.income)}
              </span>
              <span className="text-steel">entradas</span>
            </p>
            <p className="caption-brand mt-0.5 flex items-center gap-1.5">
              <span style={{ width: 8, height: 2, background: EXPENSE_COLOR, display: 'inline-block' }} />
              <span className="text-ink" style={{ fontWeight: 700 }}>
                {fullCurrency(hovered.expense)}
              </span>
              <span className="text-steel">saídas</span>
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
