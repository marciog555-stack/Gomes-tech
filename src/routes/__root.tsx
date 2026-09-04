import { HeadContent, Link, Scripts, createRootRoute } from '@tanstack/react-router'
import Footer from '../components/Footer'
import Header from '../components/Header'

import appCss from '../styles.css?url'

const SITE_TITLE = 'Gomes Tech: Sistemas e produtos sob medida'
const SITE_DESCRIPTION =
  'Software sob medida e produtos prontos pra quem precisa de tecnologia que resolve. Não que complica.'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: SITE_TITLE },
      { name: 'description', content: SITE_DESCRIPTION },
      { property: 'og:title', content: SITE_TITLE },
      { property: 'og:description', content: SITE_DESCRIPTION },
      { property: 'og:type', content: 'website' },
      { property: 'og:image', content: '/og-image.png' },
      { property: 'og:locale', content: 'pt_BR' },
      { name: 'twitter:card', content: 'summary_large_image' },
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500&family=Plus+Jakarta+Sans:wght@700;800&display=swap',
      },
      { rel: 'icon', href: '/favicon.ico', sizes: '32x32' },
      { rel: 'icon', href: '/favicon-32.png', type: 'image/png', sizes: '32x32' },
      { rel: 'apple-touch-icon', href: '/apple-touch-icon.png', sizes: '180x180' },
    ],
  }),
  shellComponent: RootDocument,
  notFoundComponent: NotFound,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <HeadContent />
      </head>
      <body className="bg-paper font-sans text-ink antialiased [overflow-wrap:anywhere]">
        <a href="#main-content" className="skip-link caption-brand">
          Pular para o conteúdo
        </a>
        <Header />
        {children}
        <Footer />
        <Scripts />
      </body>
    </html>
  )
}

function NotFound() {
  return (
    <main id="main-content" className="band-content flex min-h-[60vh] flex-col items-center justify-center text-center">
      <p className="caption-brand text-steel">Erro 404</p>
      <h1 className="h2-brand mt-2 text-ink">Essa página não existe</h1>
      <p className="body-brand mt-2 text-steel">Confira o endereço ou volte para o início.</p>
      <Link to="/" className="btn-brand btn-brand-primary mt-6">
        Voltar para o início
      </Link>
    </main>
  )
}
