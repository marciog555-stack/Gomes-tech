import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/react-start'
import { useState } from 'react'
import { adminLogin } from '../lib/admin/auth.functions'

export const Route = createFileRoute('/admin/login')({
  component: LoginPage,
})

function LoginPage() {
  const navigate = useNavigate()
  const loginFn = useServerFn(adminLogin)
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      await loginFn({ data: { password } })
      await navigate({ to: '/admin' })
    } catch {
      setError('Senha incorreta.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-paper px-5">
      <form onSubmit={handleSubmit} className="w-full" style={{ maxWidth: 360 }}>
        <h1 className="h2-brand text-ink">Painel Gomes Tech</h1>
        <p className="body-brand mt-2 text-steel">Área restrita.</p>

        <label className="caption-brand mt-6 block text-steel" htmlFor="password">
          Senha
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoFocus
          className="body-brand mt-2 w-full rounded border px-3 py-2.5"
          style={{ borderColor: 'rgba(11,30,46,0.18)', borderRadius: 4 }}
        />

        {error && (
          <p className="caption-brand mt-3" style={{ color: '#c0392b' }}>
            {error}
          </p>
        )}

        <button type="submit" disabled={loading} className="btn-brand btn-brand-primary mt-6 w-full">
          {loading ? 'Entrando…' : 'Entrar'}
        </button>
      </form>
    </div>
  )
}
