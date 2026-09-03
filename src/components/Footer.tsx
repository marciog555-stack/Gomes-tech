import { waLink } from '../lib/whatsapp'

export default function Footer() {
  return (
    <footer className="band band-paper rule-paper border-t">
      <div className="band-content">
        <div className="grid gap-6 sm:grid-cols-3">
          <a href={waLink('rodapé do site')} target="_blank" rel="noopener noreferrer" className="link-brand">
            <span className="caption-brand block text-steel">WhatsApp</span>
            <span className="body-brand text-ink" style={{ fontWeight: 600 }}>
              (62) 98269-8911
            </span>
          </a>

          <a href="mailto:gomestech555@gmail.com" className="link-brand">
            <span className="caption-brand block text-steel">E-mail</span>
            <span className="body-brand text-ink" style={{ fontWeight: 600 }}>
              gomestech555@gmail.com
            </span>
          </a>

          <div>
            <span className="caption-brand block text-steel">Cidade</span>
            <span className="body-brand text-ink" style={{ fontWeight: 600 }}>
              Anápolis, GO
            </span>
          </div>
        </div>

        <p className="caption-brand mt-8 text-steel">Gomes Tech</p>
      </div>
    </footer>
  )
}
