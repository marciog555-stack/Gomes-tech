import { Link, useNavigate } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/react-start'
import { LayoutDashboard, ListChecks, LogOut, UserPlus, Users, Wallet } from 'lucide-react'
import { adminLogout } from '../../lib/admin/auth.functions'

const NAV = [
  { to: '/admin', label: 'Painel', icon: LayoutDashboard, exact: true },
  { to: '/admin/clientes', label: 'Clientes', icon: Users, exact: false },
  { to: '/admin/leads', label: 'Futuros clientes', icon: UserPlus, exact: false },
  { to: '/admin/projetos', label: 'Projetos', icon: ListChecks, exact: false },
  { to: '/admin/financeiro', label: 'Financeiro', icon: Wallet, exact: false },
] as const

export default function AdminChrome({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate()
  const logoutFn = useServerFn(adminLogout)

  async function handleLogout() {
    await logoutFn()
    await navigate({ to: '/admin/login' })
  }

  return (
    <div className="admin-ui relative min-h-screen" style={{ background: '#eef2f6' }}>
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-x-0 top-0 -z-10"
        style={{
          height: 420,
          background:
            'radial-gradient(760px 320px at 12% -10%, rgba(34,162,220,0.16), transparent 60%), radial-gradient(620px 280px at 92% -12%, rgba(11,30,46,0.12), transparent 60%)',
        }}
      />
      <header className="sticky top-0 z-50" style={{ background: 'rgba(238,242,246,0.86)', backdropFilter: 'blur(8px)' }}>
        <div className="band-content flex h-16 items-center justify-between gap-4 overflow-x-auto py-3">
          <nav className="flex items-center gap-1" style={{ whiteSpace: 'nowrap' }}>
            {NAV.map(({ to, label, icon: Icon, exact }) => (
              <Link
                key={to}
                to={to}
                className="admin-nav-link caption-brand flex items-center gap-1.5 text-steel"
                activeProps={{ className: 'admin-nav-link caption-brand is-active flex items-center gap-1.5' }}
                activeOptions={{ exact }}
                style={{ fontWeight: 600 }}
              >
                <Icon size={15} strokeWidth={2.25} />
                {label}
              </Link>
            ))}
          </nav>
          <button
            onClick={handleLogout}
            className="admin-action-link caption-brand items-center gap-1.5 text-steel"
            style={{ fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', flexShrink: 0 }}
          >
            <LogOut size={15} strokeWidth={2.25} />
            Sair
          </button>
        </div>
      </header>

      <main className="band-content pb-10 pt-2">{children}</main>
    </div>
  )
}
