import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { checkPassword, clearSessionCookie, hasValidSession, setSessionCookie } from './session'

export const checkAdminSession = createServerFn({ method: 'GET' }).handler(async () => {
  return { authenticated: hasValidSession() }
})

export const adminLogin = createServerFn({ method: 'POST' })
  .validator(z.object({ password: z.string().min(1) }))
  .handler(async ({ data }) => {
    if (!checkPassword(data.password)) {
      throw new Error('Senha incorreta')
    }
    setSessionCookie()
    return { ok: true }
  })

export const adminLogout = createServerFn({ method: 'POST' }).handler(async () => {
  clearSessionCookie()
  return { ok: true }
})
