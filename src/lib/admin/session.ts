import crypto from 'node:crypto'
import { getRequestHeader, setResponseHeader } from '@tanstack/react-start/server'

const SESSION_COOKIE = 'gt_admin_session'
const ONE_DAY = 60 * 60 * 24
const SESSION_MAX_AGE = ONE_DAY * 7

function sessionSecret() {
  const secret = process.env.SESSION_SECRET
  if (!secret) throw new Error('SESSION_SECRET is not set')
  return secret
}

function sign(value: string) {
  return crypto.createHmac('sha256', sessionSecret()).update(value).digest('hex')
}

export function setSessionCookie() {
  const value = 'ok'
  const token = `${value}.${sign(value)}`
  setResponseHeader(
    'Set-Cookie',
    [
      `${SESSION_COOKIE}=${token}`,
      'HttpOnly',
      'Secure',
      'SameSite=Lax',
      'Path=/',
      `Max-Age=${SESSION_MAX_AGE}`,
    ].join('; '),
  )
}

export function clearSessionCookie() {
  setResponseHeader(
    'Set-Cookie',
    `${SESSION_COOKIE}=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0`,
  )
}

function readSessionCookie(): string | null {
  const header = getRequestHeader('cookie')
  if (!header) return null
  for (const part of header.split(/;\s*/)) {
    const eq = part.indexOf('=')
    if (eq === -1) continue
    if (part.slice(0, eq) === SESSION_COOKIE) return part.slice(eq + 1)
  }
  return null
}

export function hasValidSession(): boolean {
  const token = readSessionCookie()
  if (!token) return false
  const [value, sig] = token.split('.')
  if (!value || !sig) return false
  const expected = sign(value)
  const a = Buffer.from(sig)
  const b = Buffer.from(expected)
  if (a.length !== b.length) return false
  return crypto.timingSafeEqual(a, b)
}

export function checkPassword(candidate: string): boolean {
  const expected = process.env.ADMIN_PASSWORD
  if (!expected) throw new Error('ADMIN_PASSWORD is not set')
  const a = Buffer.from(candidate)
  const b = Buffer.from(expected)
  if (a.length !== b.length) return false
  return crypto.timingSafeEqual(a, b)
}
