import type { CSSProperties } from 'react'

export const ADMIN_CARD: CSSProperties = {
  background: '#fff',
  border: '1px solid rgba(11,30,46,0.06)',
  borderRadius: 18,
  boxShadow: '0 2px 14px rgba(11,30,46,0.07)',
}

export const ADMIN_CARD_DARK: CSSProperties = {
  background: 'var(--navy-900)',
  border: '1px solid var(--navy-900)',
  borderRadius: 18,
  boxShadow: '0 8px 24px rgba(14,46,78,0.28)',
}

export const ADMIN_INPUT: CSSProperties = {
  borderColor: 'rgba(11,30,46,0.14)',
  borderRadius: 10,
}

export function adminIconBadge(hex: string): CSSProperties {
  return {
    background: `${hex}1a`,
    color: hex,
    width: 40,
    height: 40,
    borderRadius: 12,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  }
}

export function adminAvatar(hex: string): CSSProperties {
  return {
    background: `${hex}1a`,
    color: hex,
    width: 38,
    height: 38,
    borderRadius: 999,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    fontWeight: 700,
    fontSize: 14,
  }
}
