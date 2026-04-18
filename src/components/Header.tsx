import { Link } from '@tanstack/react-router'

import BubbleCollisionVeil from '@/components/animations/BubbleCollisionVeil'
import Container from '@/components/basic/Container'
import Content from '@/components/basic/Content'
import useDocumentThemeMode from '@/hooks/useDocumentThemeMode'
import { ROUTES } from '@/lib/constants/routes'
import { cn } from '@/lib/utils/styles'

import ThemeToggle from './ThemeToggle'

const NAV_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'Planning Poker', to: ROUTES.planningPokerBase },
]

export default function Header() {
  const themeMode = useDocumentThemeMode()

  const veilOpacity = themeMode === 'light' ? 0.15 : 0.05

  return (
    <header className={cn('border-border bg-bg-surface sticky top-0 z-50 border-b backdrop-blur-lg')}>
      <div className="relative isolate overflow-hidden">
        <BubbleCollisionVeil className="inset-0" initBlobCount={7} opacity={veilOpacity} overscan={1.2} speed={0.72} />
        <nav aria-label="Primary">
          <Content className="page-wrap relative z-10 py-3 sm:py-4">
            <Container className="gap-x-3 gap-y-2" justify="between" wrap="wrap">
              <Container className="gap-x-3 gap-y-2" justify="start" wrap="wrap">
                <h2 className="m-0 shrink-0 text-base font-semibold tracking-tight">
                  <Link
                    className="border-chip-border bg-chip-bg text-ink inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm no-underline shadow-[0_8px_24px_rgba(200,80,30,0.08)] sm:px-4 sm:py-2"
                    to="/"
                  >
                    <span className="from-primary to-primary-deep h-2 w-2 rounded-full bg-linear-to-r" />
                    <span className="font-title text-xl">LazyStack</span>
                  </Link>
                </h2>

                <Container className="ml-2 gap-x-4 gap-y-1 text-sm font-semibold" justify="start" wrap="wrap">
                  {NAV_LINKS.map((link) => (
                    <Link
                      activeProps={{ className: 'nav-link is-active' }}
                      className="nav-link"
                      key={link.label}
                      to={link.to}
                    >
                      {link.label}
                    </Link>
                  ))}
                </Container>
              </Container>

              <Container className="ml-auto gap-1.5 sm:gap-2" disableDefaultClasses={true}>
                <ThemeToggle />
              </Container>
            </Container>
          </Content>
        </nav>
      </div>
    </header>
  )
}
