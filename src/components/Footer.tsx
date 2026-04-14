import ExternalLink from '@/components/basic/ExternalLink'
import GithubIcon from '@/components/brandIcons/GithubIcon'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="mt-20 border-t border-[var(--border)] px-4 pb-14 pt-10 text-[var(--ink-muted)]">
      <div className="page-wrap flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
        <p className="m-0 text-sm">&copy; {year} LazyStack. All rights reserved.</p>
        <ExternalLink
          href="https://github.com/phuhh98"
          withIcon={true}
          className="flex items-center gap-2 text-sm"
        >
          <GithubIcon size={20} />
          <span>phuhh98</span>
        </ExternalLink>
      </div>
    </footer>
  )
}
