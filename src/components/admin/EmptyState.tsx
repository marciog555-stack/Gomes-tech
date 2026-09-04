import { ADMIN_CARD, adminIconBadge } from '../../lib/admin/ui'

export default function EmptyState({
  icon: Icon,
  iconColor,
  title,
  description,
}: {
  icon: typeof import('lucide-react').Users
  iconColor: string
  title: string
  description: string
}) {
  return (
    <div className="mt-4 flex flex-col items-center gap-3 p-10 text-center" style={{ ...ADMIN_CARD, borderStyle: 'dashed' }}>
      <div style={adminIconBadge(iconColor)}>
        <Icon size={19} strokeWidth={2.25} />
      </div>
      <div>
        <p className="body-brand text-ink" style={{ fontWeight: 600 }}>
          {title}
        </p>
        <p className="caption-brand mt-1 text-steel">{description}</p>
      </div>
    </div>
  )
}
