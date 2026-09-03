import { Link, useNavigate } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/react-start'
import { adminLogout } from '../../lib/admin/auth.functions'

export default function AdminChrome({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate()
  const logoutFn = useServerFn(adminLogout)

  async function handleLogout() {
    await logoutFn()
    await navigate({ to: '/admin/login' })
  }

  return (
    <div className="min-h-screen bg-paper">
      <header className="rule-paper sticky top-0 z-50 border-b bg-paper">
        <div className="band-content flex h-14 items-center justify-between gap-4">
          <nav className="flex items-center gap-5">
            <Link to="/admin" className="caption-brand font-semibold text-ink" style={{ fontWeight: 700 }}>
              Painel
            </Link>
            <Link to="/admin/clientes" className="caption-brand text-steel" style={{ fontWeight: 600 }}>
              Clientes
            </Link>
            <Link to="/admin/financeiro" className="caption-brand text-steel" style={{ fontWeight: 600 }}>
              Financeiro
            </Link>
          </nav>
          <button
            onClick={handleLogout}
            className="caption-brand text-steel"
            style={{ fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}
          >
            Sair
          </button>
        </div>
      </header>

      <main className="band-content py-8">{children}</main>
    </div>
  )
}
