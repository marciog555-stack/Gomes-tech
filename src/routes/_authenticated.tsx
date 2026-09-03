import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import AdminChrome from '../components/admin/AdminChrome'
import { checkAdminSession } from '../lib/admin/auth.functions'

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: async () => {
    const { authenticated } = await checkAdminSession()
    if (!authenticated) {
      throw redirect({ to: '/admin/login' })
    }
  },
  component: () => (
    <AdminChrome>
      <Outlet />
    </AdminChrome>
  ),
})
