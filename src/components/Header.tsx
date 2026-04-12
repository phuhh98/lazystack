import { Link } from '@tanstack/react-router'
import ThemeToggle from './ThemeToggle'
import GithubIcon from '@/components/brandIcons/GithubIcon'
import XIcon from '@/components/brandIcons/XIcon'
import ExternalLink from '@/components/basic/ExternalLink'

interface NavLink {
  label: string
  to: string
  isExternal: boolean
}

const NAV_LINKS = [
  { label: 'Home', to: '/', isExternal: false },
  { label: 'About', to: '/about', isExternal: false },
  {
    label: 'Docs',
    to: 'https://tanstack.com/start/latest/docs/framework/react/overview',
    isExternal: true,
  },
  {
    label: 'Storybook',
    to: '/storybook',
    isExternal: false,
  },
]

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-(--line) bg-(--header-bg) px-4 backdrop-blur-lg">
      <nav className="page-wrap flex flex-wrap items-center gap-x-3 gap-y-2 py-3 sm:py-4">
        <h2 className="m-0 shrink-0 text-base font-semibold tracking-tight">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-full border border-(--chip-line) bg-(--chip-bg) px-3 py-1.5 text-sm text-[var(--sea-ink)] no-underline shadow-[0_8px_24px_rgba(30,90,72,0.08)] sm:px-4 sm:py-2"
          >
            <span className="h-2 w-2 rounded-full bg-[linear-gradient(90deg,#56c6be,#7ed3bf)]" />
            TanStack Start
          </Link>
        </h2>

        <div className="ml-auto flex items-center gap-1.5 sm:ml-0 sm:gap-2">
          <a
            href="https://x.com/tan_stack"
            target="_blank"
            rel="noreferrer"
            className="hidden rounded-xl p-2 text-[var(--sea-ink-soft)] transition hover:bg-[var(--link-bg-hover)] hover:text-[var(--sea-ink)] sm:block"
          >
            <span className="sr-only">Follow TanStack on X</span>
            <XIcon />
          </a>
          <a
            href="https://github.com/TanStack"
            target="_blank"
            rel="noreferrer"
            className="hidden rounded-xl p-2 text-[var(--sea-ink-soft)] transition hover:bg-[var(--link-bg-hover)] hover:text-[var(--sea-ink)] sm:block"
          >
            <span className="sr-only">Go to TanStack GitHub</span>
            <GithubIcon />
          </a>

          <ThemeToggle />
        </div>

        <div className="order-3 flex w-full flex-wrap items-center gap-x-4 gap-y-1 pb-1 text-sm font-semibold sm:order-2 sm:w-auto sm:flex-nowrap sm:pb-0">
          {NAV_LINKS.map((link) =>
            link.isExternal ? (
              <>
                <ExternalLink
                  key={link.label}
                  href={link.to}
                  className="nav-link"
                  target="_blank"
                  rel="noreferrer"
                >
                  {link.label}
                </ExternalLink>
              </>
            ) : (
              <Link
                key={link.label}
                to={link.to}
                className="nav-link"
                activeProps={{ className: 'nav-link is-active' }}
              >
                {link.label}
              </Link>
            ),
          )}
        </div>
      </nav>
    </header>
  )
}
