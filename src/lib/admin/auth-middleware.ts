import { createMiddleware } from '@tanstack/react-start'
import { hasValidSession } from './session'

export const adminAuthMiddleware = createMiddleware({ type: 'function' }).server(
  async ({ next }) => {
    if (!hasValidSession()) {
      throw new Error('UNAUTHORIZED')
    }
    return next()
  },
)
