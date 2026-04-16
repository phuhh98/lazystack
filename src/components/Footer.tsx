import ExternalLink from '@/components/basic/ExternalLink'
import GithubIcon from '@/components/brandIcons/GithubIcon'
import { cn } from '@/lib/utils/styles'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className={cn('bg-bg-surface border-border border-t', 'px-4 pt-8 pb-6')}>
      <div className="page-wrap flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
        <p className={cn('text text-ink-muted m-0 text-sm')}>&copy; {year} LazyStack. All rights reserved.</p>

        <ExternalLink className="flex items-center gap-2 text-sm" href="https://github.com/phuhh98" withIcon={true}>
          <GithubIcon className="fill-ink" size={20} />
          <span className="text-ink">phuhh98</span>
        </ExternalLink>
      </div>
    </footer>
  )
}
