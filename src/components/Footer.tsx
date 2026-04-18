import BubbleCollisionVeil from '@/components/animations/BubbleCollisionVeil'
import Container from '@/components/basic/Container'
import Content from '@/components/basic/Content'
import ExternalLink from '@/components/basic/ExternalLink'
import Typography from '@/components/basic/Typography'
import GithubIcon from '@/components/brandIcons/GithubIcon'
import useDocumentThemeMode from '@/hooks/useDocumentThemeMode'
import { cn } from '@/lib/utils/styles'

export default function Footer() {
  const themeMode = useDocumentThemeMode()
  const year = new Date().getFullYear()
  const veilOpacity = themeMode === 'light' ? 0.15 : 0.05

  return (
    <footer className={cn('border-border bg-bg-surface relative isolate overflow-hidden border-t', 'px-4 pt-8 pb-6')}>
      <BubbleCollisionVeil className="inset-0" initBlobCount={10} opacity={veilOpacity} overscan={1.35} speed={0.72} />

      <Content className="page-wrap relative z-10">
        <Container className="gap-4 text-center sm:flex-row sm:text-left" direction="col" justify="between">
          <Typography as="p" className="text-ink-muted m-0 text-sm">
            &copy; {year} LazyStack. All rights reserved.
          </Typography>

          <ExternalLink
            className="text-ink-muted hover:text-ink flex items-center gap-2 text-sm"
            href="https://github.com/phuhh98"
            withIcon={true}
          >
            <GithubIcon className="fill-ink" size={20} />
            <Typography as="span" className="text-ink text-sm leading-none">
              phuhh98
            </Typography>
          </ExternalLink>
        </Container>
      </Content>
    </footer>
  )
}
