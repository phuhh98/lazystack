import { TanStackDevtools } from '@tanstack/react-devtools'
import { createRootRoute, HeadContent, Scripts, useRouterState } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'

import Content from '@/components/basic/Content'
import Footer from '@/components/Footer'
import Header from '@/components/Header'
import { isPlanningPokerRoomPath } from '@/lib/constants/routes'
import { cn } from '@/lib/utils/styles'
import { THEME_INIT_SCRIPT } from '@/lib/utils/theme'
import appCss from '@/styles.css?url'

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
      <body
        className={cn(
          'font-content flex min-h-dvh flex-col wrap-anywhere antialiased selection:bg-[rgba(204,136,83,0.2)]',
          isGameRoom && 'h-dvh',
        )}
      >
        <Header />
        <Content className={cn('grow', isGameRoom ? 'overflow-hidden' : 'overflow-y-auto')}>{children}</Content>
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
