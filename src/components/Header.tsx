import { waLink } from '../lib/whatsapp'

export default function Header() {
  return (
    <header
      className="rule-paper sticky top-0 z-50 border-b bg-paper"
      style={{ height: 'var(--header-h)' }}
    >
      <div className="band-content flex h-full items-center justify-between gap-3">
        <a
          href="#topo"
          className="flex min-w-0 shrink items-center gap-2"
          aria-label="Gomes Tech"
        >
          <img
            src="/logo-icon-gradient.png"
            alt=""
            className="h-6 w-auto shrink-0 sm:h-7 md:h-8"
            width={251}
            height={253}
          />
          <span className="h3-brand shrink-0 whitespace-nowrap text-navy-900" style={{ fontSize: '16px' }}>
            GOMES<span className="text-cyan-500">TECH</span>
          </span>
        </a>

        <a
          href={waLink('topo do site')}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-brand btn-brand-primary btn-brand-sm shrink-0"
        >
          Falar no WhatsApp
        </a>
      </div>
    </header>
  )
}
