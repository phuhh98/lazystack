import ExternalLink from '@/components/basic/ExternalLink'
import GithubIcon from '@/components/brandIcons/GithubIcon'
import XIcon from '@/components/brandIcons/XIcon'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="mt-20 border-t border-[var(--line)] px-4 pb-14 pt-10 text-[var(--sea-ink-soft)]">
      <div className="page-wrap flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
        <p className="m-0 text-sm">
          &copy; {year} Your name here. All rights reserved.
        </p>
        <p className="island-kicker m-0">Built with TanStack Start</p>
      </div>
      <div className="mt-4 flex justify-center gap-4">
        <ExternalLink href="https://x.com/tan_stack" withIcon={true}>
          <span className="sr-only">Follow TanStack on X</span>
          <XIcon size={32} />
        </ExternalLink>

        <ExternalLink href="https://github.com/TanStack" withIcon={true}>
          <span className="sr-only">Go to TanStack GitHub</span>
          <GithubIcon size={32} />
        </ExternalLink>
      </div>
    </footer>
  )
}
