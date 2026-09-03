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
    <div className="admin-ui min-h-screen" style={{ background: '#eef2f6' }}>
      <header className="sticky top-0 z-50" style={{ background: '#eef2f6' }}>
        <div className="band-content flex h-16 items-center justify-between gap-4 overflow-x-auto py-3">
          <nav className="flex items-center gap-1" style={{ whiteSpace: 'nowrap' }}>
            <Link to="/admin" className="admin-nav-link caption-brand text-steel" activeProps={{ className: 'admin-nav-link caption-brand is-active' }} activeOptions={{ exact: true }} style={{ fontWeight: 600 }}>
              Painel
            </Link>
            <Link to="/admin/clientes" className="admin-nav-link caption-brand text-steel" activeProps={{ className: 'admin-nav-link caption-brand is-active' }} style={{ fontWeight: 600 }}>
              Clientes
            </Link>
            <Link to="/admin/leads" className="admin-nav-link caption-brand text-steel" activeProps={{ className: 'admin-nav-link caption-brand is-active' }} style={{ fontWeight: 600 }}>
              Futuros clientes
            </Link>
            <Link to="/admin/projetos" className="admin-nav-link caption-brand text-steel" activeProps={{ className: 'admin-nav-link caption-brand is-active' }} style={{ fontWeight: 600 }}>
              Projetos
            </Link>
            <Link to="/admin/financeiro" className="admin-nav-link caption-brand text-steel" activeProps={{ className: 'admin-nav-link caption-brand is-active' }} style={{ fontWeight: 600 }}>
              Financeiro
            </Link>
          </nav>
          <button
            onClick={handleLogout}
            className="caption-brand text-steel"
            style={{ fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', flexShrink: 0 }}
          >
            Sair
          </button>
        </div>
      </header>

      <main className="band-content pb-10 pt-2">{children}</main>
    </div>
  )
}
