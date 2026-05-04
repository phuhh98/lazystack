import { TanStackDevtools } from '@tanstack/react-devtools'
import { createRootRoute, HeadContent, Scripts, useRouterState } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'

import Container from '@/components/basic/Container'
import Content from '@/components/basic/Content'
import Footer from '@/components/Footer'
import Header from '@/components/Header'
import { isPlanningPokerRoomPath } from '@/lib/constants/routes'
import { cn } from '@/lib/utils/styles'
import { THEME_INIT_SCRIPT } from '@/lib/utils/theme'
import appCss from '@/styles.css?url'

const GA_MEASUREMENT_ID = 'G-2VQ3234CET'
const GA_INIT_SCRIPT = `window.dataLayer = window.dataLayer || [];
function gtag(){window.dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_MEASUREMENT_ID}');`

declare global {
  interface Window {
    dataLayer: any[]
  }
}

export const Route = createRootRoute({
  head: () => ({
    links: [{ href: appCss, rel: 'stylesheet' }],
    meta: [
      { charSet: 'utf-8' },
      { content: 'width=device-width, initial-scale=1', name: 'viewport' },
      { title: 'LazyStack' },
    ],
    scripts: [
      // Google tag (gtag.js)
      {
        async: true,
        src: 'https://www.googletagmanager.com/gtag/js?id=' + GA_MEASUREMENT_ID,
      },
      {
        dangerouslySetInnerHTML: { __html: GA_INIT_SCRIPT },
      },
    ],
  }),
  shellComponent: RootDocument,
})

function FooterConditional() {
  const isGameRoom = useRouterState({
    select: (s) => isPlanningPokerRoomPath(s.location.pathname),
  })
  if (isGameRoom) return null
  return <Footer />
}

function RootDocument({ children }: Readonly<{ children: React.ReactNode }>) {
  const isGameRoom = useRouterState({
    select: (s) => isPlanningPokerRoomPath(s.location.pathname),
  })
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        <HeadContent />
      </head>
      <body className="min-h-100vh w-100vw bg-bg-base dark:bg-dark-teal-900">
        <Container className="flex min-h-screen flex-col" disableDefaultClasses>
          <Header />
          <Content
            className={cn(
              'dark:bg-dark-teal-600/10 bg-amber-200/10',
              'shadow-dark-teal-900/20 shadow-xl dark:shadow-amber-300/20',
              'flex grow flex-col',
              isGameRoom ? 'overflow-hidden' : 'overflow-y-auto',
            )}
          >
            {children}
          </Content>
          <FooterConditional />
        </Container>

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
