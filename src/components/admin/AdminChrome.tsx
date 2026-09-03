import { Link, useNavigate } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/react-start'
import { adminLogout } from '../../lib/admin/auth.functions'

const navLinkClass = 'caption-brand text-steel'
const navLinkStyle: React.CSSProperties = { fontWeight: 600 }
const navLinkActiveStyle: React.CSSProperties = { fontWeight: 700, color: 'var(--ink)' }

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
        <div className="band-content flex h-14 items-center justify-between gap-4 overflow-x-auto">
          <nav className="flex items-center gap-5" style={{ whiteSpace: 'nowrap' }}>
            <Link to="/admin" className={navLinkClass} style={navLinkStyle} activeProps={{ style: navLinkActiveStyle }}>
              Painel
            </Link>
            <Link
              to="/admin/clientes"
              className={navLinkClass}
              style={navLinkStyle}
              activeProps={{ style: navLinkActiveStyle }}
            >
              Clientes
            </Link>
            <Link to="/admin/leads" className={navLinkClass} style={navLinkStyle} activeProps={{ style: navLinkActiveStyle }}>
              Futuros clientes
            </Link>
            <Link
              to="/admin/projetos"
              className={navLinkClass}
              style={navLinkStyle}
              activeProps={{ style: navLinkActiveStyle }}
            >
              Projetos
            </Link>
            <Link
              to="/admin/financeiro"
              className={navLinkClass}
              style={navLinkStyle}
              activeProps={{ style: navLinkActiveStyle }}
            >
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

      <main className="band-content py-8">{children}</main>
    </div>
  )
}
