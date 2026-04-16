import { TanStackDevtools } from '@tanstack/react-devtools'
import { createRootRoute, HeadContent, Scripts, useRouterState } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'

import Container from '../components/basic/Container'
import Footer from '../components/Footer'
import Header from '../components/Header'
import { cn } from '../lib/utils/styles'
import appCss from '../styles.css?url'

const THEME_INIT_SCRIPT = `(function(){try{var stored=window.localStorage.getItem('theme');var mode=(stored==='light'||stored==='dark'||stored==='auto')?stored:'auto';var prefersDark=window.matchMedia('(prefers-color-scheme: dark)').matches;var resolved=mode==='auto'?(prefersDark?'dark':'light'):mode;var root=document.documentElement;root.classList.remove('light','dark');root.classList.add(resolved);if(mode==='auto'){root.removeAttribute('data-theme')}else{root.setAttribute('data-theme',mode)}root.style.colorScheme=resolved;}catch(e){}})();`

export const Route = createRootRoute({
  head: () => ({
    links: [{ href: appCss, rel: 'stylesheet' }],
    meta: [
      { charSet: 'utf-8' },
      { content: 'width=device-width, initial-scale=1', name: 'viewport' },
      { title: 'LazyStack' },
    ],
  }),
  shellComponent: RootDocument,
})

function FooterConditional() {
  const isGameRoom = useRouterState({
    select: (s) => /^\/planning-poker\/.+/.test(s.location.pathname),
  })
  if (isGameRoom) return null
  return <Footer />
}

function RootDocument({ children }: { children: React.ReactNode }) {
  const isGameRoom = useRouterState({
    select: (s) => /^\/planning-poker\/.+/.test(s.location.pathname),
  })
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        <HeadContent />
      </head>
      <body
        className={cn(
          'font-content flex min-h-screen flex-col wrap-anywhere antialiased selection:bg-[rgba(204,136,83,0.2)]',
          isGameRoom && 'h-screen',
        )}
      >
        <Header />
        <Container className={cn('grow', isGameRoom ? 'overflow-hidden' : 'overflow-y-auto')}>{children}</Container>
        <FooterConditional />
        <TanStackDevtools
          config={{ position: 'bottom-right' }}
          plugins={[
            {
              name: 'Tanstack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
          ]}
        />
        <Scripts />
      </body>
    </html>
  )
}
